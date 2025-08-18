import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'librarian';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage on app start
    const savedUser = localStorage.getItem('libralink_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login logic
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role: email.includes('admin') ? 'admin' : email.includes('librarian') ? 'librarian' : 'user'
    };
    
    setUser(mockUser);
    // Persist user to localStorage
    localStorage.setItem('libralink_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: role as 'admin' | 'user' | 'librarian'
    };
    
    setUser(newUser);
    // Persist user to localStorage
    localStorage.setItem('libralink_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    // Remove user from localStorage
    localStorage.removeItem('libralink_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};