import React, { useState } from 'react';
import { MenuIcon, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

export const SimpleHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Fixed Navigation items with correct routes
  const mainNavItems = [
    { title: 'Events', href: '/events' },
    { title: 'Venues', href: '/venues' },
    { title: 'Performers', href: '/performers' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Tickets', href: '/tickets' },
    { title: 'Book It', href: '/book-it' },
    { title: 'Advertise', href: '/advertise' }
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      {/* Desktop Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-bold text-xl text-[#FF6B6B]">
              Go Event City
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {mainNavItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.href)}
                className="text-gray-700 hover:text-[#FF6B6B] font-medium text-sm transition-colors duration-150"
              >
                {item.title}
              </button>
            ))}
          </nav>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              className="text-[#FF6B6B] hover:text-[#e55555] font-medium text-sm px-3 py-2 rounded-md hover:bg-red-50 transition-colors duration-150" 
              onClick={() => navigate('/auth/sign-in')}
            >
              Log In
            </button>
            <button 
              className="bg-[#FF6B6B] hover:bg-[#e55555] text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm transition-colors duration-150" 
              onClick={() => navigate('/auth/sign-up')}
            >
              Sign Up
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors duration-150"
              aria-label="Toggle menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-2 space-y-2">
            {mainNavItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#FF6B6B] hover:bg-gray-50 rounded-md font-medium transition-colors duration-150"
              >
                {item.title}
              </button>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
              <button
                onClick={() => {
                  navigate('/auth/sign-up');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full bg-[#FF6B6B] hover:bg-[#e55555] text-white px-4 py-2 rounded-md font-medium text-center shadow-sm transition-colors duration-150"
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  navigate('/auth/sign-in');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium text-center transition-colors duration-150"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};