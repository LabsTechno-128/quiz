import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AttachmentsService } from './attachments.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { Attachment } from './entities/attachment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Express, Response } from 'express';
@ApiTags('attachments')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: UploadFileDto,
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: Attachment,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    return this.attachmentsService.uploadFile(file, folder);
  }


  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Returns the attachment',
    type: Attachment,
  })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async getFile(@Param('id') id: string): Promise<Attachment> {
    const attachment = await this.attachmentsService.findById(id);
    if (!attachment) {
      throw new Error('Attachment not found');
    }
    return attachment;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async deleteFile(@Param('id') id: string): Promise<{ message: string }> {
    const attachment = await this.attachmentsService.findById(id);
    if (!attachment) {
      throw new Error('Attachment not found');
    }
    await this.attachmentsService.deleteFile(attachment.publicId);
    return { message: 'File deleted successfully' };
  }


  @Get('download/proxy')
  async downloadProxy(
    @Query('url') url: string,
    @Query('filename') filename: string,
    @Res() res: Response,
  ) {
    if (!url) throw new BadRequestException('URL is required');

    if (!url.startsWith('https://res.cloudinary.com/')) {
      throw new ForbiddenException('Invalid URL');
    }

    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch file from Cloudinary');

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
    const safeFilename = filename ?? url.split('/').pop()?.split('?')[0] ?? 'download';

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${safeFilename}"`,
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'no-store',
    });

    res.send(buffer);
  }
}
