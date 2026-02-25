import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from './create-question.dto';

export class CreateQuizDto {
  @ApiProperty({ description: 'The name of the quiz' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the quiz' })
  @IsString()
  @IsOptional()
  description?: string;

}
