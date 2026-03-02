import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Answer } from '../question/entities/answer.entity';
import { GetLeaderboardDto, GetUserQuizListDto } from './dto/leaderboard.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) { }

  async getOverallRanking(dto: GetLeaderboardDto) {
    const { page = 1, limit = 10 } = dto;
    
    const allUsers = await this.userRepository.find({
      relations: ['answers', 'answers.quiz'],
    });
 
    const usersWithScore = allUsers.map((user) => {
      const totalCorrectScore = user.answers?.reduce((sum, answer) => {
        return sum + (answer.correctScore || 0);
      }, 0);

      return {
        ...user,
        totalCorrectScore,
      };
    }); 
    usersWithScore.sort((a, b) => b.totalCorrectScore - a.totalCorrectScore);
 
    const rankedUsers = usersWithScore.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
   console.log(rankedUsers );
    return {
      result: rankedUsers,
    };
   
  }

  async getUserRanking(userId: string) {
    const userRankingQuery = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.answers', 'answers')
      .leftJoin('answers.quiz', 'quiz')
      .where('user.isActive = :isActive', { isActive: true })
      .groupBy('user.id')
      .orderBy('SUM(answers.correctScore)', 'DESC')
      .addOrderBy('user.createdAt', 'ASC');

    const allUsers = await userRankingQuery.getMany();

    const userIndex = allUsers.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found or inactive');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['answers', 'answers.quiz'],
    });
    if (!user) {
      throw new Error('User not found or inactive');
    }

    const totalScore = user.answers.reduce((sum, answer) => sum + (answer.correctScore || 0), 0);
    const totalQuizzes = user.answers.length;
    const averageScore = totalQuizzes > 0
      ? Math.round(totalScore / totalQuizzes)
      : 0;

    return {
      rank: userIndex + 1,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        answers: user.answers,
      },
      totalScore,
      totalQuizzes,
      averageScore,
      totalUsers: allUsers.length,
    };
  }

  async getUserQuizList(userId: string, dto: GetUserQuizListDto) {
    const { page = 1, limit = 10 } = dto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['answers', 'answers.quiz', 'answers.question_answer'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const [answers, total] = await Promise.all([
      this.answerRepository
        .createQueryBuilder('answer')
        .leftJoinAndSelect('answer.quiz', 'quiz')
        .leftJoinAndSelect('answer.users', 'user')
        .where('user.id = :userId', { userId })
        .orderBy('answer.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany(),
      this.answerRepository
        .createQueryBuilder('answer')
        .leftJoin('answer.users', 'user')
        .where('user.id = :userId', { userId })
        .getCount(),
    ]);

    const quizList = answers.map((answer, index) => ({
      id: answer.id,
      quiz: {
        id: answer.quiz?.id,
        name: answer.quiz?.name,
        description: answer.quiz?.description,
        image: answer.quiz?.image,
      },
      score: {
        total: answer.totalScore || 0,
        correct: answer.correctScore || 0,
        wrong: answer.wrongScore || 0,
        totalQuestions: answer.totalQuestion || 0,
        notAttempted: answer.notAttemptedQuestion || 0,
      },
      completedAt: answer.createdAt,
      rank: (page - 1) * limit + index + 1,
    }));

    return {
      quizList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalQuizzes: total,
        totalScore: user.answers.reduce((sum, answer) => sum + (answer.totalScore || 0), 0),
        averageScore: total > 0
          ? Math.round(user.answers.reduce((sum, answer) => sum + (answer.totalScore || 0), 0) / total)
          : 0,
      },
    };
  }

  async getMonthlyRanking(dto: GetLeaderboardDto) {
    const { page = 1, limit = 10 } = dto;

    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.answers', 'answers')
      .leftJoinAndSelect('answers.quiz', 'quiz')
      .where('user.isActive = :isActive', { isActive: true })
      .andWhere('answers.createdAt >= :startDate', { startDate: lastMonthStart })
      .andWhere('answers.createdAt <= :endDate', { endDate: lastMonthEnd })
      .groupBy('user.id')
      .having('COUNT(answers.id) > 0')
      .orderBy('SUM(answers.totalScore)', 'DESC')
      .addOrderBy('user.createdAt', 'ASC');

    const [users, total] = await Promise.all([
      query
        .skip((page - 1) * limit)
        .take(limit)
        .getMany(),
      query.getCount(),
    ]);

    const rankings = users.map((user, index) => {
      const monthlyAnswers = user.answers.filter(answer =>
        answer.createdAt >= lastMonthStart && answer.createdAt <= lastMonthEnd
      );

      return {
        rank: (page - 1) * limit + index + 1,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        totalScore: monthlyAnswers.reduce((sum, answer) => sum + (answer.totalScore || 0), 0),
        totalQuizzes: monthlyAnswers.length,
        averageScore: monthlyAnswers.length > 0
          ? Math.round(monthlyAnswers.reduce((sum, answer) => sum + (answer.totalScore || 0), 0) / monthlyAnswers.length)
          : 0,
        month: lastMonthStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
      };
    });

    return {
      rankings,
      month: lastMonthStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
