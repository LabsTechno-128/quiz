import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseInterceptors,
    UploadedFile,
    ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from './dto/pagination.dto';
// import { PaginationDto } from 'src/common/dto/pagination.dto';
// import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Post()
    // @Roles('admin')
    @UseInterceptors(FileInterceptor('image'))
    create(
        @Body() createBookDto: CreateBookDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.bookService.create(createBookDto, file);
    }

    @Get()
    findAll(
        @Query() paginationDto: PaginationDto,
        @Query('author') author?: string,
        @Query('title') title?: string,
        @Query('search') search?: string,
    ) {

        return this.bookService.findAll(paginationDto, author, title, search);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.findOne(+id);
    }

    @Patch(':id')
    // @Roles('admin')
    @UseInterceptors(FileInterceptor('image'))
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBookDto: UpdateBookDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.bookService.update(id, updateBookDto, file);
    }

    @Delete(':id')
    // @Roles('admin')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.remove(id);
    }
}
