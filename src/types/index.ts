export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  image: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'librarian';
  membershipDate: string;
  isActive: boolean;
  borrowedBooks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'overdue' | 'returned';
  renewalCount: number;
}