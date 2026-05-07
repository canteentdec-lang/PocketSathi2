import React from 'react';
import { Menu, X, User, LogOut, Sun, Moon, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, Link } from 'react-router-dom';
import { User as UserType } from '../types';

interface NavbarProps {
  currentUser: UserType | null;
  onLoginClick: () => void;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ currentUser, onLoginClick, onLogout, isDark, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { label: 'Coach', path: '/coach' },
    { label: 'UPI Analyzer', path: '/upi' },
    { label: 'Debt Detector', path: '/debt' },
    { label: 'Investment', path: '/investment' },
    { label: 'Learn Hub', path: '/learn' },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-5xl bg-white/80 dark:bg-brand-navy/80 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-amber rounded-lg flex items-center justify-center text-brand-navy">
              <IndianRupee size={24} strokeWidth={3} />
            </div>
            <span className="text-2xl font-display font-extrabold text-brand-navy dark:text-white">
              PocketSathi
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-brand-amber' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-brand-amber dark:hover:text-brand-amber'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            
            <div className="flex items-center gap-4 ml-4">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Welcome,</span>
                    <span className="text-sm font-bold truncate max-w-[120px]">
                      {currentUser.name} 👋
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="btn-primary py-2 px-6"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-brand-navy border-b border-gray-200 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `block px-3 py-4 text-base font-medium rounded-lg ${
                      isActive 
                        ? 'bg-brand-amber/10 text-brand-amber' 
                        : 'hover:bg-gray-50 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {!currentUser && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLoginClick();
                  }}
                  className="w-full btn-primary mt-4"
                >
                  Login
                </button>
              )}
              {currentUser && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-bold"
                >
                  <LogOut size={20} /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
