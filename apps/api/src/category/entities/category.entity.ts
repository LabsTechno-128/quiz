import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 150, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  // Parent Category relation
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent?: Category;

  // Children categories relation
  @OneToMany(() => Category, (category) => category.parent)
  children?: Category[];

  @OneToMany(() => Category, (category) => category.quizs)
  @JoinColumn()
  quizs?: Category[];

  //    here also relation two model
  // book list and quizz and question model

  @Column({ default: true })
  status: boolean;

 @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
   createdAt: Date;
 
   @UpdateDateColumn({
     type: 'timestamptz',
     default: () => 'CURRENT_TIMESTAMP',
     onUpdate: 'CURRENT_TIMESTAMP',
   })
   updatedAt: Date;
 
   @DeleteDateColumn({ type: 'timestamptz', nullable: true })
   deletedAt: Date | null;
}
