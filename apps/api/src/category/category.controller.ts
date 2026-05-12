import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Roles as RoleEnum } from 'src/user/enums/user-roles.enum';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('categories')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  // @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Post('homepage-category-product')
  @ApiOperation({ summary: 'Add category to homepage' })
  @ApiBody({
    type: [String],
    description: 'Array of category IDs to add to homepage'
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Categories added successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  addHomepageCategoryProduct(@Body() dto: { categoryIds: string[] }) {
    return this.categoryService.addHomepageCategoryProduct(dto.categoryIds);
  }
  @Get('all/homepage-category-product')
  @ApiOperation({ summary: 'Add category to homepage' })
  @ApiBody({
    type: [String],
    description: 'Array of category IDs to add to homepage'
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Categories added successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAllHomePageCategoryProduct() {
    return this.categoryService.findAllHomePageCategoryProduct();
  }
}
