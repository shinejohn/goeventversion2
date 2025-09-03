import React from 'react';
import { useNavigate } from 'react-router';

export const SimpleFooter = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Go Event City */}
          <div>
            <h3 className="text-lg font-semibold mb-5">About Go Event City</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => navigate('/about')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/how-it-works')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/community-impact')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Community Impact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/press')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Press & Media
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/careers')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Careers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contact')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
          
          {/* For Event Goers */}
          <div>
            <h3 className="text-lg font-semibold mb-5">For Event Goers</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => navigate('/events')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Browse Events
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/tickets')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Buy Tickets
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/venues')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Find Venues
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/performers')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Discover Performers
                </button>
              </li>
            </ul>
          </div>
          
          {/* For Businesses */}
          <div>
            <h3 className="text-lg font-semibold mb-5">For Businesses</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => navigate('/advertise')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Advertising Solutions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/book-it')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Booking Marketplace
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/success-stories')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Success Stories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/partner')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Partner With Us
                </button>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Support</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => navigate('/help')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contact')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/privacy-policy')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/terms-of-service')} 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-150"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-sm text-gray-400">
                © 2024 Go Event City | Part of Fibonacco
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};