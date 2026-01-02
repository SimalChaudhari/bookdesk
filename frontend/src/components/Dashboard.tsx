import { useState, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  IconButton,
  HStack,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Text,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { gql } from '@apollo/client';
import BookModal from './BookModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import LogoutConfirmationModal from './LogoutConfirmationModal';

// GraphQL queries and mutations
const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      name
      description
    }
  }
`;

const CREATE_BOOK = gql`
  mutation CreateBook($createBookInput: CreateBookInput!) {
    createBook(createBookInput: $createBookInput) {
      id
      name
      description
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($updateBookInput: UpdateBookInput!) {
    updateBook(updateBookInput: $updateBookInput) {
      id
      name
      description
    }
  }
`;

const DELETE_BOOK = gql`
  mutation RemoveBook($id: Int!) {
    removeBook(id: $id) {
      id
      name
      description
    }
  }
`;

interface Book {
  id: number;
  name: string;
  description: string;
}

/**
 * Dashboard component - Main view for managing books
 * Features:
 * - Displays table of all books
 * - Create, edit, and delete functionality
 * - Protected by Auth0 authentication
 * - Uses GraphQL queries and mutations
 */
const Dashboard = () => {
  const { logout, user } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const {
    isOpen: isLogoutModalOpen,
    onOpen: onLogoutModalOpen,
    onClose: onLogoutModalClose,
  } = useDisclosure();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Use ref to track mutation in progress (persists across re-renders)
  const isMutationInProgress = useRef(false);
  
  // GraphQL queries and mutations
  // Using cache-first to prevent duplicate calls - only fetches from network if cache is empty
  // nextFetchPolicy ensures subsequent fetches also use cache-first
  const { loading, error, data } = useQuery<{ books: Book[] }>(GET_BOOKS, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false, // Disable to prevent extra network calls
    errorPolicy: 'all',
  });
  const [createBook] = useMutation(CREATE_BOOK, {
    // Use update function instead of refetchQueries to update cache directly
    update: (cache, { data }) => {
      if (data?.createBook) {
        const existingBooks = cache.readQuery<{ books: Book[] }>({ query: GET_BOOKS });
        if (existingBooks) {
          cache.writeQuery({
            query: GET_BOOKS,
            data: { books: [...existingBooks.books, data.createBook] },
          });
        }
      }
    },
  });
  const [updateBook] = useMutation(UPDATE_BOOK, {
    // Use update function instead of refetchQueries to update cache directly
    update: (cache, { data }) => {
      if (data?.updateBook) {
        const existingBooks = cache.readQuery<{ books: Book[] }>({ query: GET_BOOKS });
        if (existingBooks) {
          cache.writeQuery({
            query: GET_BOOKS,
            data: {
              books: existingBooks.books.map((book) =>
                book.id === data.updateBook.id ? data.updateBook : book
              ),
            },
          });
        }
      }
    },
  });
  const [deleteBook] = useMutation(DELETE_BOOK, {
    // Use update function instead of refetchQueries to update cache directly
    update: (cache, { data }) => {
      if (data?.removeBook) {
        const existingBooks = cache.readQuery<{ books: Book[] }>({ query: GET_BOOKS });
        if (existingBooks) {
          cache.writeQuery({
            query: GET_BOOKS,
            data: {
              books: existingBooks.books.filter((book) => book.id !== data.removeBook.id),
            },
          });
        }
      }
    },
  });

  /**
   * Opens modal for creating a new book
   * Resets editingBook to null to indicate create mode
   */
  const handleCreate = () => {
    setEditingBook(null);
    setIsSaving(false);
    onOpen();
  };

  /**
   * Opens modal for editing an existing book
   * Sets the book to edit in state
   */
  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsSaving(false);
    onOpen();
  };

  /**
   * Handles modal close and resets saving state
   */
  const handleClose = () => {
    setIsSaving(false);
    onClose();
  };

  /**
   * Handles logout confirmation
   */
  const handleLogoutConfirm = () => {
    // Clear localStorage before logout
    localStorage.clear();
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  /**
   * Opens delete confirmation modal for a book
   */
  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    onDeleteModalOpen();
  };

  /**
   * Confirms and deletes the book
   * Prevents duplicate calls using ref
   */
  const handleDeleteConfirm = async () => {
    if (!bookToDelete || isMutationInProgress.current) {
      return;
    }

    isMutationInProgress.current = true;
    setIsDeleting(true);
    try {
      await deleteBook({ variables: { id: bookToDelete.id } });
      // No need to refetch - cache update handles it automatically
      onDeleteModalClose();
      setBookToDelete(null);
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete book');
    } finally {
      isMutationInProgress.current = false;
      setIsDeleting(false);
    }
  };

  /**
   * Handles both create and update operations
   * Determines operation type based on whether editingBook is set
   * Refetches data and closes modal on success
   * Prevents duplicate calls with isSaving guard and ref (React StrictMode protection)
   */
  const handleSave = async (bookData: { name: string; description: string }) => {
    // Prevent duplicate calls (React StrictMode protection)
    if (isSaving || isMutationInProgress.current) {
      return;
    }

    setIsSaving(true);
    isMutationInProgress.current = true;
    try {
      if (editingBook) {
        // Update existing book
        await updateBook({
          variables: {
            updateBookInput: {
              id: editingBook.id,
              ...bookData,
            },
          },
        });
      } else {
        // Create new book
        await createBook({
          variables: {
            createBookInput: bookData,
          },
        });
      }
      // No need to refetch - refetchQueries handles it automatically
      onClose(); // Close the modal
    } catch (err) {
      console.error('Error saving book:', err);
      alert('Failed to save book');
    } finally {
      setIsSaving(false);
      isMutationInProgress.current = false;
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading books: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading>Book Dashboard</Heading>
        <HStack>
          <Text fontSize="sm" color="gray.600">
            {user?.email}
          </Text>
              <Button onClick={onLogoutModalOpen}>
                Logout
              </Button>
        </HStack>
      </HStack>

      <Box mb={4}>
        <Button colorScheme="blue" onClick={handleCreate}>
          Create New Book
        </Button>
      </Box>

      <TableContainer bg="white" borderRadius="lg" boxShadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.books.map((book: Book) => (
              <Tr key={book.id}>
                <Td>{book.id}</Td>
                <Td>{book.name}</Td>
                <Td>{book.description}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit book"
                      icon={<EditIcon />}
                      size="sm"
                      onClick={() => handleEdit(book)}
                    />
                    <IconButton
                      aria-label="Delete book"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteClick(book)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <BookModal
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        book={editingBook}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        bookName={bookToDelete?.name || ''}
        isLoading={isDeleting}
      />

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={onLogoutModalClose}
        onConfirm={handleLogoutConfirm}
      />
    </Container>
  );
};

export default Dashboard;
