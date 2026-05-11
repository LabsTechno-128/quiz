import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductType } from './entities/product.entity';
import { CreateProductDto } from './dto/create.dto';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) { }

  async create(payload: CreateProductDto) {
    let category: Category | undefined;
    if (payload.categoryId) {
      category = (await this.categoryService.findOne(payload.categoryId)).result;
      if (!category) {
        throw new NotFoundException(`Category with ID ${payload.categoryId} not found`);
      }
    }
    const product = this.productRepository.create({
      ...payload,
      category,
    });
    return this.productRepository.save(product);
  }

  async findAll(query: {
    categoryId?: string;
    type?: ProductType;
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { categoryId, type, search, isActive = true, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive });

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (type) {
      queryBuilder.andWhere('product.type = :type', { type });
    }

    if (search) {
      queryBuilder.andWhere('(product.title ILIKE :search OR product.author ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [items, total] = await queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
