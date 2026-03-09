import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ebook } from './entities/ebook.entity';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import { EbookResponseDto } from './dto/ebook-response.dto';

@Injectable()
export class EbooksService {
  constructor(
    @InjectRepository(Ebook)
    private readonly ebookRepository: Repository<Ebook>,
  ) {}

  async create(createEbookDto: CreateEbookDto): Promise<Ebook> {
    const ebook = this.ebookRepository.create(createEbookDto);

    const savedEbook = await this.ebookRepository.save(ebook);
    return savedEbook;
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ data: Ebook[]; total: number }> {
    try {
      const options: any = {
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' as const },
      };

      if (search) {
        options.where = [
          { title: search },
          { author: search },
          { description: search },
        ];
      }

      const [result, total] = await this.ebookRepository.findAndCount(options);
      return {
        data: result,
        total,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findOne(id: string)  {
    const ebook = await this.ebookRepository.findOne({ where: { id } });
    if (!ebook) {
      throw new NotFoundException(`Ebook with ID ${id} not found`);
    }
    return ebook;
  }

  async update(
    id: string,
    updateEbookDto: UpdateEbookDto,
  )  {
    const ebook = await this.ebookRepository.findOne({ where: { id } });
    if (!ebook) {
      throw new NotFoundException(`Ebook with ID ${id} not found`);
    }

    await this.ebookRepository.update(id, updateEbookDto);
    const updatedEbook = await this.ebookRepository.findOne({ where: { id } });
    if (!updatedEbook) {
      throw new NotFoundException(`Ebook with ID ${id} not found after update`);
    }
    return  updatedEbook;
  }

  async remove(id: string): Promise<void> {
    try {
      const ebook = await this.ebookRepository.findOne({ where: { id } });
      if (!ebook) {
        throw new NotFoundException(`Ebook with ID ${id} not found`);
      }

      await this.ebookRepository.remove(ebook);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }
 
  private handleDatabaseError(error: any): never {
    console.error('Database error:', error);
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new Error('An error occurred while processing your request');
  }
}
