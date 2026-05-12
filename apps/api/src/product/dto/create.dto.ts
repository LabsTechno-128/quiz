import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, IsBoolean } from "class-validator";
import { ProductType } from "../entities/product.entity";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsEnum(ProductType)
    type: ProductType;

    @IsNotEmpty()
    @IsNumber()
    sellPrice: number;

    @IsOptional()
    @IsNumber()
    buyPrice: number;

    @IsOptional()
    @IsNumber()
    offerPrice: number;

    @IsOptional()
    @IsNumber()
    stock: number;

    @IsOptional()
    @IsString()
    fileUrl: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    @IsNumber()
    rating: number;

    @IsOptional()
    @IsString()
    categoryId: string;

    @IsOptional()
    @IsString()
    description: string;
}