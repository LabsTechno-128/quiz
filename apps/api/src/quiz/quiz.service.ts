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
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async create(createQuizDto: CreateQuizDto): Promise<{ result: Quiz }> {
    const quiz = this.quizRepository.create(createQuizDto);
    if (createQuizDto.categoryId) {
      const findCategory = await this.categoryRepository.findOne({
        where: { id: createQuizDto.categoryId },
      });
      if (findCategory) {
        quiz.category = findCategory;
      }

    }
    const savedQuiz = await this.quizRepository.save(quiz);
    return {
      result: (await this.findOne(savedQuiz.id)).result,

    }
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
      relations: ['questions', 'questions.option','answers','answers.users'],
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

  async findOne(id: string): Promise<{ result: Quiz }> {
    const quiz = await this.quizRepository.findOne({
      where: { id }, 
      withDeleted: false,
      relations: ['category','questions','questions.option','answers','answers.users'],
    });
    console.log("idsi ci","welcom home")

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return {
      result:quiz
    };
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.findOne(id);
     Object.assign(quiz.result, updateQuizDto);
    await this.quizRepository.save(quiz.result);
    return this.findOne(id).then(res => res.result);
  }

  async remove(id: string): Promise<void> {
    const result = await this.quizRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
  }
  // catgory wise quiz fetch 
  async findByCategory(categoryId: string): Promise<{ result: Quiz[] }> {
    const quizzes = await this.quizRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'questions', 'questions.option'],
      withDeleted: false,
    });
    return {
      result:quizzes
    };
  }
}
