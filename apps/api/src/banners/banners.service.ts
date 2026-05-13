import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, FindManyOptions, In } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Product } from '../product/entities/product.entity';
import { Category } from '../category/entities/category.entity';

// Import Multer types
declare module 'express' {
  interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  }
}

type MulterFile = Express.Multer.File;

/**
 * Service responsible for handling banner-related operations
 */
@Injectable()
export class BannersService {
  private readonly logger = new Logger(BannersService.name);
  constructor(
    @InjectRepository(Banner)
    private bannersRepository: Repository<Banner>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  /**
   * Create a new banner
   * @param createBannerDto Banner data to create
   * @returns Created banner
   */
  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    try {
      this.logger.log('Creating a new banner');
      const { categoryId, productIds, ...rest } = createBannerDto;

      const banner = this.bannersRepository.create({
        ...rest,
        isDeleted: false,
      });

      if (categoryId) {
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (category) {
          banner.category = category;
        }
      }

      // Handle products
      let bannerProducts: Product[] = [];
      if (categoryId) {
        const categoryProducts = await this.productRepository.find({
          where: { category: { id: categoryId } },
        });
        bannerProducts = [...categoryProducts];
      }

      if (productIds && productIds.length > 0) {
        const specificProducts = await this.productRepository.find({
          where: { id: In(productIds) },
        });

        // Merge without duplicates
        const productMap = new Map();
        bannerProducts.forEach(p => productMap.set(p.id, p));
        specificProducts.forEach(p => productMap.set(p.id, p));
        bannerProducts = Array.from(productMap.values());
      }

      banner.products = bannerProducts;

      const savedBanner = await this.bannersRepository.save(banner);
      this.logger.log(`Banner created with ID: ${savedBanner.id}`);

      return savedBanner;
    } catch (error) {
      this.logger.error(`Error creating banner: ${error.message}`, error.stack);
      if (error.code === '23505') {
        throw new ConflictException('Banner with similar details already exists');
      }
      throw new InternalServerErrorException('Failed to create banner');
    }
  }

  /**
   * Retrieves all banners with pagination and filtering
   */
  async findAll({ page = 1, limit = 10, search }) {
    try {
      this.logger.log(`Fetching banners - Page: ${page}, Limit: ${limit}`);
      const skip = (page - 1) * limit;
      const where: any = {};
      if (search) {
        where.name = Like(`%${search}%`);
      }

      const [data, total] = await this.bannersRepository.findAndCount({
        where,
        withDeleted: false,
        relations: ['category', 'products'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);
      return {
        result: data,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      this.logger.error(`Error fetching banners: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch banners');
    }
  }

  /**
   * Finds a banner by ID
   */
  async findOne(id: string, withDeleted = false): Promise<Banner> {
    try {
      this.logger.log(`Finding banner with ID: ${id}`);
      const where: FindOptionsWhere<Banner> = { id };
      if (!withDeleted) {
        where.isDeleted = false;
      }

      const banner = await this.bannersRepository.findOne({
        where,
        withDeleted,
        relations: ['category', 'products'],
      });

      if (!banner) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }
      return banner;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error finding banner ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve banner');
    }
  }

  /**
   * Updates a banner
   */
  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    try {
      this.logger.log(`Updating banner with ID: ${id}`);
      const { categoryId, productIds, ...rest } = updateBannerDto;

      const banner = await this.bannersRepository.findOne({
        where: { id },
        relations: ['category', 'products'],
      });

      if (!banner) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }

      this.bannersRepository.merge(banner, rest);

      if (categoryId !== undefined) {
        if (categoryId) {
          const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
          if (category) {
            banner.category = category;
          }
        }
      }

      if (categoryId !== undefined || productIds !== undefined) {
        let bannerProducts: Product[] = [];
        const targetCategoryId = categoryId !== undefined ? categoryId : (banner.category?.id);

        if (targetCategoryId) {
          const categoryProducts = await this.productRepository.find({
            where: { category: { id: targetCategoryId } },
          });
          bannerProducts = [...categoryProducts];
        }

        const targetProductIds = productIds !== undefined ? productIds : [];
        if (targetProductIds && targetProductIds.length > 0) {
          const specificProducts = await this.productRepository.find({
            where: { id: In(targetProductIds) },
          });
          const productMap = new Map();
          bannerProducts.forEach(p => productMap.set(p.id, p));
          specificProducts.forEach(p => productMap.set(p.id, p));
          bannerProducts = Array.from(productMap.values());
        }
        banner.products = bannerProducts;
      }

      banner.updatedAt = new Date();
      const savedBanner = await this.bannersRepository.save(banner);
      return savedBanner;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error updating banner ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update banner');
    }
  }

  /**
   * Soft deletes a banner
   */
  async remove(id: string): Promise<void> {
    try {
      const result = await this.bannersRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Banner with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error deleting banner ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete banner');
    }
  }

  /**
   * Uploads a banner image
   */
  async uploadImage(file: MulterFile): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    try {
      const imageUrl = `https://example.com/uploads/${Date.now()}-${file.originalname}`;
      return { url: imageUrl };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  /**
   * Restores a soft-deleted banner
   */
  async restore(id: string): Promise<Banner> {
    try {
      const result = await this.bannersRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Banner with ID ${id} not found or already active`);
      }
      return this.findOne(id, true);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error restoring banner ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to restore banner');
    }
  }
}
