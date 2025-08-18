import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, User } from 'lucide-react';
import { User as UserType } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  user?: UserType | null;
  mode: 'create' | 'edit' | 'view';
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user, mode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'librarian',
    membershipDate: new Date().toISOString().split('T')[0],
    isActive: true,
    borrowedBooks: [] as string[]
  });

  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        membershipDate: user.membershipDate,
        isActive: user.isActive,
        borrowedBooks: user.borrowedBooks
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        email: '',
        role: 'user',
        membershipDate: new Date().toISOString().split('T')[0],
        isActive: true,
        borrowedBooks: []
      });
    }
  }, [user, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

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
        className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {mode === 'create' ? 'Add New User' : mode === 'edit' ? 'Edit User' : 'User Details'}
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
          <div>
            <label className="block text-sm font-medium text-white mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={mode === 'view'}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm sm:text-base"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={mode === 'view'}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              disabled={mode === 'view'}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="user" className="bg-slate-800">User</option>
              <option value="librarian" className="bg-slate-800">Librarian</option>
              <option value="admin" className="bg-slate-800">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Membership Date</label>
            <input
              type="date"
              name="membershipDate"
              value={formData.membershipDate}
              onChange={handleInputChange}
              required
              disabled={mode === 'view'}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              disabled={mode === 'view'}
              className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <label className="text-sm font-medium text-white">Active Account</label>
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
                <span>{mode === 'create' ? 'Add User' : 'Save Changes'}</span>
              </motion.button>
            </div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserModal;