import React, { Component } from 'react';
/**
 * Page: Global Footer
 * Type: SSR
 * Mockdata: OFF
 * Description: SEO-optimized footer with community links and Fibonacco ecosystem
 * Components: None
 */
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

export const Footer = () => {
  const navigate = useNavigate();
  return <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Go Event City */}
          <div>
            <h3 className="text-lg font-semibold mb-5">About Go Event City</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => navigate('/about')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/how-it-works')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/community-impact')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Community Impact
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/press')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Press & Media
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/careers')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
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
                <button onClick={() => navigate('/events')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Browse Events
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tickets')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Buy Tickets
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tickets/sell')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Sell Tickets
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/find-friends')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Find Friends
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/premium')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Premium Membership
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/mobile-apps')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Mobile Apps
                </button>
              </li>
            </ul>
          </div>
          {/* For Businesses */}
          <div>
            <h3 className="text-lg font-semibold mb-5">For Businesses</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => navigate('/venues/submit')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  List Your Venue
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/performers/tools')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Performer Tools
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/organizer-hub')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Event Organizer Hub
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/advertise')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Advertising Solutions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/book-it/venues')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Booking Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/success-stories')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Success Stories
                </button>
              </li>
            </ul>
          </div>
          {/* Fibonacco Ecosystem */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Fibonacco Ecosystem</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => navigate('/ecosystem/alphasite')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  AlphaSite.ai
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/ecosystem/daynews')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Day.News
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/ecosystem/downtownguide')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  DowntownGuide
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/ecosystem/globalexplorer')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Global Explorer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/partner-with-us')} className="text-gray-300 hover:text-white text-sm transition-colors duration-150">
                  Partner With Us
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
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                <button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-gray-300 text-xs transition-colors duration-150">
                  Terms of Service
                </button>
                <button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-gray-300 text-xs transition-colors duration-150">
                  Privacy Policy
                </button>
                <button onClick={() => navigate('/cookies')} className="text-gray-400 hover:text-gray-300 text-xs transition-colors duration-150">
                  Cookie Policy
                </button>
                <button onClick={() => navigate('/accessibility')} className="text-gray-400 hover:text-gray-300 text-xs transition-colors duration-150">
                  Accessibility
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-5 mb-4">
                <button className="text-gray-400 hover:text-white transition-colors duration-150">
                  <FacebookIcon className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors duration-150">
                  <InstagramIcon className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors duration-150">
                  <TwitterIcon className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors duration-150">
                  <LinkedinIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => navigate('/app-store')} className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded flex items-center transition-colors duration-150">
                  <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.707,9.293l-5-5c-0.391-0.391-1.023-0.391-1.414,0l-5,5c-0.391,0.391-0.391,1.023,0,1.414 C6.488,10.902,6.744,11,7,11s0.512-0.098,0.707-0.293L11,7.414V20c0,0.553,0.447,1,1,1s1-0.447,1-1V7.414l3.293,3.293 C16.488,10.902,16.744,11,17,11s0.512-0.098,0.707-0.293C18.098,10.316,18.098,9.684,17.707,9.293z"></path>
                  </svg>
                  iOS App Store
                </button>
                <button onClick={() => navigate('/play-store')} className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded flex items-center transition-colors duration-150">
                  <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.707,9.293l-5-5c-0.391-0.391-1.023-0.391-1.414,0l-5,5c-0.391,0.391-0.391,1.023,0,1.414 C6.488,10.902,6.744,11,7,11s0.512-0.098,0.707-0.293L11,7.414V20c0,0.553,0.447,1,1,1s1-0.447,1-1V7.414l3.293,3.293 C16.488,10.902,16.744,11,17,11s0.512-0.098,0.707-0.293C18.098,10.316,18.098,9.684,17.707,9.293z"></path>
                  </svg>
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};