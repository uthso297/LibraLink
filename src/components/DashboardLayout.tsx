import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  LogOut, 
  User, 
  Bell,
  Home,
  Settings,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'admin' | 'user' | 'librarian';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'from-red-500 to-red-600';
      case 'librarian':
        return 'from-teal-500 to-teal-600';
      case 'user':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleLabel = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-white/10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3"
        >
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">LibraLink</h1>
            <p className="text-xs text-gray-400">{getRoleLabel(userRole)} Portal</p>
          </div>
        </motion.div>
      </div>

      {/* User Info */}
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${getRoleColor(userRole)} flex items-center justify-center`}>
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-medium text-sm sm:text-base truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 sm:p-6">
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={isMobile ? closeMobileSidebar : undefined}
            className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Dashboard</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={isMobile ? closeMobileSidebar : undefined}
            className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm sm:text-base"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Search</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={isMobile ? closeMobileSidebar : undefined}
            className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm sm:text-base"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Notifications</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={isMobile ? closeMobileSidebar : undefined}
            className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm sm:text-base"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Settings</span>
          </motion.button>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 sm:p-6 border-t border-white/10">
        <motion.button
          onClick={() => {
            handleLogout();
            if (isMobile) closeMobileSidebar();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all text-sm sm:text-base"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Logout</span>
        </motion.button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden lg:flex w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 flex-col"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeMobileSidebar}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-64 sm:w-72 h-full bg-slate-900/95 backdrop-blur-sm border-r border-white/20 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="flex justify-end p-4 border-b border-white/10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeMobileSidebar}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <SidebarContent isMobile={true} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileSidebar}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-bold text-white">LibraLink</span>
            </div>
            
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRoleColor(userRole)} flex items-center justify-center`}>
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full overflow-auto p-4 sm:p-6 lg:p-8"
          style={{ height: 'calc(100vh - 73px)' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;