import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  async create(createDto: any): Promise<Answer> {
    const answer = this.answerRepository.create(createDto);
    // return this.answerRepository.save(answer);
    return createDto;
  }

  async findAll(questionId?: string): Promise<Answer[]> {
    const where: any = {};
    if (questionId) {
      where.questionId = questionId;
    }
    return this.answerRepository.find({
      where,
      relations: ['question'],
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
