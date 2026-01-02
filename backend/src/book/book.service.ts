import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, CreateBookInput, UpdateBookInput } from './entities/book.entity';

/**
 * BookService handles all business logic for book operations
 * Uses TypeORM repository pattern for database operations
 */
@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  /**
   * Creates a new book in the database
   * @param createBookInput - Book data (name and description)
   * @returns Created book entity
   */
  async create(createBookInput: CreateBookInput): Promise<Book> {
    const book = this.bookRepository.create(createBookInput);
    return await this.bookRepository.save(book);
  }

  /**
   * Retrieves all books from the database
   * @returns Array of all books
   */
  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  /**
   * Finds a single book by ID
   * @param id - Book ID
   * @returns Book entity or null if not found
   */
  async findOne(id: number): Promise<Book> {
    return await this.bookRepository.findOne({ where: { id } });
  }

  /**
   * Updates an existing book
   * @param updateBookInput - Book ID and optional fields to update
   * @returns Updated book entity
   */
  async update(updateBookInput: UpdateBookInput): Promise<Book> {
    const { id, ...updateData } = updateBookInput;
    await this.bookRepository.update(id, updateData);
    return await this.findOne(id);
  }

  /**
   * Removes a book from the database
   * @param id - Book ID to delete
   * @returns Deleted book entity
   */
  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id);
    await this.bookRepository.delete(id);
    return book;
  }
}

