import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { BadRequestException } from '@nestjs/common';

export enum ProductType {
  EBOOK = 'ebook',
  ALL = 'all',
  GADGET = 'gadget',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.ALL,
  })
  @Index()
  type: ProductType;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, nullable: true })
  author: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  buyPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sellPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  offerPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPercentage: number;

  // Physical book stock
  @Column({ type: 'int', nullable: true })
  stock: number;

  // Digital ebook delivery
  @Column({ type: 'varchar', length: 500, nullable: true })
  fileUrl: string;

  @Column({ default: true })
  isActive: boolean;

  // rating add
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  rating: number;

  // total sell count 
  @Column({ type: 'int', default: 0, nullable: true })
  totalSell: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @Index()
  category: Category;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  // validate price related validation do here 
  @BeforeInsert()
  @BeforeUpdate()
  async validatePrice() {
    try {
      if (this.sellPrice <= this.buyPrice) {
        throw new BadRequestException('Sell price must be greater than buy price');
      }
      if (this.offerPrice && this.offerPrice >= this.sellPrice) {
        throw new BadRequestException('Offer price must be less than sell price');
      }
      if (this.offerPrice && this.offerPrice <= this.buyPrice && this.offerPrice < this.sellPrice) {
        throw new BadRequestException('Offer price must be greater than buy price');
      }
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  // here add on before insert and update calculate discound percentage 
  @BeforeInsert()
  @BeforeUpdate()
  async calculateDiscountPercentage() {
    try {
      if (this.offerPrice) {
        this.discountPercentage = Math.round(((this.sellPrice - this.offerPrice) / this.sellPrice) * 100);
      } else {
        this.discountPercentage = 0;
      }
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
  @BeforeInsert()
  @BeforeUpdate()
  async validateRating() {
    try {
      if (this.rating && this.rating > 5) {
        throw new BadRequestException('Rating must be less than or equal to 5');
      }
      if (this.rating && this.rating < 1) {
        throw new BadRequestException('Rating must be greater than or equal to 1');
      }
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

}
