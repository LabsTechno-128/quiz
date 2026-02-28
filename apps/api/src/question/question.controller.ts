import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Question created', type: Question })
  create(@Body() dto: CreateQuestionDto) {
    console.log(dto)
    return this.questionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all questions' })
  @ApiResponse({
    status: 200,
    description: 'List of questions',
    type: [Question],
  })
  findAll(): Promise<{result:Question[],total:number,page:number,limit:number,totalPage:number}> {
    return this.questionService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Single question', type: Question })
  findOne(@Param('id') id: string)  {
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Question updated', type: Question })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Question deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.questionService.remove(id);
  }
}
