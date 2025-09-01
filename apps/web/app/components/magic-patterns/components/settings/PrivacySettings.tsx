import React, { useState, Component } from 'react';
/**
 * Component: Privacy Settings
 * Type: CSR
 * Mockdata: ON
 * Description: Privacy preference controls
 * Components: None
 */

import { EyeIcon, UsersIcon, CalendarIcon, TagIcon, SearchIcon } from 'lucide-react';
type UserData = {
  id: string;
  profileVisibility: string;
  [key: string]: any;
};
type PrivacySettingsProps = {
  userData: UserData;
};
// Mock privacy settings
const mockPrivacySettings = {
  profileVisibility: 'public',
  calendarSharing: 'friends',
  friendRequestSettings: 'everyone',
  searchVisibility: true,
  locationSharing: 'events',
  allowDataCollection: true,
  allowPersonalizedAds: true,
  showUpcomingEvents: true,
  allowTagging: true
};
export const PrivacySettings = ({
  userData
}: PrivacySettingsProps) => {
  const [settings, setSettings] = useState(mockPrivacySettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const handleToggleChange = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof typeof settings]
    });
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message
      setSaveSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  return <div className="py-6 px-4 sm:p-6 lg:pb-8">
      <div>
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Privacy Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Control how your information is used and who can see your activity.
        </p>
      </div>
      <div className="mt-6 space-y-8">
        {/* Profile Visibility */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <EyeIcon className="h-5 w-5 mr-2 text-gray-500" />
            Profile Visibility
          </h3>
          <div className="mt-2">
            <select id="profileVisibility" name="profileVisibility" value={settings.profileVisibility} onChange={handleSelectChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="public">
                Public - Anyone can view your profile
              </option>
              <option value="friends">
                Friends Only - Only people you connect with
              </option>
              <option value="private">
                Private - Only you can see your profile
              </option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              This controls who can see your profile information and activity.
            </p>
          </div>
        </div>
        {/* Calendar Sharing */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
            Calendar Sharing
          </h3>
          <div className="mt-2">
            <select id="calendarSharing" name="calendarSharing" value={settings.calendarSharing} onChange={handleSelectChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="public">
                Public - Anyone can see your calendar
              </option>
              <option value="friends">
                Friends Only - Only friends can see your calendar
              </option>
              <option value="private">
                Private - Only you can see your calendar
              </option>
              <option value="custom">Custom - Set per-event privacy</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              This is the default sharing setting for your event calendar.
            </p>
          </div>
        </div>
        {/* Friend Request Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <UsersIcon className="h-5 w-5 mr-2 text-gray-500" />
            Friend Request Settings
          </h3>
          <div className="mt-2">
            <select id="friendRequestSettings" name="friendRequestSettings" value={settings.friendRequestSettings} onChange={handleSelectChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="everyone">
                Everyone can send you friend requests
              </option>
              <option value="friendsOfFriends">
                Friends of friends can send requests
              </option>
              <option value="none">Don't receive friend requests</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Control who can send you friend requests.
            </p>
          </div>
        </div>
        {/* Privacy Toggles */}
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Activity Privacy
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="showUpcomingEvents" name="showUpcomingEvents" type="checkbox" checked={settings.showUpcomingEvents} onChange={() => handleToggleChange('showUpcomingEvents')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="showUpcomingEvents" className="font-medium text-gray-700">
                  Show my upcoming events
                </label>
                <p className="text-gray-500">
                  Allow others to see events you're attending.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="allowTagging" name="allowTagging" type="checkbox" checked={settings.allowTagging} onChange={() => handleToggleChange('allowTagging')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="allowTagging" className="font-medium text-gray-700">
                  Allow tagging in events
                </label>
                <p className="text-gray-500">
                  Let friends tag you in events and photos.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="searchVisibility" name="searchVisibility" type="checkbox" checked={settings.searchVisibility} onChange={() => handleToggleChange('searchVisibility')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="searchVisibility" className="font-medium text-gray-700">
                  Show in search results
                </label>
                <p className="text-gray-500">
                  Allow your profile to appear in search results.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Data & Ads */}
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Data & Personalization
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="allowDataCollection" name="allowDataCollection" type="checkbox" checked={settings.allowDataCollection} onChange={() => handleToggleChange('allowDataCollection')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="allowDataCollection" className="font-medium text-gray-700">
                  Allow data collection
                </label>
                <p className="text-gray-500">
                  We collect data to improve your experience and
                  recommendations.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="allowPersonalizedAds" name="allowPersonalizedAds" type="checkbox" checked={settings.allowPersonalizedAds} onChange={() => handleToggleChange('allowPersonalizedAds')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="allowPersonalizedAds" className="font-medium text-gray-700">
                  Personalized ads
                </label>
                <p className="text-gray-500">
                  Allow us to show you more relevant advertisements.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Save Button */}
        <div className="pt-5 border-t border-gray-200">
          <div className="flex justify-end">
            <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button type="button" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
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
                  Privacy settings updated successfully!
                </p>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};