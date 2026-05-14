import { IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class InitPaymentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}
