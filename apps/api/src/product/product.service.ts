import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductType } from './entities/product.entity';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';
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
    const result = await this.productRepository.save(product);
    return { result, message: 'Product created successfully' };
  }

  async findAll(query: {
    categoryId?: string;
    categorySlug?: string;
    type?: ProductType;
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { categoryId, categorySlug, type, search, isActive = true, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    console.log(categorySlug)

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive });

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (categorySlug) {
      queryBuilder.andWhere('category.slug = :categorySlug', { categorySlug });
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
      result: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Products retrieved successfully',
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

    return { result: product, message: 'Product retrieved successfully' };
  }

  async update(id: string, payload: UpdateProductDto) {
    const product = await this.findOne(id);

    let category: Category | undefined;
    if (payload.categoryId) {
      const categoryRes = await this.categoryService.findOne(payload.categoryId);
      category = categoryRes.result;
      if (!category) {
        throw new NotFoundException(`Category with ID ${payload.categoryId} not found`);
      }
    }

    const updatedProduct = this.productRepository.merge(product.result, {
      ...payload,
      category: category !== undefined ? category : product.result.category,
    });

    const result = await this.productRepository.save(updatedProduct);
    return { result, message: 'Product updated successfully' };
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    const result = await this.productRepository.softRemove(product.result);
    return { result, message: 'Product removed successfully' };
  }
}
