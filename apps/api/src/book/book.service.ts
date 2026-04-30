import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from './dto/pagination.dto';
// import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) { }

    async create(createBookDto: CreateBookDto, file?: Express.Multer.File) {
        const { title, author, description, buyPrice, sellPrice, offerPrice, image } = createBookDto;

        const bookExists = await this.bookRepository.findOne({ where: { title, author } });
        if (bookExists) {
            throw new BadRequestException(`Book "${title}" by ${author} already exists`);
        }

        const book = this.bookRepository.create({
            title,
            author,
            description,
            buyPrice: Number(buyPrice),
            sellPrice: Number(sellPrice),
            offerPrice: offerPrice ? Number(offerPrice) : undefined,
            image: image ?? undefined
        });

        return this.bookRepository.save(book);
    }

    async findAll(
        paginationDto: PaginationDto,
        author?: string,
        title?: string,
        search?: string,
    ) {
        const { limit = 10, page = 1 } = paginationDto;
        const queryBuilder = this.bookRepository.createQueryBuilder('book');

        queryBuilder.where('book.isActive = :isActive', { isActive: true });

        if (author) {
            queryBuilder.andWhere('LOWER(book.author) LIKE LOWER(:author)', { author: `%${author}%` });
        }

        if (title) {
            queryBuilder.andWhere('LOWER(book.title) LIKE LOWER(:title)', { title: `%${title}%` });
        }

        if (search) {
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where('LOWER(book.title) LIKE LOWER(:search)', { search: `%${search}%` })
                        .orWhere('LOWER(book.author) LIKE LOWER(:search)', { search: `%${search}%` });
                })
            );
        }

        queryBuilder.orderBy('book.createdAt', 'DESC');
        queryBuilder.limit(Number(limit));
        queryBuilder.offset(Number(page));

        const [books, total] = await queryBuilder.getManyAndCount();

        return {
            result: books,
            message: 'Books retrieved successfully',
            total,
            limit: Number(limit),
            page: Number(page),
        };
    }

    async findOne(id: number) {
        const book = await this.bookRepository.findOne({ where: { id } });

        if (!book) {
            throw new NotFoundException(`Book with ID "${id}" not found`);
        }

        return book;
    }

    async update(
        id: number,
        updateBookDto: UpdateBookDto,
        file?: Express.Multer.File
    ) {
        const book = await this.findOne(id);

        const { title, author, description, buyPrice, sellPrice, offerPrice, isActive } = updateBookDto;

        if (title) book.title = title;
        if (author) book.author = author;
        if (description) book.description = description;
        if (buyPrice !== undefined) book.buyPrice = Number(buyPrice);
        if (sellPrice !== undefined) book.sellPrice = Number(sellPrice);
        if (offerPrice !== undefined) book.offerPrice = Number(offerPrice);
        if (isActive !== undefined) book.isActive = isActive === true;

        if (file) {
            book.image = file.path;
        }

        return this.bookRepository.save(book);
    }

    async remove(id: number) {
        const book = await this.findOne(id);

        await this.bookRepository.remove(book);
        return { success: true, message: `Book "${book.title}" removed successfully` };
    }
}
