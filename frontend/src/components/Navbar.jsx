import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Moon, Sun, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 ${darkMode ? 'glass-dark' : 'glass'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Home className="text-primary w-6 h-6" />
              <span className={`font-bold text-xl tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>AI Interior</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link to="/design" className={`hover:text-primary transition-colors ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Design Room</Link>
              <Link to="/budget" className={`hover:text-primary transition-colors ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Budget</Link>
              <Link to="/dashboard" className={`hover:text-primary transition-colors ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Dashboard</Link>
              <Link to="/shop" className={`hover:text-primary transition-colors ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Shop</Link>
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-slate-600'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {token ? (
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Hi, {user?.name || 'User'}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-primary hover:bg-indigo-600 px-4 py-2 rounded-full font-medium transition-all text-white">
                  Sign In
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`p-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`md:hidden absolute w-full ${darkMode ? 'glass-dark' : 'glass'}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/design" className={`block px-3 py-2 text-base font-medium hover:text-primary ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Design Room</Link>
            <Link to="/budget" className={`block px-3 py-2 text-base font-medium hover:text-primary ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Budget</Link>
            <Link to="/dashboard" className={`block px-3 py-2 text-base font-medium hover:text-primary ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Dashboard</Link>
            <Link to="/shop" className={`block px-3 py-2 text-base font-medium hover:text-primary ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Shop</Link>
            
            {token ? (
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-500"
              >
                Sign Out
              </button>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-primary">Sign In</Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
