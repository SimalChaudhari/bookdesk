import { NotFoundException } from '@nestjs/common';
import { APP_CONSTANTS } from '../constants/app.constants';

/**
 * BookNotFoundException
 * Custom exception for when a book is not found
 */
export class BookNotFoundException extends NotFoundException {
  constructor(bookId?: number) {
    const message = bookId
      ? `${APP_CONSTANTS.ERROR_MESSAGES.BOOK_NOT_FOUND} with ID: ${bookId}`
      : APP_CONSTANTS.ERROR_MESSAGES.BOOK_NOT_FOUND;
    
    super(message);
  }
}

