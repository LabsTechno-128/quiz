import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entities/answer.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('answers')
@Controller('answers')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}
  

  @Post()
   @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Answer created', type: Answer })
  create(@Req() req: any , @Body() dto: CreateAnswerDto) {
    console.log(dto);
    return this.answerService.create(req.user.id,dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all questions' })
  @ApiResponse({
    status: 200,
    description: 'List of questions',
    type: [Answer],
  })
  findAll() {
    return this.answerService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Single question', type: Answer })
  findOne(@Param('id') id: string) {
    return this.answerService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Question updated', type: Answer })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAnswerDto,
  ): Promise<Answer> {
    return this.answerService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Question deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.answerService.remove(id);
  }
}
