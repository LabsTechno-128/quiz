import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)   // 🔥 MUST
    @IsPositive()
    limit?: number;

    @IsOptional()
    @Type(() => Number)   // 🔥 MUST
    @IsPositive()
    page?: number;
}