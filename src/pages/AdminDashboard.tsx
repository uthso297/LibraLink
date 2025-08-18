import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  Search, 
  Plus, 
  Filter,
  TrendingUp,
  Calendar,
  UserCheck,
  Book,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import BookModal from '../components/BookModal';
import UserModal from '../components/UserModal';
import { bookService, userService } from '../services/dataService';
import { Book as BookType, User } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<BookType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  // Modal states
  const [bookModal, setBookModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    book?: BookType | null;
  }>({ isOpen: false, mode: 'create', book: null });
  
  const [userModal, setUserModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    user?: User | null;
  }>({ isOpen: false, mode: 'create', user: null });

  const statsRef = useRef<HTMLDivElement>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
      setFilteredUsers(users);
    } else {
      setFilteredBooks(bookService.search(searchTerm));
      setFilteredUsers(userService.search(searchTerm));
    }
  }, [searchTerm, books, users]);

  const loadData = () => {
    setBooks(bookService.getAll());
    setUsers(userService.getAll());
  };

  useEffect(() => {
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
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

  const stats = [
    {
      title: 'Total Books',
      value: books.length.toString(),
      change: '+8.2%',
      icon: <Book className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Users',
      value: users.filter(u => u.isActive).length.toString(),
      change: '+12.5%',
      icon: <Users className="w-8 h-8" />,
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Librarians',
      value: users.filter(u => u.role === 'librarian').length.toString(),
      change: '+4.1%',
      icon: <UserCheck className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Monthly Loans',
      value: '8,921',
      change: '+15.3%',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  // Book CRUD handlers
  const handleCreateBook = (bookData: Omit<BookType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBook = bookService.create(bookData);
    // Update state immediately without reload
    setBooks(prevBooks => [...prevBooks, newBook]);
    setFilteredBooks(prevBooks => [...prevBooks, newBook]);
  };

  const handleUpdateBook = (bookData: Omit<BookType, 'id' | 'createdAt' | 'updatedAt'>) => {
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

  // User CRUD handlers
  const handleCreateUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser = userService.create(userData);
    // Update state immediately without reload
    setUsers(prevUsers => [...prevUsers, newUser]);
    setFilteredUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleUpdateUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (userModal.user) {
      const updatedUser = userService.update(userModal.user.id, userData);
      if (updatedUser) {
        // Update state immediately without reload
        setUsers(prevUsers => 
          prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
        );
        setFilteredUsers(prevUsers => 
          prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
        );
      }
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const success = userService.delete(id);
      if (success) {
        // Update state immediately without reload
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      }
    }
  };

  const recentActivities = [
    { action: 'New book added', item: '"The Silent Patient"', time: '2 hours ago', type: 'book' },
    { action: 'User registered', item: 'john.doe@email.com', time: '4 hours ago', type: 'user' },
    { action: 'Librarian assigned', item: 'Sarah Wilson', time: '6 hours ago', type: 'staff' },
    { action: 'Book returned', item: '"Atomic Habits"', time: '1 day ago', type: 'loan' },
    { action: 'System backup completed', item: 'Database backup', time: '1 day ago', type: 'system' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { id: 'books', label: 'Books', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              <span className="text-green-400 text-sm font-semibold">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-300">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Library Usage Analytics</h3>
          <div className="h-64 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-xl flex items-center justify-center">
            <div className="text-center text-white/60">
              <BarChart3 className="w-16 h-16 mx-auto mb-4" />
              <p>Interactive charts would be displayed here</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-white text-sm">
                    <span className="font-medium">{activity.action}</span>
                    <br />
                    <span className="text-gray-300">{activity.item}</span>
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">User Management</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setUserModal({ isOpen: true, mode: 'create', user: null })}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </motion.button>
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Name</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 hidden sm:table-cell">Email</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Role</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 hidden md:table-cell">Status</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 hidden lg:table-cell">Member Since</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className="border-b border-white/5"
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-medium text-sm sm:text-base">{user.name}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm sm:text-base hidden sm:table-cell">{user.email}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                      user.role === 'librarian' ? 'bg-teal-500/20 text-teal-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm hidden lg:table-cell">{user.membershipDate}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex space-x-1 sm:space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setUserModal({ isOpen: true, mode: 'view', user })}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setUserModal({ isOpen: true, mode: 'edit', user })}
                        className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderBooks = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Book Management</h3>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-1 rounded-full truncate max-w-20 sm:max-w-none">
                  {book.category}
                </span>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {book.availableCopies}/{book.totalCopies} available
                </span>
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

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-semibold text-white mb-6">System Settings</h3>
      
      <div className="h-96 flex items-center justify-center text-white/60">
        <div className="text-center">
          <Settings className="w-16 h-16 mx-auto mb-4" />
          <p>System settings interface would be displayed here</p>
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'books':
        return renderBooks();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
     <>
    <DashboardLayout userRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage your library system with comprehensive controls</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors self-center sm:self-auto">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

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

    {/* Modals */}
    <BookModal
      isOpen={bookModal.isOpen}
      onClose={() => setBookModal({ isOpen: false, mode: 'create', book: null })}
      onSave={bookModal.mode === 'create' ? handleCreateBook : handleUpdateBook}
      book={bookModal.book}
      mode={bookModal.mode}
    />

    <UserModal
      isOpen={userModal.isOpen}
      onClose={() => setUserModal({ isOpen: false, mode: 'create', user: null })}
      onSave={userModal.mode === 'create' ? handleCreateUser : handleUpdateUser}
      user={userModal.user}
      mode={userModal.mode}
    />
    </>
  );
};

export default AdminDashboard;