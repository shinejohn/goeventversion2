import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { UserIcon, CalendarIcon, MusicIcon, BuildingIcon, LockIcon, BellIcon, ShareIcon, PlusIcon, SaveIcon, XIcon, EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { CreateSharedCalendar } from '../../components/profile/CreateSharedCalendar';
// Mock user data
const userData = {
  id: 'user-123',
  name: 'Alex Johnson',
  username: 'alexjohnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  bio: 'Event enthusiast and community organizer. Love discovering new local happenings!',
  location: 'Clearwater, FL',
  phone: '+1 (555) 123-4567',
  socialLinks: {
    twitter: 'alexjohnson',
    instagram: 'alex.johnson',
    facebook: '',
    linkedin: 'alexjohnson'
  },
  calendarVisibility: 'public',
  commentsVisibility: 'followers',
  likedPerformersVisibility: 'public',
  likedVenuesVisibility: 'public',
  sharedCalendars: [{
    id: 'cal-1',
    title: 'Jazz Events This Month',
    description: 'The best jazz performances happening around Clearwater',
    visibility: 'public',
    eventCount: 12
  }, {
    id: 'cal-2',
    title: 'Weekly Yoga Classes',
    description: 'My favorite yoga sessions in the area',
    visibility: 'followers',
    eventCount: 8
  }, {
    id: 'cal-3',
    title: 'Food Truck Fridays',
    description: 'Tracking all the food truck events on Fridays',
    visibility: 'private',
    eventCount: 4
  }]
};
export const UserProfileSettingsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    name: userData.name,
    username: userData.username,
    email: userData.email,
    bio: userData.bio,
    location: userData.location,
    phone: userData.phone,
    socialLinks: {
      ...userData.socialLinks
    },
    calendarVisibility: userData.calendarVisibility,
    commentsVisibility: userData.commentsVisibility,
    likedPerformersVisibility: userData.likedPerformersVisibility,
    likedVenuesVisibility: userData.likedVenuesVisibility
  });
  const [isCreatingCalendar, setIsCreatingCalendar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    if (name.startsWith('social-')) {
      const platform = name.replace('social-', '');
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [platform]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };
  const handleDeleteSharedCalendar = calendarId => {
    // In a real app, this would make an API call
    console.log(`Deleting calendar ${calendarId}`);
  };
  const sections = [{
    id: 'profile',
    label: 'Profile Information',
    icon: <UserIcon className="h-5 w-5" />
  }, {
    id: 'privacy',
    label: 'Privacy Settings',
    icon: <LockIcon className="h-5 w-5" />
  }, {
    id: 'calendar',
    label: 'Calendar Settings',
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
    id: 'shared',
    label: 'Shared Calendars',
    icon: <ShareIcon className="h-5 w-5" />
  }];
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Profile Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your profile, privacy, and content preferences
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button onClick={() => navigate(`/profile/${userData.username}`)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <EyeIcon className="h-4 w-4 mr-2" />
              View Public Profile
            </button>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="md:grid md:grid-cols-12">
            {/* Sidebar */}
            <div className="md:col-span-3 border-r border-gray-200">
              <nav className="py-4 h-full">
                <div className="px-4 mb-4 md:hidden">
                  <select className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={activeSection} onChange={e => setActiveSection(e.target.value)}>
                    {sections.map(section => <option key={section.id} value={section.id}>
                        {section.label}
                      </option>)}
                  </select>
                </div>
                <div className="hidden md:block">
                  <ul className="space-y-1">
                    {sections.map(section => <li key={section.id}>
                        <button onClick={() => setActiveSection(section.id)} className={`w-full flex items-center px-4 py-2 text-sm font-medium ${activeSection === section.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                          <span className={`mr-3 ${activeSection === section.id ? 'text-indigo-500' : 'text-gray-500'}`}>
                            {section.icon}
                          </span>
                          {section.label}
                        </button>
                      </li>)}
                  </ul>
                </div>
              </nav>
            </div>
            {/* Main content area */}
            <div className="md:col-span-9">
              {/* Profile Information */}
              {activeSection === 'profile' && <div className="py-6 px-4 sm:p-6">
                  <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                      Profile Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Update your personal information and how others see you on
                      the platform.
                    </p>
                  </div>
                  <form className="mt-6 space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col sm:flex-row">
                      <div className="mb-4 sm:mb-0 sm:w-1/3">
                        <h3 className="text-sm font-medium text-gray-900">
                          Profile Photo
                        </h3>
                        <p className="text-sm text-gray-500">
                          This will be displayed on your profile and in
                          comments.
                        </p>
                      </div>
                      <div className="sm:w-2/3">
                        <div className="flex items-center">
                          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                            <img src={userData.avatar} alt="User avatar" className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-5">
                            <button type="button" className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              Change
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    {/* Basic Information */}
                    <div className="flex flex-col sm:flex-row">
                      <div className="mb-4 sm:mb-0 sm:w-1/3">
                        <h3 className="text-sm font-medium text-gray-900">
                          Basic Information
                        </h3>
                        <p className="text-sm text-gray-500">
                          Your public profile information.
                        </p>
                      </div>
                      <div className="sm:w-2/3 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Display Name
                          </label>
                          <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              @
                            </span>
                            <input type="text" name="username" id="username" value={formData.username} onChange={handleInputChange} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio
                          </label>
                          <textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Tell others about yourself..."></textarea>
                          <p className="mt-1 text-xs text-gray-500">
                            Brief description for your profile. Maximum 200
                            characters.
                          </p>
                        </div>
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    {/* Social Links */}
                    <div className="flex flex-col sm:flex-row">
                      <div className="mb-4 sm:mb-0 sm:w-1/3">
                        <h3 className="text-sm font-medium text-gray-900">
                          Social Media Links
                        </h3>
                        <p className="text-sm text-gray-500">
                          Connect your social profiles to your account.
                        </p>
                      </div>
                      <div className="sm:w-2/3 space-y-4">
                        <div>
                          <label htmlFor="social-twitter" className="block text-sm font-medium text-gray-700">
                            Twitter
                          </label>
                          <input type="text" name="social-twitter" id="social-twitter" value={formData.socialLinks.twitter} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="username" />
                        </div>
                        <div>
                          <label htmlFor="social-instagram" className="block text-sm font-medium text-gray-700">
                            Instagram
                          </label>
                          <input type="text" name="social-instagram" id="social-instagram" value={formData.socialLinks.instagram} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="username" />
                        </div>
                        <div>
                          <label htmlFor="social-facebook" className="block text-sm font-medium text-gray-700">
                            Facebook
                          </label>
                          <input type="text" name="social-facebook" id="social-facebook" value={formData.socialLinks.facebook} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="username or profile URL" />
                        </div>
                        <div>
                          <label htmlFor="social-linkedin" className="block text-sm font-medium text-gray-700">
                            LinkedIn
                          </label>
                          <input type="text" name="social-linkedin" id="social-linkedin" value={formData.socialLinks.linkedin} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="username" />
                        </div>
                      </div>
                    </div>
                    {/* Save Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button type="button" onClick={handleSaveProfile} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <SaveIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>}
              {/* Privacy Settings */}
              {activeSection === 'privacy' && <div className="py-6 px-4 sm:p-6">
                  <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                      Privacy Settings
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Control who can see your profile information and activity.
                    </p>
                  </div>
                  <div className="mt-6 space-y-6">
                    <div className="flex flex-col sm:flex-row">
                      <div className="mb-4 sm:mb-0 sm:w-1/3">
                        <h3 className="text-sm font-medium text-gray-900">
                          Content Visibility
                        </h3>
                        <p className="text-sm text-gray-500">
                          Control who can see different parts of your profile.
                        </p>
                      </div>
                      <div className="sm:w-2/3 space-y-4">
                        <div>
                          <label htmlFor="calendarVisibility" className="block text-sm font-medium text-gray-700">
                            Calendar Visibility
                          </label>
                          <select id="calendarVisibility" name="calendarVisibility" value={formData.calendarVisibility} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="public">
                              Public - Anyone can view
                            </option>
                            <option value="followers">Followers Only</option>
                            <option value="private">Private - Only you</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="commentsVisibility" className="block text-sm font-medium text-gray-700">
                            Comments Visibility
                          </label>
                          <select id="commentsVisibility" name="commentsVisibility" value={formData.commentsVisibility} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="public">
                              Public - Anyone can view
                            </option>
                            <option value="followers">Followers Only</option>
                            <option value="private">Private - Only you</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="likedPerformersVisibility" className="block text-sm font-medium text-gray-700">
                            Liked Performers Visibility
                          </label>
                          <select id="likedPerformersVisibility" name="likedPerformersVisibility" value={formData.likedPerformersVisibility} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="public">
                              Public - Anyone can view
                            </option>
                            <option value="followers">Followers Only</option>
                            <option value="private">Private - Only you</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="likedVenuesVisibility" className="block text-sm font-medium text-gray-700">
                            Liked Venues Visibility
                          </label>
                          <select id="likedVenuesVisibility" name="likedVenuesVisibility" value={formData.likedVenuesVisibility} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="public">
                              Public - Anyone can view
                            </option>
                            <option value="followers">Followers Only</option>
                            <option value="private">Private - Only you</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex flex-col sm:flex-row">
                      <div className="mb-4 sm:mb-0 sm:w-1/3">
                        <h3 className="text-sm font-medium text-gray-900">
                          Profile Discoverability
                        </h3>
                        <p className="text-sm text-gray-500">
                          Control how others can find you on the platform.
                        </p>
                      </div>
                      <div className="sm:w-2/3 space-y-4">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input id="allowSearch" name="allowSearch" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="allowSearch" className="font-medium text-gray-700">
                              Allow search engines to index my profile
                            </label>
                            <p className="text-gray-500">
                              Your profile can appear in search engine results.
                            </p>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input id="allowRecommendations" name="allowRecommendations" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="allowRecommendations" className="font-medium text-gray-700">
                              Show me in recommendations
                            </label>
                            <p className="text-gray-500">
                              Your profile can be recommended to others with
                              similar interests.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Save Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button type="button" onClick={handleSaveProfile} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <SaveIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>}
              {/* Calendar Settings */}
              {activeSection === 'calendar' && <div className="py-6 px-4 sm:p-6">
                  <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                      Calendar Settings
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your calendar preferences and defaults.
                    </p>
                  </div>
                  <div className="mt-6 space-y-6">
                    <div className="flex flex-col sm:flex-row">
                      <div className="mb-4 sm:mb-0 sm:w-1/3">
                        <h3 className="text-sm font-medium text-gray-900">
                          Default View
                        </h3>
                        <p className="text-sm text-gray-500">
                          Choose how your calendar is displayed by default.
                        </p>
                      </div>
                      <div className="sm:w-2/3">
                        <select id="defaultView" name="defaultView" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="month">
                          <option value="month">Month</option>
                          <option value="week">Week</option>
                          <option value="day">Day</option>
                          <option value="list">List</option>
                        </select>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex flex-col sm:flex-row">
                      <div className="mb-4 sm:mb-0 sm:w-1/3">
                        <h3 className="text-sm font-medium text-gray-900">
                          Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Choose when to receive calendar notifications.
                        </p>
                      </div>
                      <div className="sm:w-2/3 space-y-4">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input id="notifyEventStart" name="notifyEventStart" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="notifyEventStart" className="font-medium text-gray-700">
                              Event start notifications
                            </label>
                            <p className="text-gray-500">
                              Receive notifications when your events are about
                              to start.
                            </p>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input id="notifyDayBefore" name="notifyDayBefore" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="notifyDayBefore" className="font-medium text-gray-700">
                              Day-before reminders
                            </label>
                            <p className="text-gray-500">
                              Receive notifications one day before your events.
                            </p>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input id="notifyWeeklyDigest" name="notifyWeeklyDigest" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="notifyWeeklyDigest" className="font-medium text-gray-700">
                              Weekly digest
                            </label>
                            <p className="text-gray-500">
                              Receive a weekly summary of your upcoming events.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="flex flex-col sm:flex-row">
                      <div className="mb-4 sm:mb-0 sm:w-1/3">
                        <h3 className="text-sm font-medium text-gray-900">
                          Sync Options
                        </h3>
                        <p className="text-sm text-gray-500">
                          Connect with external calendars.
                        </p>
                      </div>
                      <div className="sm:w-2/3 space-y-4">
                        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Google Calendar
                            </h4>
                            <p className="text-sm text-gray-500">
                              Not connected
                            </p>
                          </div>
                          <button type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Connect
                          </button>
                        </div>
                        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Apple Calendar
                            </h4>
                            <p className="text-sm text-gray-500">
                              Not connected
                            </p>
                          </div>
                          <button type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Connect
                          </button>
                        </div>
                        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Microsoft Outlook
                            </h4>
                            <p className="text-sm text-gray-500">
                              Not connected
                            </p>
                          </div>
                          <button type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Save Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button type="button" onClick={handleSaveProfile} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <SaveIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>}
              {/* Liked Performers */}
              {activeSection === 'performers' && <div className="py-6 px-4 sm:p-6">
                  <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                      Liked Performers
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your favorite performers and bands.
                    </p>
                  </div>
                  <div className="mt-6">
                    {/* Performer management would go here */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <MusicIcon className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Your liked performers are displayed on your public
                            profile according to your privacy settings.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* This would be a list of performers with management controls */}
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Performer
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Genre
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Upcoming Events
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {[{
                        id: 1,
                        name: 'The Sunset Vibes',
                        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
                        genre: 'Indie Rock',
                        events: 3
                      }, {
                        id: 2,
                        name: 'DJ Coastal',
                        image: 'https://images.unsplash.com/photo-1571266028253-6c7f8eb1d870?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
                        genre: 'House / Electronic',
                        events: 5
                      }, {
                        id: 3,
                        name: 'Sarah Johnson',
                        image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
                        genre: 'Folk / Acoustic',
                        events: 1
                      }, {
                        id: 4,
                        name: 'Comedy Crew',
                        image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
                        genre: 'Comedy',
                        events: 2
                      }].map(performer => <tr key={performer.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img className="h-10 w-10 rounded-full object-cover" src={performer.image} alt="" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-gray-900">
                                      {performer.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {performer.genre}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {performer.events}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                  View
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  Unlike
                                </button>
                              </td>
                            </tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>}
              {/* Liked Venues */}
              {activeSection === 'venues' && <div className="py-6 px-4 sm:p-6">
                  <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                      Liked Venues
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your favorite venues and locations.
                    </p>
                  </div>
                  <div className="mt-6">
                    {/* Venue management would go here */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <BuildingIcon className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Your liked venues are displayed on your public
                            profile according to your privacy settings.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* This would be a list of venues with management controls */}
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Venue
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Location
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Upcoming Events
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {[{
                        id: 1,
                        name: 'Capitol Theatre',
                        image: 'https://images.unsplash.com/photo-1518079304793-f5ea5f8a41be?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
                        location: 'Clearwater, FL',
                        events: 8
                      }, {
                        id: 2,
                        name: 'The District Lounge',
                        image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
                        location: 'Clearwater, FL',
                        events: 12
                      }, {
                        id: 3,
                        name: 'Coachman Park',
                        image: 'https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
                        location: 'Clearwater, FL',
                        events: 5
                      }, {
                        id: 4,
                        name: 'Ruth Eckerd Hall',
                        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
                        location: 'Clearwater, FL',
                        events: 15
                      }].map(venue => <tr key={venue.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img className="h-10 w-10 rounded object-cover" src={venue.image} alt="" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-gray-900">
                                      {venue.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {venue.location}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {venue.events}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                  View
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  Unlike
                                </button>
                              </td>
                            </tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>}
              {/* Shared Calendars */}
              {activeSection === 'shared' && <div className="py-6 px-4 sm:p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg leading-6 font-medium text-gray-900">
                        Shared Calendars
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Create and manage calendars you share with others.
                      </p>
                    </div>
                    <button type="button" onClick={() => setIsCreatingCalendar(true)} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Create Calendar
                    </button>
                  </div>
                  {isCreatingCalendar ? <div className="mt-6">
                      <CreateSharedCalendar onSave={() => {
                  setIsCreatingCalendar(false);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }} onCancel={() => setIsCreatingCalendar(false)} />
                    </div> : <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {userData.sharedCalendars.map(calendar => <div key={calendar.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {calendar.title}
                              </h3>
                              <div className="flex space-x-2">
                                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500" title="Edit calendar">
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button className="p-1 rounded-full text-gray-400 hover:text-red-500" title="Delete calendar" onClick={() => handleDeleteSharedCalendar(calendar.id)}>
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {calendar.description}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">
                                  {calendar.eventCount} events
                                </span>
                              </div>
                              <div className="flex items-center">
                                <EyeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500 capitalize">
                                  {calendar.visibility}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-4 sm:px-6">
                            <div className="flex justify-between items-center">
                              <button type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                View Events
                              </button>
                              <button type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <ShareIcon className="h-4 w-4 mr-1" />
                                Share
                              </button>
                            </div>
                          </div>
                        </div>)}
                    </div>}
                </div>}
            </div>
          </div>
        </div>
      </div>
      {/* Success Message */}
      {saveSuccess && <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Changes saved successfully!
              </p>
            </div>
          </div>
        </div>}
    </div>;
};