import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book, CreateBookInput, UpdateBookInput } from './entities/book.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * BookResolver - GraphQL resolver for books
 * All queries and mutations are protected with JWT authentication
 */
@Resolver(() => Book)
@UseGuards(JwtAuthGuard)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  /**
   * Mutation to create a new book
   * Requires authentication via JWT token
   */
  @Mutation(() => Book)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput): Promise<Book> {
    return this.bookService.create(createBookInput);
  }

  /**
   * Query to retrieve all books
   * Requires authentication via JWT token
   */
  @Query(() => [Book], { name: 'books' })
  findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  /**
   * Query to retrieve a single book by ID
   * Requires authentication via JWT token
   */
  @Query(() => Book, { name: 'book' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Book> {
    return this.bookService.findOne(id);
  }

  /**
   * Mutation to update an existing book
   * Requires authentication via JWT token
   */
  @Mutation(() => Book)
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput): Promise<Book> {
    return this.bookService.update(updateBookInput);
  }

  /**
   * Mutation to delete a book
   * Requires authentication via JWT token
   */
  @Mutation(() => Book)
  removeBook(@Args('id', { type: () => Int }) id: number): Promise<Book> {
    return this.bookService.remove(id);
  }
}

