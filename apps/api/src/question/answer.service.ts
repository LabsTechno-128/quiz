import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Option } from './entities/option.entity';
import { Question } from './entities/question.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { User } from 'src/user/entities/user.entity';


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
    @InjectRepository(User)
    private userRepository: Repository<User>, 
  ) { }

  async create(userId: string, createDto: CreateAnswerDto) {
    // 1. Check if user already participated in this quiz
    const existingAnswer = await this.answerRepository.findOne({
      where: {
        quiz: { id: createDto.quizId },
        users: { id: userId },
      },
    });

    if (existingAnswer) {
      return existingAnswer; // Or throw error: throw new BadRequestException('Already participated');
    }

    const quizRepo = await this.quizRepository.findOne({ where: { id: createDto.quizId } });
    if (!quizRepo) {
      throw new NotFoundException(`Quiz with ID ${createDto.quizId} not found`);
    }

    const answer = this.answerRepository.create({
      quiz: quizRepo,
    });

    let totalQuestionLength = createDto.questionAnswerDto.length;
    let correctOptionIds: string[] = [];
    let totalCorrectCount = 0;
    let attemptedCount = 0;

    for (let submitData of createDto.questionAnswerDto) {
      if (submitData.optionId) {
        attemptedCount++;
        const optionRep = await this.optionRepository.findOne({
          where: { id: submitData.optionId, isCorrect: true },
        });
        if (optionRep) {
          totalCorrectCount++;
          correctOptionIds.push(optionRep.id);
        }
      }
    }

    answer.totalQuestion = totalQuestionLength;
    answer.notAttemptedQuestion = totalQuestionLength - attemptedCount;
    answer.totalScore = totalQuestionLength; // Max score
    answer.wrongScore = attemptedCount - totalCorrectCount;
    answer.correctScore = totalCorrectCount;
    answer.correctOptionId = correctOptionIds;

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        answer.users = [user];
      }
    }

    const savedAnswer = await this.answerRepository.save(answer);
    
    // Increment participant count in Quiz
    await this.quizRepository.increment({ id: quizRepo.id }, 'participantCount', 1);

    return savedAnswer;
  }

  async getLeaderboard(quizId: string) {
    return this.answerRepository.find({
      where: { quiz: { id: quizId } },
      relations: ['users'],
      order: { correctScore: 'DESC', createdAt: 'ASC' },
      take: 50,
    });
  }

  async getMyAnswers(userId: string) {
    return this.answerRepository.find({
      where: { users: { id: userId } },
      relations: ['quiz'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Answer[]> {
    return this.answerRepository.find({
      relations: ['quiz', 'users'],
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
