import React, { useEffect, useState } from 'react';
import { HomeIcon, CalendarIcon, UserIcon, SettingsIcon, MenuIcon, XIcon, TicketIcon, CompassIcon, ListIcon, MusicIcon, MapPinIcon, ShoppingBagIcon, BriefcaseIcon, HeartIcon, UsersIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
export const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDirectoryButton, setShowDirectoryButton] = useState(true);
  const {
    navigateTo,
    currentPath
  } = useNavigationContext();
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.floating-nav-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  // Main navigation categories
  const navCategories = [{
    title: 'Main Pages',
    items: [{
      icon: <HomeIcon className="h-5 w-5" />,
      label: 'Home',
      path: '/'
    }, {
      icon: <CalendarIcon className="h-5 w-5" />,
      label: 'Calendar',
      path: '/calendar'
    }, {
      icon: <TicketIcon className="h-5 w-5" />,
      label: 'Events',
      path: '/events'
    }, {
      icon: <MapPinIcon className="h-5 w-5" />,
      label: 'Venues',
      path: '/venues'
    }, {
      icon: <MusicIcon className="h-5 w-5" />,
      label: 'Performers',
      path: '/performers'
    }, {
      icon: <UsersIcon className="h-5 w-5" />,
      label: 'Communities',
      path: '/hubs',
      highlight: true
    }, {
      icon: <CalendarIcon className="h-5 w-5" />,
      label: 'Calendars',
      path: '/calendars/marketplace'
    }, {
      icon: <HeartIcon className="h-5 w-5" />,
      label: 'Following',
      path: '/my/following'
    }]
  }, {
    title: 'Book It',
    items: [{
      icon: <BriefcaseIcon className="h-5 w-5" />,
      label: 'Book It',
      path: '/book'
    }, {
      icon: <MapPinIcon className="h-5 w-5" />,
      label: 'Venues',
      path: '/book-it/venues'
    }]
  }, {
    title: 'Shop & Tickets',
    items: [{
      icon: <TicketIcon className="h-5 w-5" />,
      label: 'Tickets',
      path: '/tickets'
    }, {
      icon: <ShoppingBagIcon className="h-5 w-5" />,
      label: 'Shop',
      path: '/gear'
    }]
  }, {
    title: 'Utilities',
    items: [{
      icon: <ListIcon className="h-5 w-5" />,
      label: 'Directory',
      path: '/directory'
    }, {
      icon: <UserIcon className="h-5 w-5" />,
      label: 'Login',
      path: '/login'
    }]
  }];
  const handleNavigation = (path: string) => {
    try {
      navigateTo(path);
      setIsOpen(false);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to direct navigation if navigateTo fails
      window.location.href = path;
    }
  };
  // Show directory button immediately if not on directory page
  const isDirectoryPage = currentPath === '/directory';
  return <div className="fixed bottom-6 right-6 z-50 floating-nav-container">
      {/* Quick access to Communities */}
      {!isOpen && <button onClick={() => handleNavigation('/hubs')} className="absolute bottom-28 right-0 flex items-center space-x-2 bg-indigo-600 text-white py-2.5 px-4 rounded-lg shadow-lg mb-2 hover:bg-indigo-700 transition-all duration-200">
          <UsersIcon className="h-5 w-5" />
          <span className="font-medium">Communities</span>
        </button>}
      {/* Quick access to directory */}
      {showDirectoryButton && !isDirectoryPage && !isOpen && <button onClick={() => handleNavigation('/directory')} className="absolute bottom-16 right-0 flex items-center space-x-2 bg-indigo-100 text-indigo-700 py-2.5 px-4 rounded-lg shadow-md mb-2 hover:bg-indigo-200 transition-all duration-200">
          <ListIcon className="h-5 w-5" />
          <span className="font-medium">Page Directory</span>
        </button>}
      {/* Main menu button */}
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-center h-14 w-14 rounded-full shadow-lg focus:outline-none transition-all duration-300 ${isOpen ? 'bg-red-500 rotate-45' : 'bg-indigo-600 hover:bg-indigo-700'}`} aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}>
        {isOpen ? <XIcon className="h-6 w-6 text-white" /> : <CompassIcon className="h-6 w-6 text-white" />}
      </button>
      {/* Navigation menu */}
      {isOpen && <div className="absolute bottom-16 right-0 mb-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            {navCategories.map((category, categoryIndex) => <div key={categoryIndex} className="border-b border-gray-100 last:border-0">
                <div className="px-4 py-2.5 bg-gray-50 font-medium text-sm text-gray-600">
                  {category.title}
                </div>
                <div className="p-2 grid grid-cols-2 gap-2">
                  {category.items.map((item, itemIndex) => <button key={itemIndex} onClick={() => handleNavigation(item.path)} className={`flex flex-col items-center p-2.5 rounded-md transition-colors duration-200 ${currentPath === item.path ? 'bg-indigo-100 text-indigo-700' : item.highlight ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-gray-100 text-gray-700'}`}>
                      <span className={currentPath === item.path || item.highlight ? 'text-indigo-600' : 'text-gray-500'}>
                        {item.icon}
                      </span>
                      <span className="text-xs mt-1.5 text-center font-medium">
                        {item.label}
                      </span>
                    </button>)}
                </div>
              </div>)}
          </div>
        </div>}
    </div>;
};