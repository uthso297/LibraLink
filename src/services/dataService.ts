import { Book, User, Loan } from '../types';

// Sample data initialization
const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    isbn: '978-0525559474',
    category: 'Fiction',
    description: 'A novel about infinite possibilities and the life you could have lived.',
    publishedYear: 2020,
    totalCopies: 5,
    availableCopies: 3,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0735211292',
    category: 'Self-Help',
    description: 'An easy and proven way to build good habits and break bad ones.',
    publishedYear: 2018,
    totalCopies: 8,
    availableCopies: 5,
    image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '978-0441172719',
    category: 'Science Fiction',
    description: 'A science fiction epic set in the distant future.',
    publishedYear: 1965,
    totalCopies: 4,
    availableCopies: 2,
    image: 'https://images.pexels.com/photos/4050299/pexels-photo-4050299.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    isbn: '978-0857197689',
    category: 'Finance',
    description: 'Timeless lessons on wealth, greed, and happiness.',
    publishedYear: 2020,
    totalCopies: 6,
    availableCopies: 4,
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'user',
    membershipDate: '2024-01-15',
    isActive: true,
    borrowedBooks: ['1'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'user',
    membershipDate: '2024-03-20',
    isActive: true,
    borrowedBooks: ['2', '3'],
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2025-01-18T00:00:00Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    role: 'librarian',
    membershipDate: '2023-06-10',
    isActive: true,
    borrowedBooks: [],
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z'
  }
];

const sampleLoans: Loan[] = [
  {
    id: '1',
    bookId: '1',
    userId: '1',
    loanDate: '2025-01-20',
    dueDate: '2025-02-10',
    status: 'active',
    renewalCount: 0
  },
  {
    id: '2',
    bookId: '2',
    userId: '2',
    loanDate: '2025-01-18',
    dueDate: '2025-02-08',
    status: 'overdue',
    renewalCount: 1
  }
];

// Initialize localStorage with sample data if empty
export const initializeData = () => {
  if (!localStorage.getItem('libralink_books')) {
    localStorage.setItem('libralink_books', JSON.stringify(sampleBooks));
  }
  if (!localStorage.getItem('libralink_users')) {
    localStorage.setItem('libralink_users', JSON.stringify(sampleUsers));
  }
  if (!localStorage.getItem('libralink_loans')) {
    localStorage.setItem('libralink_loans', JSON.stringify(sampleLoans));
  }
};

// Book CRUD operations
export const bookService = {
  getAll: (): Book[] => {
    const books = localStorage.getItem('libralink_books');
    return books ? JSON.parse(books) : [];
  },

  getById: (id: string): Book | null => {
    const books = bookService.getAll();
    return books.find(book => book.id === id) || null;
  },

  create: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book => {
    const books = bookService.getAll();
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    books.push(newBook);
    localStorage.setItem('libralink_books', JSON.stringify(books));
    return newBook;
  },

  update: (id: string, bookData: Partial<Book>): Book | null => {
    const books = bookService.getAll();
    const index = books.findIndex(book => book.id === id);
    if (index === -1) return null;

    books[index] = {
      ...books[index],
      ...bookData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('libralink_books', JSON.stringify(books));
    return books[index];
  },

  delete: (id: string): boolean => {
    const books = bookService.getAll();
    const filteredBooks = books.filter(book => book.id !== id);
    if (filteredBooks.length === books.length) return false;
    
    localStorage.setItem('libralink_books', JSON.stringify(filteredBooks));
    return true;
  },

  search: (query: string): Book[] => {
    const books = bookService.getAll();
    const lowercaseQuery = query.toLowerCase();
    return books.filter(book =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.category.toLowerCase().includes(lowercaseQuery) ||
      book.isbn.includes(query)
    );
  }
};

// User CRUD operations
export const userService = {
  getAll: (): User[] => {
    const users = localStorage.getItem('libralink_users');
    return users ? JSON.parse(users) : [];
  },

  getById: (id: string): User | null => {
    const users = userService.getAll();
    return users.find(user => user.id === id) || null;
  },

  create: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const users = userService.getAll();
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('libralink_users', JSON.stringify(users));
    return newUser;
  },

  update: (id: string, userData: Partial<User>): User | null => {
    const users = userService.getAll();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('libralink_users', JSON.stringify(users));
    return users[index];
  },

  delete: (id: string): boolean => {
    const users = userService.getAll();
    const filteredUsers = users.filter(user => user.id !== id);
    if (filteredUsers.length === users.length) return false;
    
    localStorage.setItem('libralink_users', JSON.stringify(filteredUsers));
    return true;
  },

  search: (query: string): User[] => {
    const users = userService.getAll();
    const lowercaseQuery = query.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.role.toLowerCase().includes(lowercaseQuery)
    );
  }
};

// Loan CRUD operations
export const loanService = {
  getAll: (): Loan[] => {
    const loans = localStorage.getItem('libralink_loans');
    return loans ? JSON.parse(loans) : [];
  },

  getById: (id: string): Loan | null => {
    const loans = loanService.getAll();
    return loans.find(loan => loan.id === id) || null;
  },

  create: (loanData: Omit<Loan, 'id'>): Loan => {
    const loans = loanService.getAll();
    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString()
    };
    loans.push(newLoan);
    localStorage.setItem('libralink_loans', JSON.stringify(loans));
    return newLoan;
  },

  update: (id: string, loanData: Partial<Loan>): Loan | null => {
    const loans = loanService.getAll();
    const index = loans.findIndex(loan => loan.id === id);
    if (index === -1) return null;

    loans[index] = { ...loans[index], ...loanData };
    localStorage.setItem('libralink_loans', JSON.stringify(loans));
    return loans[index];
  },

  delete: (id: string): boolean => {
    const loans = loanService.getAll();
    const filteredLoans = loans.filter(loan => loan.id !== id);
    if (filteredLoans.length === loans.length) return false;
    
    localStorage.setItem('libralink_loans', JSON.stringify(filteredLoans));
    return true;
  },

  getByUserId: (userId: string): Loan[] => {
    const loans = loanService.getAll();
    return loans.filter(loan => loan.userId === userId);
  },

  getByBookId: (bookId: string): Loan[] => {
    const loans = loanService.getAll();
    return loans.filter(loan => loan.bookId === bookId);
  }
};