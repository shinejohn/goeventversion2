import React, { useState } from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { CalendarIcon, MapPinIcon, UserIcon, SettingsIcon, MusicIcon, BuildingIcon, MessageSquareIcon, ShareIcon, InstagramIcon, TwitterIcon, FacebookIcon, LinkedinIcon, PlusIcon, HeartIcon, UsersIcon } from 'lucide-react';
import { PublicCalendar } from '../../components/profile/PublicCalendar';
import { LikedPerformers } from '../../components/profile/LikedPerformers';
import { LikedVenues } from '../../components/profile/LikedVenues';
import { UserComments } from '../../components/profile/UserComments';
import { SharedCalendars } from '../../components/profile/SharedCalendars';
// Mock user data
const userData = {
  id: 'user-123',
  name: 'Alex Johnson',
  username: '@alexjohnson',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  bio: 'Event enthusiast and community organizer. Love discovering new local happenings!',
  location: 'Clearwater, FL',
  memberSince: 'April 2023',
  eventCount: 87,
  followersCount: 342,
  followingCount: 128,
  socialLinks: {
    twitter: 'alexjohnson',
    instagram: 'alex.johnson',
    facebook: '',
    linkedin: 'alexjohnson'
  },
  interests: ['Live Music', 'Food Festivals', 'Art Shows', 'Community Events', 'Theater'],
  isPerformer: true,
  performerId: 'performer-1'
};
export const UserProfilePage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [activeTab, setActiveTab] = useState('calendar');
  const tabs = [{
    id: 'calendar',
    label: 'Calendar',
    icon: <CalendarIcon className="h-5 w-5" />
  }, {
    id: 'performers',
    label: 'Liked Performers',
    icon: <MusicIcon className="h-5 w-5" />
  }, {
    id: 'venues',
    label: 'Liked Venues',
    icon: <BuildingIcon className="h-5 w-5" />
  }, {
    id: 'comments',
    label: 'Comments',
    icon: <MessageSquareIcon className="h-5 w-5" />
  }, {
    id: 'shared',
    label: 'Shared Calendars',
    icon: <ShareIcon className="h-5 w-5" />
  }];
  const handleManagePerformer = () => {
    navigateTo('/performers/management');
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-4 sm:px-6 py-5 flex flex-col sm:flex-row">
            <div className="sm:flex sm:items-center sm:flex-1">
              <div className="-mt-16 sm:-mt-20 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                <img src={userData.avatar} alt={userData.name} className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.name}
                </h1>
                <p className="text-gray-500">{userData.username}</p>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {userData.location}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {userData.interests.map((interest, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {interest}
                    </span>)}
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
              <div className="flex space-x-4 mb-4">
                {userData.socialLinks.twitter && <a href={`https://twitter.com/${userData.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                    <TwitterIcon className="h-5 w-5" />
                  </a>}
                {userData.socialLinks.instagram && <a href={`https://instagram.com/${userData.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                    <InstagramIcon className="h-5 w-5" />
                  </a>}
                {userData.socialLinks.facebook && <a href={`https://facebook.com/${userData.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                    <FacebookIcon className="h-5 w-5" />
                  </a>}
                {userData.socialLinks.linkedin && <a href={`https://linkedin.com/in/${userData.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                    <LinkedinIcon className="h-5 w-5" />
                  </a>}
              </div>
              <div className="flex space-x-3">
                <button onClick={() => navigateTo('/profile/settings')} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <SettingsIcon className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  Follow
                </button>
              </div>
              {userData.isPerformer && <button onClick={handleManagePerformer} className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <MusicIcon className="h-4 w-4 mr-1" />
                  Manage Performer
                </button>}
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex flex-wrap justify-between">
              <div className="w-1/2 sm:w-auto mb-2 sm:mb-0">
                <div className="text-sm text-gray-500">Member since</div>
                <div className="font-medium">{userData.memberSince}</div>
              </div>
              <div className="w-1/2 sm:w-auto mb-2 sm:mb-0">
                <div className="text-sm text-gray-500">Events attended</div>
                <div className="font-medium">{userData.eventCount}</div>
              </div>
              <div className="w-1/2 sm:w-auto">
                <div className="text-sm text-gray-500">Followers</div>
                <div className="font-medium">{userData.followersCount}</div>
              </div>
              <div className="w-1/2 sm:w-auto">
                <div className="text-sm text-gray-500">Following</div>
                <div className="font-medium">{userData.followingCount}</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 sm:px-6">
              <p className="py-4 text-gray-700">{userData.bio}</p>
            </div>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>)}
            </nav>
          </div>
          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'calendar' && <PublicCalendar userId={userData.id} />}
            {activeTab === 'performers' && <LikedPerformers userId={userData.id} />}
            {activeTab === 'venues' && <LikedVenues userId={userData.id} />}
            {activeTab === 'comments' && <UserComments userId={userData.id} />}
            {activeTab === 'shared' && <SharedCalendars userId={userData.id} />}
          </div>
        </div>
      </div>
    </div>;
};