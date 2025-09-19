import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Navigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { actualTheme } = useTheme();

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${actualTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`h-screen transition-colors duration-200 ${actualTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <main className={`flex-1 overflow-y-auto p-6 ${actualTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;