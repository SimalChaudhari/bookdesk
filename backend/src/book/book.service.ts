import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, CreateBookInput, UpdateBookInput } from './entities/book.entity';
import { BookNotFoundException } from '../common/exceptions/book-not-found.exception';
import { APP_CONSTANTS } from '../common/constants/app.constants';

/**
 * BookService - Business logic layer for book operations
 * 
 * Handles all CRUD operations for books using TypeORM repository pattern.
 * Includes proper error handling and logging for production use.
 */
@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  /**
   * Creates a new book in the database
   * 
   * @param createBookInput - Book data containing name and description
   * @returns Promise resolving to the created book entity
   * @throws Error if book creation fails
   */
  async create(createBookInput: CreateBookInput): Promise<Book> {
    try {
      const book = this.bookRepository.create(createBookInput);
      return await this.bookRepository.save(book);
    } catch (error) {
      this.logger.error(APP_CONSTANTS.ERROR_MESSAGES.BOOK_CREATE_FAILED, error);
      throw new Error(APP_CONSTANTS.ERROR_MESSAGES.BOOK_CREATE_FAILED);
    }
  }

  /**
   * Retrieves all books from the database
   * 
   * @returns Promise resolving to an array of all books
   */
  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find({
      order: { id: 'ASC' },
    });
  }

  /**
   * Finds a single book by ID
   * 
   * @param id - Unique identifier of the book
   * @returns Promise resolving to the book entity
   * @throws BookNotFoundException if book is not found
   */
  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    
    if (!book) {
      throw new BookNotFoundException(id);
    }
    
    return book;
  }

  /**
   * Updates an existing book
   * 
   * @param updateBookInput - Book ID and optional fields to update
   * @returns Promise resolving to the updated book entity
   * @throws BookNotFoundException if book is not found
   * @throws Error if update operation fails
   */
  async update(updateBookInput: UpdateBookInput): Promise<Book> {
    const { id, ...updateData } = updateBookInput;
    
    await this.findOne(id);
    
    try {
      await this.bookRepository.update(id, updateData);
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(APP_CONSTANTS.ERROR_MESSAGES.BOOK_UPDATE_FAILED, error);
      throw new Error(APP_CONSTANTS.ERROR_MESSAGES.BOOK_UPDATE_FAILED);
    }
  }

  /**
   * Removes a book from the database
   * 
   * @param id - Unique identifier of the book to delete
   * @returns Promise resolving to the deleted book entity
   * @throws BookNotFoundException if book is not found
   * @throws Error if delete operation fails
   */
  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id);
    
    try {
      await this.bookRepository.delete(id);
      return book;
    } catch (error) {
      this.logger.error(APP_CONSTANTS.ERROR_MESSAGES.BOOK_DELETE_FAILED, error);
      throw new Error(APP_CONSTANTS.ERROR_MESSAGES.BOOK_DELETE_FAILED);
    }
  }
}

