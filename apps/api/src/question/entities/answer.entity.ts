import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Question } from './question.entity'; 
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.answers, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  quiz: Quiz;


  @OneToMany(() => Question, (answer) => answer.question_answer, {
    cascade: true,
    nullable: true,
  })
  question_answer: Question[];
    

  @Column({ type: 'int', nullable: true })
  totalScore: number;

  @Column({ type: 'int', nullable: true })
  wrongScore: number;

  @Column({ type: 'int', nullable: true })
  correctScore: number;

  @Column({ type: 'int', nullable: true })
  totalQuestion: number;

  @Column({ type: 'int', nullable: true })
  notAttemptedQuestion: number;

  @Column("uuid", { array: true, nullable: true })
 correctOptionId: string[];

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
