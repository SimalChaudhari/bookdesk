import { gql } from '@apollo/client';

/**
 * GraphQL Queries and Mutations for Books
 * Centralized location for all book-related GraphQL operations
 */

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      name
      description
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($createBookInput: CreateBookInput!) {
    createBook(createBookInput: $createBookInput) {
      id
      name
      description
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($updateBookInput: UpdateBookInput!) {
    updateBook(updateBookInput: $updateBookInput) {
      id
      name
      description
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation RemoveBook($id: Int!) {
    removeBook(id: $id) {
      id
      name
      description
    }
  }
`;

