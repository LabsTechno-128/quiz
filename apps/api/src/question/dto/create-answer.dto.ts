import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer'; 
export class questionAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  optionId: string;

  @IsUUID()
  @IsNotEmpty()
  questionId: string;
}
export class CreateAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  quizId: string;

  @Type(() => questionAnswerDto)
  @ValidateNested()
  @IsNotEmpty()
  questionAnswerDto: questionAnswerDto[];
  
}
