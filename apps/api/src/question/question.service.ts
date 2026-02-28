import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Option } from './entities/option.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
     @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

 
 async findAll(): Promise<{result:Question[],total:number,page:number,limit:number,totalPage:number}> { 
  const result = await this.questionRepository.find({
      relations:['option']
    });
    return  {
      result,
      total: result.length,
      page: 1,
      limit: 10,
      totalPage: Math.ceil(result.length / 10),
    };
  }
 
  async create(dto: CreateQuestionDto)  { 
    // const option = this.optionRepository.create(dto.option);
    const question = this.questionRepository.create({
      name:dto.name,
      slug:dto.slug,
      description:dto.description,
      status:dto.status,
    });
    const questionData = await this.questionRepository.save(question);
    if(dto.option){ 
      for(let value of dto.option){
      const newQuestion = await this.questionRepository.findOne({where:{id:questionData.id}});
      if(!newQuestion){
        throw new NotFoundException(`Question with ID "${questionData.id}" not found`);
      }
      const option = this.optionRepository.create({name:value.name,question:newQuestion,isCorrect:value.isCorrect});
      await this.optionRepository.save(option);
    }
  }
    // return dto;
    return questionData;
  } 

  async update(id:string,dto:UpdateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create(dto);
    return this.questionRepository.save(question);
  }
  async findOne(id:string) {
    const question = this.questionRepository.findOne({where:{id}});
    if (!question) {
      throw new NotFoundException(`Question with ID "${id}" not found`);
    }
    return question;
  }
  async  remove(id:string){
    return this.questionRepository.delete(id);
  }

 
}
