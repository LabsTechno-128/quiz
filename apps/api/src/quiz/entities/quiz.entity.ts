import { Answer } from 'src/question/entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Category } from 'src/category/entities/category.entity';

// Using string literal for relation to avoid circular dependency

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @OneToMany(() => Question, (question) => question.quiz, {
    cascade: true,
    nullable: true,
  })
  questions: Question[];

   @OneToMany(() => Answer, (answer) => answer.quiz, {
      cascade: true,
      nullable: true,
    })
    answers: Answer[];

    @ManyToOne(() => Category, (category) => category.quizs)
    @JoinColumn()
    category: Category;
    
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
