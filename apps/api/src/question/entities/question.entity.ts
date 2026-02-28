import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Option } from './option.entity'; 
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'boolean' , default: false  })
  status: boolean;

  @Column({ type: 'text',nullable: true })
  slug: string;

  @Column({ type: 'text',nullable: true })
  description: string;

  @OneToMany(() => Option, (option) => option.question, {
    cascade: true,  nullable: true
  })
  option: Option[];

   @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
      onDelete: 'CASCADE', nullable: true
    })
    @JoinColumn(  )
    quiz: Quiz;

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
