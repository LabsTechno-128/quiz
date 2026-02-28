import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAnswerDto } from './create-answer.dto';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isCorrect: boolean;
}
export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  @IsOptional()
  answers?: CreateAnswerDto[];

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  quizId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @IsOptional()
  option?: CreateOptionDto[];
}
