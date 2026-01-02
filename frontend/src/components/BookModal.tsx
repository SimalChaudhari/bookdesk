import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';

interface Book {
  id: number;
  name: string;
  description: string;
}

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookData: { name: string; description: string }) => void;
  book: Book | null;
}

const BookModal = ({ isOpen, onClose, onSave, book }: BookModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setName(book.name);
      setDescription(book.description);
    } else {
      setName('');
      setDescription('');
    }
    // Reset submitting state when modal opens/closes
    setIsSubmitting(false);
  }, [book, isOpen]);

  const handleSave = () => {
    // Prevent duplicate submissions
    if (isSubmitting || !name.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);
    onSave({ name: name.trim(), description: description.trim() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{book ? 'Edit Book' : 'Create New Book'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                placeholder="Enter book name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                placeholder="Enter book description"
                rows={4}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSave}
            isLoading={isSubmitting}
            isDisabled={isSubmitting || !name.trim() || !description.trim()}
          >
            {book ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookModal;

