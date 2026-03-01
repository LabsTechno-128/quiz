import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.delete(id);
    return user;
  }

  async toggleStatus(id: string) {
    const user = await this.findOne(id);
    if (!user) return null;
    user.isActive = !user.isActive;
    return await this.userRepository.save(user);
  }
  
  async getCurrentUser(id: string) {
    //  const result = await this.userRepository.findOne({ where: { id },relations:["answers"] });
    const qb = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.answers', 'answers')
      .leftJoinAndSelect('answers.quiz', 'quiz')
      .leftJoinAndSelect('answers.question_answer', 'question_answer')
      .where('user.id = :id', { id })
      .getOne();
    return qb;
  }
}
