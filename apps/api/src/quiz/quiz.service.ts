import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    console.log(createQuizDto);
    const quiz = this.quizRepository.create(createQuizDto);
    const savedQuiz = await this.quizRepository.save(quiz);
    return this.findOne(savedQuiz.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    includeRelations: boolean = false,
  ): Promise<{
    result: Quiz[];
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  }> {
    const [data, total] = await this.quizRepository.findAndCount({
      relations: ['questions', 'questions.option'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      withDeleted: false,
    });

    return {
      result: data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.option'],
      withDeleted: false,
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.findOne(id);

    // if (updateQuizDto.questions) {
    //   // Remove existing questions and options
    //   await this.removeQuestions(quiz.id);

    //   // Add new questions
    //   await this.addQuestionsToQuiz(quiz.id, updateQuizDto.questions);

    //   // Remove questions from DTO to avoid updating them directly
    //   const { questions, ...updateData } = updateQuizDto;

    //   // Only update if there are other fields to update
    //   if (Object.keys(updateData).length > 0) {
    //     await this.quizRepository.update(id, updateData as any);
    //   }
    // } else {
    //   await this.quizRepository.update(id, updateQuizDto as any);
    // }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.quizRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
  }
}
