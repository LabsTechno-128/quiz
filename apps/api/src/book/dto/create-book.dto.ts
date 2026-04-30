import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateBookDto {
    @IsString()
    title: string;

    @IsString()
    author: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    buyPrice: number;

    @IsNumber()
    sellPrice: number;

    @IsOptional()
    @IsNumber()
    offerPrice?: number;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}