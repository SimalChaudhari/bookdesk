import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { Book } from './entities/book.entity';

/**
 * BookModule - GraphQL module with resolver and service
 */
@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BookResolver, BookService],
})
export class BookModule {}

