import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Option } from './entities/option.entity';
import { Question } from './entities/question.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';


@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) { }

  async create(createDto: CreateAnswerDto) {
    const quizRepo = await this.quizRepository.findOne({ where: { id: createDto.quizId } });
    if (!quizRepo) {
      throw new NotFoundException(`Quiz with ID ${createDto.quizId} not found`);
    }
    const answer = this.answerRepository.create({
      quiz: quizRepo,
    });  
    let totalQuestionLength = createDto.questionAnswerDto.length;
    let questionIds:string[] = [];
    let optionIds:string[] = [];
    let correctOptionIds:string[] = [];
    let totalCorrectCount = 0;
     
    for (let submitData of createDto.questionAnswerDto) {
      if (submitData.optionId) {
        optionIds.push(submitData.optionId);
        const optionRep  = await this.optionRepository.findOne({ where: { id: submitData.optionId, isCorrect: true } });
        if (optionRep) {
           totalCorrectCount++;
           correctOptionIds.push(optionRep.id);
        }
      } 
    }
    let questionRepo = await this.questionRepository.find({ where: {  id: In(questionIds) } });
    const length = optionIds.length;
    answer.totalQuestion =totalQuestionLength;
    answer.notAttemptedQuestion = totalQuestionLength - length;
    answer.totalScore = totalQuestionLength;
    answer.wrongScore = totalQuestionLength - totalCorrectCount;
    answer.correctScore = totalCorrectCount;
    answer.correctOptionId = correctOptionIds;
    answer.question_answer = questionRepo;
    return this.answerRepository.save(answer);

  }

  async findAll(questionId?: string): Promise<Answer[]> {

    return this.answerRepository.find({
      relations: ['quiz'],
      withDeleted: false,
    });
  }

  async findOne(id: string): Promise<Answer> {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: ['question'],
      withDeleted: false,
    });
    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
    return answer;
  }

  async update(id: string, updateDto: UpdateAnswerDto): Promise<Answer> {
    await this.answerRepository.update(id, updateDto as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const res = await this.answerRepository.softDelete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
  }
}
