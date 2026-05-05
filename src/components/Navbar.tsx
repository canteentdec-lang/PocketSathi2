import React from 'react';
import { Menu, X, User, LogOut, Sun, Moon, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
    { label: 'Coach', href: '#coach' },
    { label: 'UPI Analyzer', href: '#upi' },
    { label: 'Debt Detector', href: '#debt' },
    { label: 'Investment', href: '#investment' },
    { label: 'Learn Hub', href: '#learn' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-brand-navy/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-amber rounded-lg flex items-center justify-center text-brand-navy">
              <IndianRupee size={24} strokeWidth={3} />
            </div>
            <span className="text-2xl font-display font-extrabold text-brand-navy dark:text-white">
              PocketSathi
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-amber dark:hover:text-brand-amber transition-colors"
              >
                {link.label}
              </a>
            ))}
            
            <div className="flex items-center gap-4 ml-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

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
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
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
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  {link.label}
                </a>
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
