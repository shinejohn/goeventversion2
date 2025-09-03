import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { BellIcon, CheckIcon, XIcon, UserPlusIcon, CalendarIcon, MessageCircleIcon, ThumbsUpIcon, HeartIcon, StarIcon, MusicIcon, MapPinIcon, FilterIcon, MoreHorizontalIcon, ChevronDownIcon } from 'lucide-react';
// Mock data for notifications
const mockNotifications = [{
  id: 'notif-1',
  type: 'friend_request',
  actor: {
    id: 'user-789',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  content: 'sent you a friend request',
  timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
  read: false,
  actionable: true
}, {
  id: 'notif-2',
  type: 'event_invite',
  actor: {
    id: 'user-456',
    name: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  content: 'invited you to the event "Summer Beach Concert"',
  target: {
    id: 'event-123',
    name: 'Summer Beach Concert',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
  read: false,
  actionable: true
}, {
  id: 'notif-3',
  type: 'post_like',
  actor: {
    id: 'user-345',
    name: 'Marcus Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  content: 'liked your post about the Jazz Festival',
  timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
  read: true,
  actionable: false
}, {
  id: 'notif-4',
  type: 'comment',
  actor: {
    id: 'user-234',
    name: 'Jessica Taylor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  content: 'commented on your post: "That sounds amazing! Count me in for next time."',
  timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
  read: true,
  actionable: false
}, {
  id: 'notif-5',
  type: 'group_invite',
  actor: {
    id: 'user-567',
    name: 'Daniel Lee',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  content: 'invited you to join the group "Clearwater Music Lovers"',
  target: {
    id: 'group-1',
    name: 'Clearwater Music Lovers',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
  read: false,
  actionable: true
}, {
  id: 'notif-6',
  type: 'event_reminder',
  content: 'Reminder: "Downtown Art Walk" is happening tomorrow at 6 PM',
  target: {
    id: 'event-456',
    name: 'Downtown Art Walk',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
  read: true,
  actionable: false,
  system: true
}, {
  id: 'notif-7',
  type: 'performer_update',
  actor: {
    id: 'performer-1',
    name: 'The Sunset Kings',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    type: 'performer'
  },
  content: 'just announced a new show at Capitol Theatre',
  target: {
    id: 'event-789',
    name: 'The Sunset Kings Live',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
  read: true,
  actionable: false
}, {
  id: 'notif-8',
  type: 'venue_update',
  actor: {
    id: 'venue-1',
    name: 'Capitol Theatre',
    avatar: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    type: 'venue'
  },
  content: 'added 5 new events to their calendar',
  timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
  read: true,
  actionable: false
}, {
  id: 'notif-9',
  type: 'ticket_confirmation',
  content: 'Your tickets for "Clearwater Jazz Holiday" have been confirmed',
  target: {
    id: 'event-101',
    name: 'Clearwater Jazz Holiday',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
  read: true,
  actionable: false,
  system: true
}];
const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  // Format timestamp for display
  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notif => notif.id === notificationId ? {
      ...notif,
      read: true
    } : notif));
  };
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({
      ...notif,
      read: true
    })));
  };
  // Handle friend request acceptance
  const acceptFriendRequest = (notificationId: string) => {
    // In a real app, this would make an API call
    markAsRead(notificationId);
    alert('Friend request accepted!');
  };
  // Handle friend request decline
  const declineFriendRequest = (notificationId: string) => {
    // In a real app, this would make an API call
    markAsRead(notificationId);
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };
  // Handle event invitation response
  const respondToEventInvite = (notificationId: string, accept: boolean) => {
    // In a real app, this would make an API call
    markAsRead(notificationId);
    alert(`Event invitation ${accept ? 'accepted' : 'declined'}!`);
    if (!accept) {
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    }
  };
  // Handle group invitation response
  const respondToGroupInvite = (notificationId: string, accept: boolean) => {
    // In a real app, this would make an API call
    markAsRead(notificationId);
    alert(`Group invitation ${accept ? 'accepted' : 'declined'}!`);
    if (!accept) {
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    }
  };
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notif => {
    switch (activeTab) {
      case 'unread':
        return !notif.read;
      case 'requests':
        return notif.type === 'friend_request' || notif.type === 'group_invite';
      case 'events':
        return notif.type === 'event_invite' || notif.type === 'event_reminder' || notif.type === 'ticket_confirmation';
      default:
        return true;
    }
  });
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <UserPlusIcon className="h-5 w-5 text-blue-500" />;
      case 'event_invite':
      case 'event_reminder':
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      case 'post_like':
        return <ThumbsUpIcon className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <MessageCircleIcon className="h-5 w-5 text-green-500" />;
      case 'group_invite':
        return <UsersIcon className="h-5 w-5 text-indigo-500" />;
      case 'performer_update':
        return <MusicIcon className="h-5 w-5 text-yellow-500" />;
      case 'venue_update':
        return <MapPinIcon className="h-5 w-5 text-orange-500" />;
      case 'ticket_confirmation':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  // Render notification actions based on type
  const renderNotificationActions = (notification: any) => {
    switch (notification.type) {
      case 'friend_request':
        return <div className="mt-2 flex space-x-2">
            <button onClick={() => acceptFriendRequest(notification.id)} className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
              Accept
            </button>
            <button onClick={() => declineFriendRequest(notification.id)} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
              Decline
            </button>
          </div>;
      case 'event_invite':
        return <div className="mt-2 flex space-x-2">
            <button onClick={() => respondToEventInvite(notification.id, true)} className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
              Going
            </button>
            <button onClick={() => respondToEventInvite(notification.id, false)} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
              Not Going
            </button>
            <button onClick={() => navigate(`/events/${notification.target.id}`)} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
              View Event
            </button>
          </div>;
      case 'group_invite':
        return <div className="mt-2 flex space-x-2">
            <button onClick={() => respondToGroupInvite(notification.id, true)} className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
              Join
            </button>
            <button onClick={() => respondToGroupInvite(notification.id, false)} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
              Decline
            </button>
            <button onClick={() => navigate(`/social/groups/${notification.target.id}`)} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
              View Group
            </button>
          </div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                <FilterIcon className="h-4 w-4 mr-2" />
                Filter
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </button>
              {showFilterDropdown && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {
                setActiveTab('all');
                setShowFilterDropdown(false);
              }}>
                    All Notifications
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {
                setActiveTab('unread');
                setShowFilterDropdown(false);
              }}>
                    Unread
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {
                setActiveTab('requests');
                setShowFilterDropdown(false);
              }}>
                    Friend Requests
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {
                setActiveTab('events');
                setShowFilterDropdown(false);
              }}>
                    Events
                  </button>
                </div>}
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200" onClick={markAllAsRead}>
              Mark all as read
            </button>
          </div>
        </div>
        {/* Notification tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button className={`px-4 py-4 text-sm font-medium border-b-2 ${activeTab === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('all')}>
                All
              </button>
              <button className={`px-4 py-4 text-sm font-medium border-b-2 ${activeTab === 'unread' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('unread')}>
                Unread
                <span className="ml-2 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                  {notifications.filter(n => !n.read).length}
                </span>
              </button>
              <button className={`px-4 py-4 text-sm font-medium border-b-2 ${activeTab === 'requests' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('requests')}>
                Requests
              </button>
              <button className={`px-4 py-4 text-sm font-medium border-b-2 ${activeTab === 'events' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('events')}>
                Events
              </button>
            </nav>
          </div>
        </div>
        {/* Notifications list */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? filteredNotifications.map(notification => <div key={notification.id} className={`bg-white rounded-lg shadow p-4 ${!notification.read ? 'border-l-4 border-indigo-500' : ''}`} onClick={() => markAsRead(notification.id)}>
                <div className="flex">
                  {/* Icon */}
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                  {/* Content */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {notification.actor && <img src={notification.actor.avatar} alt={notification.actor.name} className="h-6 w-6 rounded-full mr-2" />}
                        <div>
                          {notification.actor && <span className="font-medium text-gray-900">
                              {notification.actor.name}
                              {notification.actor.type && <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-sm">
                                  {notification.actor.type === 'venue' ? 'Venue' : 'Performer'}
                                </span>}
                            </span>}
                          <span className="text-gray-600">
                            {notification.actor ? ' ' : ''}
                            {notification.content}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                        <button className="text-gray-400 hover:text-gray-500">
                          <MoreHorizontalIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {/* Target (if exists) */}
                    {notification.target && notification.target.image && <div className="mt-2">
                        <div className="flex items-center p-2 bg-gray-50 rounded-md">
                          <img src={notification.target.image} alt={notification.target.name} className="h-12 w-12 rounded object-cover" />
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">
                              {notification.target.name}
                            </div>
                          </div>
                        </div>
                      </div>}
                    {/* Actions */}
                    {notification.actionable && renderNotificationActions(notification)}
                  </div>
                </div>
              </div>) : <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <BellIcon className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No notifications
              </h3>
              <p className="mt-1 text-gray-500">
                You're all caught up! Check back later for new notifications.
              </p>
            </div>}
        </div>
        {/* Settings link */}
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/profile/settings/notifications')} className="text-sm text-indigo-600 hover:text-indigo-800">
            Notification Settings
          </button>
        </div>
      </div>
    </div>;
};
const UsersIcon = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>;
export default NotificationsPage;