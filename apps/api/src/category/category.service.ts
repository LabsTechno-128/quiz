import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const parent = dto.parent_id
      ? await this.categoryRepo.findOne({
          where: { id: dto.parent_id },
        })
      : undefined;
    const category = this.categoryRepo.create({
      ...dto,
      ...(parent && { parent }),
    });
    return this.categoryRepo.save(category);
  }

  async findAll(): Promise<{ result: Category[]; message: string }> {
    return {
      result: await this.categoryRepo.find({
        relations: ['parent', 'children'],
        order: {
          createdAt: 'DESC',
        },
      }),
      message: 'Categories retrieved successfully',
    };
  }

  async findOne(id: string): Promise<{ result: Category; message: string }> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return { result: category, message: 'Category found' };
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category.result, dto);
    console.log(category,dto);
    return this.categoryRepo.save(category.result);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category.result);
  }
}
