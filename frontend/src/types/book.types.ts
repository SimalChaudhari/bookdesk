/**
 * Book-related TypeScript types and interfaces
 */

export interface Book {
  readonly id: number;
  readonly name: string;
  readonly description: string;
}

export interface CreateBookInput {
  readonly name: string;
  readonly description: string;
}

export interface UpdateBookInput {
  readonly id: number;
  readonly name?: string;
  readonly description?: string;
}

export interface BooksQueryResult {
  readonly books: Book[];
}

