import React, { useEffect, useState, Component } from 'react';
import { ChevronDownIcon, SearchIcon, BellIcon, MessageSquareIcon, PlusIcon, ShoppingBagIcon, UserIcon, TicketIcon, MegaphoneIcon, CalendarIcon, UsersIcon, MenuIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { GlobalSearch } from '../ui/GlobalSearch';
import { LocationSelector } from '../ui/LocationSelector';
import { NotificationBell } from '../ui/NotificationBell';
import { MessageCenter } from '../ui/MessageCenter';
import { ProfileDropdown } from '../ui/ProfileDropdown';

type NavItemProps = {
  title: string;
  href: string;
  badge?: {
    text: string;
    color: string;
  };
  icon?: React.ReactNode;
};

const NavItem = ({
  title,
  href,
  badge,
  icon
}: NavItemProps) => {
  const navigate = useNavigate();
  return <button onClick={() => navigate(href)} className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-200">
      <span className="font-medium text-base">{title}</span>
      {icon && <span className="ml-1.5">{icon}</span>}
      {badge && <span className={`ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${badge.color}`}>
          {badge.text}
        </span>}
    </button>;
};

export const MainHeaderFixed = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // User state - would come from auth context in a real app
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    avatar: '',
    notificationCount: 0,
    unreadMessageCount: 0
  });
  
  // Location state - would come from location context in a real app
  const [locationInfo, setLocationInfo] = useState({
    currentLocation: '',
    eventCount: 0
  });
  
  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Safe navigation handler
  const handleNavigation = (path: string) => {
    try {
      navigate(path);
      setIsMobileMenuOpen(false);
    } catch (e) {
      console.error('Navigation error:', e);
      window.location.href = path;
    }
  };
  
  // Fixed Navigation items with correct routes
  const mainNavItems = [{
    title: 'Events',
    href: '/events'
  }, {
    title: 'Venues',
    href: '/venues'
  }, {
    title: 'Performers',
    href: '/performers'
  }, {
    title: 'About',
    href: '/about'
  }, {
    title: 'Calendars',
    href: '/calendars',
    icon: <CalendarIcon className="h-4 w-4" />
  }, {
    title: 'Tickets',
    href: '/tickets',
    icon: <TicketIcon className="h-4 w-4" />
  }, {
    title: 'Book It',
    href: '/book-it',
    badge: {
      text: 'NEW',
      color: 'bg-purple-100 text-purple-800'
    }
  }, {
    title: 'Shop',
    href: '/gear',
    icon: <ShoppingBagIcon className="h-4 w-4" />
  }, {
    title: 'Advertise',
    href: '/advertise',
    icon: <MegaphoneIcon className="h-4 w-4" />
  }];
  
  return <header className={`sticky top-0 z-50 bg-white shadow-sm transition-all duration-200 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Desktop Header - Now with two rows */}
      <div className="hidden lg:block">
        {/* Top Row - Logo, Location, and User Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
          {/* Left Section - Logo & Location */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="font-bold text-xl text-[#FF6B6B]">
                Go Event City
              </span>
            </div>
            <LocationSelector currentLocation={locationInfo.currentLocation} eventCount={locationInfo.eventCount} />
          </div>
          {/* Right Section - User Actions */}
          <div className="flex items-center space-x-5">
            <div className="w-64">
              <GlobalSearch />
            </div>
            {isLoggedIn && <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md transition-colors duration-150" onClick={() => navigate('/events/create')}>
                <PlusIcon className="h-4 w-4 mr-1.5" />
                <span className="text-sm font-medium">Create Event</span>
              </button>}
            {isLoggedIn && <button className="relative text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-150" onClick={() => navigate('/notifications')} aria-label="Notifications">
                <BellIcon className="h-5 w-5" />
                {userProfile.notificationCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {userProfile.notificationCount}
                  </span>}
              </button>}
            {isLoggedIn && <button className="relative text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-150" onClick={() => navigate('/messages')} aria-label="Messages">
                <MessageSquareIcon className="h-5 w-5" />
                {userProfile.unreadMessageCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {userProfile.unreadMessageCount}
                  </span>}
              </button>}
            {isLoggedIn ? <ProfileDropdown avatar={userProfile.avatar} /> : <div className="flex items-center space-x-3">
                <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm px-3 py-2 rounded-md hover:bg-indigo-50 transition-colors duration-150" onClick={() => navigate('/auth/sign-in')}>
                  Log In
                </button>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm transition-colors duration-150" onClick={() => navigate('/auth/sign-up')}>
                  Sign Up
                </button>
              </div>}
          </div>
        </div>
        {/* Bottom Row - Simplified Navigation Menu */}
        <div className="px-6 py-2 flex justify-center">
          <nav className="flex items-center space-x-4">
            {mainNavItems.map((item, index) => <NavItem key={index} title={item.title} href={item.href} badge={item.badge} icon={item.icon} />)}
          </nav>
        </div>
      </div>

      {/* Tablet/Mobile Header */}
      <div className="flex lg:hidden items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 mr-3 p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-150" aria-label="Toggle menu">
            <MenuIcon className="h-5 w-5" />
          </button>
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-bold text-lg text-[#FF6B6B]">
              Go Event City
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsSearchOpen(true)} className="text-gray-700 p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-150" aria-label="Search">
            <SearchIcon className="h-5 w-5" />
          </button>
          {isLoggedIn ? <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200">
              {userProfile.avatar ? <img src={userProfile.avatar} alt="User profile" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                </div>}
            </div> : <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors duration-150" onClick={() => navigate('/auth/sign-in')}>
              Login
            </button>}
        </div>
      </div>

      {/* Tablet/Mobile Menu */}
      {isMobileMenuOpen && <div className="lg:hidden bg-white border-t border-gray-200 py-2 shadow-lg">
          <div className="px-4 py-2">
            <LocationSelector currentLocation={locationInfo.currentLocation} eventCount={locationInfo.eventCount} isMobile={true} />
          </div>
          <nav className="mt-3">
            {/* Main navigation items */}
            {mainNavItems.map((item, index) => <button key={index} className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 border-t border-gray-100 transition-colors duration-150" onClick={() => handleNavigation(item.href)}>
                  {item.icon && <span className="mr-3 text-gray-500">{item.icon}</span>}
                  <span className="font-medium text-base">{item.title}</span>
                  {item.badge && <span className={`ml-2 ${item.badge.color} text-xs px-2 py-0.5 rounded-full`}>
                      {item.badge.text}
                    </span>}
                </button>)}
            {/* User section */}
            {!isLoggedIn && <div className="border-t border-gray-100 mt-3 pt-3 px-4 py-2">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-md font-medium text-base mb-3 shadow-sm transition-colors duration-150" onClick={() => handleNavigation('/auth/sign-up')}>
                  Sign Up
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-md font-medium text-base transition-colors duration-150" onClick={() => handleNavigation('/auth/sign-in')}>
                  Login
                </button>
              </div>}
          </nav>
        </div>}

      {/* Search Overlay */}
      {isSearchOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Search Events
              </h3>
              <button onClick={() => setIsSearchOpen(false)} className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-150" aria-label="Close search">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search events, venues, or performers..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150" autoFocus />
            </div>
            <div className="mt-5">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-semibold">
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Live Music', 'Farmers Market', 'Art Walk', 'Comedy Show', 'Food Festival'].map((term, i) => <button key={i} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors duration-150" onClick={() => {
              navigate(`/events?q=${encodeURIComponent(term)}`);
              setIsSearchOpen(false);
            }}>
                    {term}
                  </button>)}
              </div>
            </div>
          </div>
        </div>}
    </header>;
};