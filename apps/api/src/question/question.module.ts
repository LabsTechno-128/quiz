import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { Option } from './entities/option.entity';
import { QuestionService } from './question.service';
import { AnswerService } from './answer.service';
import { QuestionController } from './question.controller'; 

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer,Option])],
  providers: [QuestionService, AnswerService],
  controllers: [QuestionController ],
  exports: [QuestionService, AnswerService],
})
export class QuestionModule {}
