import React from 'react';
import { Link } from 'react-router';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Discover',
      links: [
        { name: 'Events', href: '/events' },
        { name: 'Venues', href: '/venues' },
        { name: 'Performers', href: '/performers' },
        { name: 'Calendars', href: '/calendars' },
        { name: 'Communities', href: '/hubs' },
      ],
    },
    {
      title: 'Create & Promote',
      links: [
        { name: 'Create Event', href: '/events/create' },
        { name: 'List Your Venue', href: '/venues/create' },
        { name: 'Artist Tools', href: '/performers/tools' },
        { name: 'Advertise', href: '/advertise' },
        { name: 'Event Promotion', href: '/advertise/event-promotion' },
      ],
    },
    {
      title: 'Buy & Sell',
      links: [
        { name: 'Tickets', href: '/tickets/buy' },
        { name: 'Book Venues', href: '/book' },
        { name: 'Marketplace', href: '/gear' },
        { name: 'Gift Cards', href: '/gift-cards' },
        { name: 'Deals', href: '/deals' },
      ],
    },
    {
      title: 'About',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Success Stories', href: '/success-stories' },
        { name: 'Press & Media', href: '/press' },
        { name: 'Careers', href: '/careers' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Safety', href: '/safety' },
        { name: 'Terms', href: '/marketing/terms-of-service' },
        { name: 'Privacy', href: '/marketing/privacy-policy' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com/goeventcity' },
    { name: 'Twitter', icon: TwitterIcon, href: 'https://twitter.com/goeventcity' },
    { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/goeventcity' },
    { name: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com/goeventcity' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Stay in the loop</h3>
              <p className="mt-2 text-gray-400">
                Get the latest events, exclusive offers, and updates delivered to your inbox.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-80"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-white">Go Event City</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Discover amazing events, book incredible venues, and connect with talented performers in your city.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Download Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h4 className="text-white font-semibold mb-2">Get the app</h4>
              <div className="flex space-x-4">
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200">
                  <img
                    src="/images/app-store-badge.svg"
                    alt="Download on the App Store"
                    className="h-8"
                  />
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200">
                  <img
                    src="/images/google-play-badge.svg"
                    alt="Get it on Google Play"
                    className="h-8"
                  />
                </button>
              </div>
            </div>

            {/* Location Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Location:</span>
                <select className="bg-gray-800 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Language:</span>
                <select className="bg-gray-800 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>English</option>
                  <option>Español</option>
                  <option>Français</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-400">
              © {currentYear} Go Event City. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4 text-sm">
              <Link to="/marketing/terms-of-service" className="hover:text-white transition-colors duration-200">
                Terms
              </Link>
              <Link to="/marketing/privacy-policy" className="hover:text-white transition-colors duration-200">
                Privacy
              </Link>
              <Link to="/marketing/cookie-policy" className="hover:text-white transition-colors duration-200">
                Cookies
              </Link>
              <Link to="/sitemap" className="hover:text-white transition-colors duration-200">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};