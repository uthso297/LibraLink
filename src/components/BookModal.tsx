import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, BookOpen } from 'lucide-react';
import { Book } from '../types';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  book?: Book | null;
  mode: 'create' | 'edit' | 'view';
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSave, book, mode }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    publishedYear: new Date().getFullYear(),
    totalCopies: 1,
    availableCopies: 1,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 0
  });

  useEffect(() => {
    if (book && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        description: book.description,
        publishedYear: book.publishedYear,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        image: book.image,
        rating: book.rating
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        description: '',
        publishedYear: new Date().getFullYear(),
        totalCopies: 1,
        availableCopies: 1,
        image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 0
      });
    }
  }, [book, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishedYear' || name === 'totalCopies' || name === 'availableCopies' || name === 'rating'
        ? Number(value)
        : value
    }));
  };

  const categories = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Biography', 'History', 'Self-Help', 'Finance', 'Psychology', 'Technology', 'Art'];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {mode === 'create' ? 'Add New Book' : mode === 'edit' ? 'Edit Book' : 'Book Details'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={mode === 'view'}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm sm:text-base"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                disabled={mode === 'view'}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">ISBN</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                required
                disabled={mode === 'view'}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Enter ISBN"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={mode === 'view'}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Published Year</label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleInputChange}
                required
                disabled={mode === 'view'}
                min="1000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Total Copies</label>
              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleInputChange}
                required
                disabled={mode === 'view'}
                min="1"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Available Copies</label>
              <input
                type="number"
                name="availableCopies"
                value={formData.availableCopies}
                onChange={handleInputChange}
                required
                disabled={mode === 'view'}
                min="0"
                max={formData.totalCopies}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                disabled={mode === 'view'}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={mode === 'view'}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
              placeholder="Enter book description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              disabled={mode === 'view'}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter image URL"
            />
          </div>

          {mode !== 'view' && (
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{mode === 'create' ? 'Add Book' : 'Save Changes'}</span>
              </motion.button>
            </div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BookModal;