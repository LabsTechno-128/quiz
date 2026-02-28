import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn('uuid')
   id:string;
 

  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => Question, (question) => question.option, {
    onDelete: 'CASCADE', nullable: true
  })
  @JoinColumn(  )
  question: Question;

  @Column({ type: 'boolean' , default: false  })
  isCorrect: boolean;

   
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
