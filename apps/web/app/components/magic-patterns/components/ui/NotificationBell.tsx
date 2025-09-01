import React, { useState, Component } from 'react';
/**
 * Component: Notification Bell
 * Type: CSR
 * Mockdata: OFF
 * Description: Interactive notification indicator with dropdown
 * Components: None
 */
import { BellIcon, CheckIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
type NotificationBellProps = {
  count: number;
};
type Notification = {
  id: number;
  type: 'event' | 'friend' | 'ticket' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
};
export const NotificationBell = ({
  count
}: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([{
    id: 1,
    type: 'event',
    title: 'New event near you',
    message: 'Clearwater Jazz Holiday has been announced',
    time: '2 hours ago',
    isRead: false
  }, {
    id: 2,
    type: 'friend',
    title: 'Friend request',
    message: 'Sarah Johnson wants to connect',
    time: '1 day ago',
    isRead: false
  }, {
    id: 3,
    type: 'ticket',
    title: 'Ticket confirmation',
    message: 'Your tickets for Sunset Cinema are ready',
    time: '3 days ago',
    isRead: true
  }, {
    id: 4,
    type: 'system',
    title: 'Account security',
    message: 'We noticed a login from a new device',
    time: '5 days ago',
    isRead: true
  }]);
  const {
    navigateTo
  } = useNavigationContext();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
  };
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => notification.id === id ? {
      ...notification,
      isRead: true
    } : notification));
  };
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    // Navigate based on notification type
    switch (notification.type) {
      case 'event':
        navigateTo('/event');
        break;
      case 'friend':
        navigateTo('/my/following');
        break;
      case 'ticket':
        navigateTo('/profile/tickets');
        break;
      case 'system':
        navigateTo('/settings/account');
        break;
      default:
        break;
    }
    setIsOpen(false);
  };
  const viewAllNotifications = () => {
    navigateTo('/my/notifications');
    setIsOpen(false);
  };
  return <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-1 text-gray-700 hover:text-gray-900 focus:outline-none" aria-label="Notifications">
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>}
      </button>
      {isOpen && <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-2" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  Notifications
                </h3>
                <button className="text-xs text-indigo-600 hover:text-indigo-800" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? <div className="px-4 py-6 text-center text-gray-500">
                  <p>No notifications yet</p>
                </div> : notifications.map(notification => <button key={notification.id} className={`block w-full text-left px-4 py-3 hover:bg-gray-50 ${notification.isRead ? '' : 'bg-blue-50'}`} onClick={() => handleNotificationClick(notification)}>
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${notification.type === 'event' ? 'bg-purple-100 text-purple-500' : notification.type === 'friend' ? 'bg-green-100 text-green-500' : notification.type === 'system' ? 'bg-blue-100 text-blue-500' : 'bg-orange-100 text-orange-500'}`}>
                        {notification.type === 'event' && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>}
                        {notification.type === 'friend' && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>}
                        {notification.type === 'ticket' && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>}
                        {notification.type === 'system' && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>}
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.isRead && <div className="ml-2 flex-shrink-0">
                          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                        </div>}
                    </div>
                  </button>)}
            </div>
            <div className="border-t border-gray-200 py-2 px-4 text-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-800" onClick={viewAllNotifications}>
                View all notifications
              </button>
            </div>
          </div>
        </div>}
    </div>;
};