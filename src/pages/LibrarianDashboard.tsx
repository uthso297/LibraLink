import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  BookOpen, 
  Users, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import BookModal from '../components/BookModal';
import { bookService, userService, loanService } from '../services/dataService';
import { Book, User, Loan } from '../types';

const LibrarianDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('loans');
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  
  // Modal state
  const [bookModal, setBookModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    book?: Book | null;
  }>({ isOpen: false, mode: 'create', book: null });

  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(bookService.search(searchTerm));
    }
  }, [searchTerm, books]);

  const loadData = () => {
    setBooks(bookService.getAll());
    setUsers(userService.getAll());
    setLoans(loanService.getAll());
  };

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'easeOut' 
        }
      );
    }
  }, []);

  const quickStats = [
    {
      title: 'Active Loans',
      value: loans.filter(l => l.status === 'active').length.toString(),
      change: '+12',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Overdue Items',
      value: loans.filter(l => l.status === 'overdue').length.toString(),
      change: '-5',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'New Members',
      value: users.filter(u => u.isActive).length.toString(),
      change: '+8',
      icon: <Users className="w-6 h-6" />,
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Returns Today',
      value: loans.filter(l => l.status === 'returned').length.toString(),
      change: '+3',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    }
  ];

  // Get loan details with book and user information
  const getEnrichedLoans = () => {
    return loans.map(loan => {
      const book = books.find(b => b.id === loan.bookId);
      const user = users.find(u => u.id === loan.userId);
      return {
        ...loan,
        bookTitle: book?.title || 'Unknown Book',
        borrowerName: user?.name || 'Unknown User'
      };
    });
  };

  // Book CRUD handlers
  const handleCreateBook = (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBook = bookService.create(bookData);
    // Update state immediately without reload
    setBooks(prevBooks => [...prevBooks, newBook]);
    setFilteredBooks(prevBooks => [...prevBooks, newBook]);
  };

  const handleUpdateBook = (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (bookModal.book) {
      const updatedBook = bookService.update(bookModal.book.id, bookData);
      if (updatedBook) {
        // Update state immediately without reload
        setBooks(prevBooks => 
          prevBooks.map(book => book.id === updatedBook.id ? updatedBook : book)
        );
        setFilteredBooks(prevBooks => 
          prevBooks.map(book => book.id === updatedBook.id ? updatedBook : book)
        );
      }
    }
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const success = bookService.delete(id);
      if (success) {
        // Update state immediately without reload
        setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
        setFilteredBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      }
    }
  };

  const tabs = [
    { id: 'loans', label: 'Loan Management', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'inventory', label: 'Book Inventory', icon: <Plus className="w-5 h-5" /> },
    { id: 'members', label: 'Member Services', icon: <Users className="w-5 h-5" /> }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'active':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'returned':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const renderLoans = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Recent Loans</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Loan</span>
        </motion.button>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Book Title</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 hidden sm:table-cell">Borrower</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 hidden md:table-cell">Loan Date</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Due Date</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Status</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getEnrichedLoans().map((loan) => (
                <motion.tr
                  key={loan.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className="border-b border-white/5"
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-medium text-sm sm:text-base">{loan.bookTitle}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm sm:text-base hidden sm:table-cell">{loan.borrowerName}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm hidden md:table-cell">{loan.loanDate}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm">{loan.dueDate}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex space-x-1 sm:space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Book Inventory Management</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setBookModal({ isOpen: true, mode: 'create', book: null })}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Book</span>
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredBooks.map((book) => (
          <motion.div
            key={book.id}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20"
          >
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setBookModal({ isOpen: true, mode: 'view', book })}
                  className="p-1.5 sm:p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:text-blue-400 transition-colors"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setBookModal({ isOpen: true, mode: 'edit', book })}
                  className="p-1.5 sm:p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:text-yellow-400 transition-colors"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleDeleteBook(book.id)}
                  className="p-1.5 sm:p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-white mb-1 line-clamp-1 text-sm sm:text-base">{book.title}</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-2">by {book.author}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-1 rounded-full truncate max-w-20 sm:max-w-none">
                  {book.category}
                </span>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {book.availableCopies}/{book.totalCopies} available
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12 text-white/60">
          <BookOpen className="w-16 h-16 mx-auto mb-4" />
          <p>No books found</p>
        </div>
      )}
    </motion.div>
  );

  const renderMembers = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Member Services</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register Member</span>
        </motion.button>
      </div>
      
      <div className="h-96 flex items-center justify-center text-white/60">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4" />
          <p>Member management interface would be displayed here</p>
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'loans':
        return renderLoans();
      case 'inventory':
        return renderInventory();
      case 'members':
        return renderMembers();
      default:
        return renderLoans();
    }
  };

  return (
    <>
    <DashboardLayout userRole="librarian">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Librarian Dashboard</h1>
            <p className="text-gray-300">Manage loans, inventory, and member services</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search loans, books..."
                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors self-center sm:self-auto">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-300 text-xs sm:text-base">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/10"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span className="font-medium hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </DashboardLayout>

    {/* Book Modal */}
    <BookModal
      isOpen={bookModal.isOpen}
      onClose={() => setBookModal({ isOpen: false, mode: 'create', book: null })}
      onSave={bookModal.mode === 'create' ? handleCreateBook : handleUpdateBook}
      book={bookModal.book}
      mode={bookModal.mode}
    />
    </>
  );
};

export default LibrarianDashboard;