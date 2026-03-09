import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ description: 'The name of the quiz' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the quiz' })
  @IsString()
  @IsOptional()
  description?: string; 
  
  @ApiPropertyOptional({ description: 'Slug' })
  @IsString()
  @IsOptional()
  slug?: string;
  
  @ApiPropertyOptional({ description: 'Image' })
  @IsString()
  @IsOptional()
  image?: string;
  
  @ApiPropertyOptional({ description: 'Status' })
  @IsString()
  @IsOptional()
  status?: string;
  
  @ApiPropertyOptional({ description: 'Category ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;
   
  @ApiPropertyOptional({ description: 'Total questions' })
  @IsNumber()
  @IsOptional()
  totalQuestions?: number;
  
  @ApiPropertyOptional({ description: 'Start date' })
  @IsDate()
  @IsOptional()
  startDate?: Date;
  
  @ApiPropertyOptional({ description: 'End date' })
  @IsDate()
  @IsOptional()
  endDate?: Date;
  
  @ApiPropertyOptional({ description: 'Duration' })
  @IsNumber()
  @IsOptional()
  duration?: number;
}
