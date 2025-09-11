import React, { useState, Component } from 'react';
/**
 * Page: Profile Dropdown Component
 * Type: CSR
 * Mockdata: ON
 * Description: User menu with role-specific management options
 * Components: None
 */
import { 
  ChevronDownIcon, 
  UserIcon, 
  TicketIcon, 
  SettingsIcon, 
  BuildingIcon, 
  HelpCircleIcon, 
  LogOutIcon, 
  CalendarIcon, 
  LayoutIcon, 
  BellIcon, 
  MessageSquareIcon, 
  UsersIcon, 
  HeartIcon,
  MusicIcon,
  MegaphoneIcon,
  TargetIcon,
  BarChart3Icon,
  PlusIcon,
  EditIcon
} from 'lucide-react';
import { useNavigate } from 'react-router';

type ProfileDropdownProps = {
  avatar: string;
  userRoles?: string[]; // Array of user roles for role-specific menu items
};

export const ProfileDropdown = ({
  avatar,
  userRoles = ['user'] // Default to basic user role
}: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Mock user data for navigation
  const username = 'alexjohnson'; // This would come from auth context in a real app
  
  // Base menu items for all users
  const baseMenuItems = [
    {
      icon: <UserIcon className="h-4 w-4" />,
      label: 'View Profile',
      href: `/profile/${username}`
    },
    {
      icon: <TicketIcon className="h-4 w-4" />,
      label: 'My Tickets',
      href: '/my-tickets'
    },
    {
      icon: <CalendarIcon className="h-4 w-4" />,
      label: 'My Calendar',
      href: '/my/calendar'
    },
    {
      icon: <LayoutIcon className="h-4 w-4" />,
      label: 'Dashboard',
      href: '/my/dashboard'
    },
    {
      icon: <BellIcon className="h-4 w-4" />,
      label: 'Notifications',
      href: '/notifications'
    },
    {
      icon: <MessageSquareIcon className="h-4 w-4" />,
      label: 'Messages',
      href: '/messages'
    },
    {
      icon: <UsersIcon className="h-4 w-4" />,
      label: 'Friends',
      href: '/social/friends'
    },
    {
      icon: <HeartIcon className="h-4 w-4" />,
      label: 'Saved Items',
      href: '/saved-items'
    }
  ];

  // Role-specific management items
  const getRoleSpecificItems = () => {
    const roleItems = [];
    
    if (userRoles.includes('performer')) {
      roleItems.push({
        icon: <MusicIcon className="h-4 w-4" />,
        label: 'Performer Management',
        href: '/management/performer',
        highlight: true
      });
    }
    
    if (userRoles.includes('venue_manager')) {
      roleItems.push({
        icon: <BuildingIcon className="h-4 w-4" />,
        label: 'Venue Management',
        href: '/management/venue',
        highlight: true
      });
    }
    
    if (userRoles.includes('organizer')) {
      roleItems.push({
        icon: <CalendarIcon className="h-4 w-4" />,
        label: 'Organizer Dashboard',
        href: '/management/organizer',
        highlight: true
      });
    }
    
    if (userRoles.includes('sponsor')) {
      roleItems.push({
        icon: <TargetIcon className="h-4 w-4" />,
        label: 'Sponsor Dashboard',
        href: '/management/sponsor',
        highlight: true
      });
    }
    
    if (userRoles.includes('influencer')) {
      roleItems.push({
        icon: <MegaphoneIcon className="h-4 w-4" />,
        label: 'Influencer Hub',
        href: '/management/influencer',
        highlight: true
      });
    }
    
    return roleItems;
  };

  // Common items
  const commonItems = [
    {
      icon: <SettingsIcon className="h-4 w-4" />,
      label: 'Account Settings',
      href: '/settings/account'
    },
    {
      icon: <HelpCircleIcon className="h-4 w-4" />,
      label: 'Help & Support',
      href: '/help'
    }
  ];

  // Create event item (for users with creation permissions)
  const createEventItem = {
    icon: <PlusIcon className="h-4 w-4" />,
    label: 'Create Event',
    href: '/events/create',
    highlight: true
  };

  // Combine all menu items
  const menuItems = [
    ...baseMenuItems,
    ...(userRoles.some(role => ['performer', 'venue_manager', 'organizer', 'influencer'].includes(role)) ? [createEventItem] : []),
    ...getRoleSpecificItems(),
    ...commonItems,
    {
      icon: <LogOutIcon className="h-4 w-4" />,
      label: 'Logout',
      href: '/logout'
    }
  ];
  const handleMenuItemClick = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-2" 
        aria-expanded={isOpen} 
        aria-haspopup="true"
      >
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <img src={avatar} alt="User profile" className="h-full w-full object-cover" />
        </div>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {menuItems.map((item, index) => (
              <button 
                key={index} 
                className={`flex w-full items-center px-4 py-2 text-sm transition-colors duration-150 ${
                  item.highlight 
                    ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="menuitem" 
                onClick={() => handleMenuItemClick(item.href)}
              >
                <span className={`mr-3 ${item.highlight ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.label}
                {item.highlight && (
                  <span className="ml-auto text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    Pro
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};