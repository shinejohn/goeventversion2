import React, { useState, Component } from 'react';
/**
 * Page: Profile Dropdown Component
 * Type: CSR
 * Mockdata: ON
 * Description: User menu with role switching
 * Components: None
 */
import { ChevronDownIcon, UserIcon, TicketIcon, SettingsIcon, BuildingIcon, HelpCircleIcon, LogOutIcon, CalendarIcon, LayoutIcon, BellIcon, MessageSquareIcon, UsersIcon, HeartIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
type ProfileDropdownProps = {
  avatar: string;
};
export const ProfileDropdown = ({
  avatar
}: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    navigateTo
  } = useNavigationContext();
  // Mock user data for navigation
  const username = 'alexjohnson'; // This would come from auth context in a real app
  const menuItems = [{
    icon: <UserIcon className="h-4 w-4" />,
    label: 'View Profile',
    href: `/profile/${username}`
  }, {
    icon: <TicketIcon className="h-4 w-4" />,
    label: 'My Tickets',
    href: '/profile/tickets'
  }, {
    icon: <CalendarIcon className="h-4 w-4" />,
    label: 'My Calendar',
    href: '/calendar'
  }, {
    icon: <LayoutIcon className="h-4 w-4" />,
    label: 'Dashboard',
    href: '/my/following'
  }, {
    icon: <BellIcon className="h-4 w-4" />,
    label: 'Notifications',
    href: '/social/notifications'
  }, {
    icon: <MessageSquareIcon className="h-4 w-4" />,
    label: 'Messages',
    href: '/social/messages'
  }, {
    icon: <UsersIcon className="h-4 w-4" />,
    label: 'Friends',
    href: '/social/friends'
  }, {
    icon: <HeartIcon className="h-4 w-4" />,
    label: 'Saved Items',
    href: '/social/saved'
  }, {
    icon: <SettingsIcon className="h-4 w-4" />,
    label: 'Account Settings',
    href: '/profile/settings'
  }, {
    icon: <BuildingIcon className="h-4 w-4" />,
    label: 'Venue Management',
    href: '/venues/management'
  }, {
    icon: <HelpCircleIcon className="h-4 w-4" />,
    label: 'Help & Support',
    href: '/about'
  }, {
    icon: <LogOutIcon className="h-4 w-4" />,
    label: 'Logout',
    href: '/login'
  }];
  const handleMenuItemClick = (href: string) => {
    navigateTo(href);
    setIsOpen(false);
  };
  return <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2" aria-expanded={isOpen} aria-haspopup="true">
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <img src={avatar} alt="User profile" className="h-full w-full object-cover" />
        </div>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>
      {isOpen && <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {menuItems.map((item, index) => <button key={index} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={() => handleMenuItemClick(item.href)}>
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.label}
              </button>)}
          </div>
        </div>}
    </div>;
};