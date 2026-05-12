import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { Attachment } from './entities/attachment.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
  ) { }

  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ) {
    if (!file) {
      throw new NotFoundException('No file provided');
    }
    var results: any;
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const isPdf = file.mimetype === 'application/pdf';

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder || 'attachments',

            // 🔥 important: pdf = raw, image = auto
            resource_type: isPdf ? 'raw' : 'image',
            use_filename: true,
            unique_filename: true,
            // keep filename
            public_id: `attachments/${Date.now()}-${file.originalname.split('.')[0]}`,
            filename_override: `${Date.now()}-${file.originalname}`,
          },
          (error, result) => {
            if (error) return reject(error);
            console.log(result);
            results = result
            resolve(result);
          },
        );

        uploadStream.end(file.buffer);
      });

      const attachment = new Attachment();

      attachment.publicId = result.public_id;

      // 🔥 normal preview URL
      attachment.url = result.secure_url;

      // 🔥 force download URL (IMPORTANT FIX)
      attachment.downloadUrl = result.secure_url.replace(
        '/upload/',
        '/upload/fl_attachment/',
      );

      attachment.secureUrl = result.secure_url;

      attachment.format = result.format;
      attachment.width = result.width;
      attachment.height = result.height;
      attachment.bytes = result.bytes;

      // file type detect
      if (
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(result.format)
      ) {
        attachment.type = 'image';
      } else if (
        ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(result.format)
      ) {
        attachment.type = 'document';
      } else if (['mp4', 'webm', 'mov', 'avi'].includes(result.format)) {
        attachment.type = 'video';
      } else if (['mp3', 'wav', 'ogg'].includes(result.format)) {
        attachment.type = 'audio';
      } else {
        attachment.type = 'other';
      }
      const attachmentData = await this.attachmentsRepository.save(attachment)
      return {
        result: results,
        url: result.url || attachmentData.url,
        attachment: attachmentData
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      await this.attachmentsRepository.delete({ publicId });
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Attachment | null> {
    return this.attachmentsRepository.findOne({ where: { id } });
  }
}