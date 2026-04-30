import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';

export enum ProductType {
  BOOK = 'book',
  EBOOK = 'ebook',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.BOOK,
  })
  @Index()
  type: ProductType;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
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

  // Physical book stock
  @Column({ type: 'int', nullable: true })
  stock: number;

  // Digital ebook delivery
  @Column({ type: 'varchar', length: 500, nullable: true })
  fileUrl: string;

  @Column({ default: true })
  isActive: boolean;

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
}
