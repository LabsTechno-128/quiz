import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';


@Entity('banners')
// @Index(['isDeleted']) // Add index for better query performance
@Index(['deletedAt'])
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subName: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => Category, (category) => category.banners, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Index()
  category: Category;


  // status add 
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
