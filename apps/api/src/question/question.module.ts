import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { Option } from './entities/option.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { QuestionService } from './question.service';
import { AnswerService } from './answer.service';
import { QuestionController } from './question.controller';
import { AnswerController } from './answer.controller';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer, Option, Quiz,User])],
  providers: [QuestionService, AnswerService],
  controllers: [QuestionController, AnswerController],
  exports: [QuestionService, AnswerService],
})
export class QuestionModule {}
