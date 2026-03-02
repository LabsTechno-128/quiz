import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ description: 'The name of the quiz' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the quiz' })
  @IsString()
  @IsOptional()
  description?: string;
  
  @ApiPropertyOptional({ description: 'Category ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
