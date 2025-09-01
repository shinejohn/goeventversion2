import React, { useState, Component } from 'react';
/**
 * Component: Notification Preferences
 * Type: CSR
 * Mockdata: ON
 * Description: Granular notification controls
 * Components: None
 */

import { BellIcon, MailIcon, MessageSquareIcon, PhoneIcon } from 'lucide-react';
type UserData = {
  id: string;
  email: string;
  [key: string]: any;
};
type NotificationPreferencesProps = {
  userData: UserData;
};
// Mock notification settings
const mockNotificationSettings = {
  emailNotifications: {
    eventReminders: true,
    friendRequests: true,
    messages: true,
    accountUpdates: true,
    promotions: false,
    newsletter: true
  },
  pushNotifications: {
    eventReminders: true,
    friendRequests: true,
    messages: true,
    nearbyEvents: false
  },
  smsNotifications: {
    eventReminders: false,
    securityAlerts: true
  },
  frequency: 'daily'
};
export const NotificationPreferences = ({
  userData
}: NotificationPreferencesProps) => {
  const [settings, setSettings] = useState(mockNotificationSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const handleToggleChange = (category: string, setting: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [setting]: !settings[category as keyof typeof settings][setting]
      }
    });
  };
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      frequency: e.target.value
    });
  };
  const handleUnsubscribeAll = () => {
    const confirmed = window.confirm('Are you sure you want to unsubscribe from all notifications? You can re-enable them at any time.');
    if (confirmed) {
      // Create a deep copy of settings
      const newSettings = JSON.parse(JSON.stringify(settings));
      // Disable all notification types
      Object.keys(newSettings).forEach(category => {
        if (typeof newSettings[category] === 'object') {
          Object.keys(newSettings[category]).forEach(setting => {
            newSettings[category][setting] = false;
          });
        }
      });
      setSettings(newSettings);
    }
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
      console.error('Error saving notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  return <div className="py-6 px-4 sm:p-6 lg:pb-8">
      <div>
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Notification Preferences
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage how and when you receive notifications from When's The Fun.
        </p>
      </div>
      <div className="mt-6 space-y-8">
        {/* Notification Frequency */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <BellIcon className="h-5 w-5 mr-2 text-gray-500" />
            Notification Frequency
          </h3>
          <div className="mt-2">
            <select id="frequency" name="frequency" value={settings.frequency} onChange={handleFrequencyChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="realtime">Real-time - As they happen</option>
              <option value="hourly">Hourly digest</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Choose how frequently you want to receive non-urgent
              notifications.
            </p>
          </div>
        </div>
        {/* Email Notifications */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <MailIcon className="h-5 w-5 mr-2 text-gray-500" />
            Email Notifications
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Sent to: {userData.email}
          </p>
          <div className="mt-4 space-y-4">
            {Object.entries(settings.emailNotifications).map(([key, value]) => <div key={key} className="flex items-start">
                <div className="flex items-center h-5">
                  <input id={`email-${key}`} name={`email-${key}`} type="checkbox" checked={value} onChange={() => handleToggleChange('emailNotifications', key)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`email-${key}`} className="font-medium text-gray-700">
                    {key === 'eventReminders' ? 'Event Reminders' : key === 'friendRequests' ? 'Friend Requests' : key === 'messages' ? 'Messages' : key === 'accountUpdates' ? 'Account Updates' : key === 'promotions' ? 'Promotions & Deals' : key === 'newsletter' ? 'Weekly Newsletter' : key}
                  </label>
                </div>
              </div>)}
          </div>
        </div>
        {/* Push Notifications */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <MessageSquareIcon className="h-5 w-5 mr-2 text-gray-500" />
            Push Notifications
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Sent to your browser and mobile app.
          </p>
          <div className="mt-4 space-y-4">
            {Object.entries(settings.pushNotifications).map(([key, value]) => <div key={key} className="flex items-start">
                <div className="flex items-center h-5">
                  <input id={`push-${key}`} name={`push-${key}`} type="checkbox" checked={value} onChange={() => handleToggleChange('pushNotifications', key)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`push-${key}`} className="font-medium text-gray-700">
                    {key === 'eventReminders' ? 'Event Reminders' : key === 'friendRequests' ? 'Friend Requests' : key === 'messages' ? 'Messages' : key === 'nearbyEvents' ? 'Nearby Events' : key}
                  </label>
                </div>
              </div>)}
          </div>
        </div>
        {/* SMS Notifications */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <PhoneIcon className="h-5 w-5 mr-2 text-gray-500" />
            SMS Notifications
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Standard message rates may apply.
          </p>
          <div className="mt-4 space-y-4">
            {Object.entries(settings.smsNotifications).map(([key, value]) => <div key={key} className="flex items-start">
                <div className="flex items-center h-5">
                  <input id={`sms-${key}`} name={`sms-${key}`} type="checkbox" checked={value} onChange={() => handleToggleChange('smsNotifications', key)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`sms-${key}`} className="font-medium text-gray-700">
                    {key === 'eventReminders' ? 'Event Reminders' : key === 'securityAlerts' ? 'Security Alerts' : key}
                  </label>
                </div>
              </div>)}
          </div>
        </div>
        {/* Unsubscribe All */}
        <div className="pt-5 border-t border-gray-200">
          <button type="button" onClick={handleUnsubscribeAll} className="text-sm font-medium text-red-600 hover:text-red-500">
            Unsubscribe from all notifications
          </button>
          <div className="mt-5 flex justify-end">
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
                  Notification preferences updated successfully!
                </p>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};