import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import LibrarianDashboard from './pages/LibrarianDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { initializeData } from './services/dataService';

function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/librarian" element={<LibrarianDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;