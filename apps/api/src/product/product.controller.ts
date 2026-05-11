import { Controller, Get, Param, Query, ParseUUIDPipe, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductType } from './entities/product.entity';
import { CreateProductDto } from './dto/create.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productService.create(payload);
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('type') type?: ProductType,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productService.findAll({
      categoryId,
      type,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }
}
