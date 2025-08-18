import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, ArrowLeft, Eye, EyeOff, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const roleOptions = [
    { value: 'user', label: 'Library User', description: 'Browse and borrow books' },
    { value: 'librarian', label: 'Librarian', description: 'Manage books and users' },
    { value: 'admin', label: 'Administrator', description: 'Full system access' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </motion.button>

        <div ref={formRef}>
          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="w-10 h-10 text-blue-400" />
              <span className="text-3xl font-bold text-white">LibraLink</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Join LibraLink and start your reading journey</p>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-center"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
                  Account Type
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {roleOptions.find(option => option.value === formData.role)?.description}
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;