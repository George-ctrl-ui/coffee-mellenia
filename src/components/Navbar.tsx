import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, Coffee } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'Our Story', path: '/story' },
    { label: 'Contact', path: '/contact' },
    { label: 'Track Order', path: '/track' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0E0A08]/90 backdrop-blur-lg shadow-xl border-b border-[#3E2818]/80 py-3.5'
          : 'bg-[#0E0A08]/70 backdrop-blur-md py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#FFFDF8] whitespace-nowrap shrink-0 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28] rounded-sm"
          >
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D95E14] to-[#F47A28] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all duration-200">
              <Coffee className="w-4 h-4" />
            </span>
            <span className="font-display tracking-wider font-extrabold uppercase text-[17px] text-[#FFFDF8] group-hover:text-[#F47A28] transition-colors">
              Coffee Mellenia
            </span>
          </Link>

          {/* Zone 2: Navigation Links (Clean Typography, Single-Line) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A39082]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors whitespace-nowrap shrink-0 py-1 relative ${
                    isActive
                      ? 'text-[#F47A28] font-semibold'
                      : 'hover:text-[#FFE4C6]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D95E14] to-[#F47A28] rounded-full shadow-xs" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Cart & Primary Action) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full text-[#FFE4C6] hover:bg-[#1E150F] hover:text-[#F47A28] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28]"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-gradient-to-r from-[#D95E14] to-[#F47A28] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            <Link
              to="/menu"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] active:scale-98 transition-all rounded-lg shadow-md whitespace-nowrap shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28] focus-visible:ring-offset-2"
            >
              Order Now
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#FFE4C6] hover:bg-[#1E150F] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#3E2818]/80 bg-[#0E0A08]/95 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#1F150F] text-[#F47A28] font-semibold'
                    : 'text-[#A39082] hover:bg-[#1E150F]/60 hover:text-[#FFE4C6]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] rounded-lg shadow-xs"
            >
              Order Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
