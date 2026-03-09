import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('ebooks')
export class Ebook {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string ;

  @Column({ type: 'text', nullable: true })
  description: string ;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author: string ;

  @Column('varchar', { array: true, nullable: true })
  categories: string[]  ;

  @Column({ type: 'varchar', length: 500, nullable: true })
  ebookFileUrl: string ;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImageUrl: string  ;

  @Column({ type: 'text', nullable: true })
  publishedAt:string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
 
}
