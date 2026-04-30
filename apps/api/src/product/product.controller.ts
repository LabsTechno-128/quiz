import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductType } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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
