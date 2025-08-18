import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  BookOpen, 
  Search, 
  Heart, 
  Clock, 
  Star,
  TrendingUp,
  Filter,
  Calendar
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { bookService } from '../services/dataService';
import { Book } from '../types';

const UserDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const booksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load books on component mount
    loadBooks();
  }, []);

  const loadBooks = () => {
    const allBooks = bookService.getAll();
    setBooks(allBooks);
  };

  useEffect(() => {
    let filtered = books;
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(book => book.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = bookService.search(searchTerm).filter(book => 
        activeCategory === 'all' || book.category === activeCategory
      );
    }
    
    setFilteredBooks(filtered);
  }, [books, activeCategory, searchTerm]);

  useEffect(() => {
    if (booksRef.current) {
      gsap.fromTo(
        booksRef.current.children,
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'easeOut' 
        }
      );
    }
  }, [activeCategory]);

  const borrowedBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      dueDate: "2025-02-15",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
      progress: 65
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      dueDate: "2025-02-20",
      image: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400",
      progress: 30
    }
  ];

  // Get unique categories from books
  const categories = ['all', ...Array.from(new Set(books.map(book => book.category)))];

  const quickStats = [
    { label: 'Books Read', value: '23', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Reading Goal', value: '50', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Favorites', value: '12', icon: <Heart className="w-5 h-5" /> },
    { label: 'Reading Hours', value: '87', icon: <Clock className="w-5 h-5" /> }
  ];

  return (
    <DashboardLayout userRole="user">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Library</h1>
            <p className="text-gray-300">Discover, read, and track your favorite books</p>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books..."
                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-blue-400">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-300 text-xs sm:text-sm">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Currently Reading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Currently Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {borrowedBooks.map((book) => (
              <motion.div
                key={book.id}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-300 mb-2 text-sm sm:text-base">by {book.author}</p>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {book.dueDate}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{book.progress}% complete</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Books */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Available Books</h2>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span className="hidden sm:inline">{category === 'all' ? 'All' : category}</span>
                  <span className="sm:hidden">{category === 'all' ? 'All' : category.slice(0, 3)}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div ref={booksRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
                }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 cursor-pointer"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 sm:p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-white text-xs">{book.rating}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-white text-xs">{book.availableCopies} left</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-white mb-1 line-clamp-1 text-sm sm:text-base">{book.title}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">by {book.author}</p>
                  <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-1 rounded-full truncate max-w-full inline-block">
                    {book.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12 text-white/60">
              <BookOpen className="w-16 h-16 mx-auto mb-4" />
              <p>No books found matching your criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;