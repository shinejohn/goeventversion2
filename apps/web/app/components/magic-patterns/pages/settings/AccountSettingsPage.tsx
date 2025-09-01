import React, { useEffect, useState, Component } from 'react';
/**
 * Page: Account Settings Hub
 * Type: CSR
 * Mockdata: OFF
 * Description: Comprehensive account management
 * Components: SettingsSidebar, ProfileInformation, AvatarUploader
 */
import { SettingsSidebar } from '../../components/settings/SettingsSidebar';
import { ProfileInformation } from '../../components/settings/ProfileInformation';
import { PasswordSecurity } from '../../components/settings/PasswordSecurity';
import { PrivacySettings } from '../../components/settings/PrivacySettings';
import { NotificationPreferences } from '../../components/settings/NotificationPreferences';
type SettingsSection = 'profile' | 'password' | 'privacy' | 'notifications' | 'connected' | 'payment' | 'subscription' | 'data' | 'close';
export const AccountSettingsPage = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // API call would go here
        await new Promise(resolve => setTimeout(resolve, 500));
        // Empty user data structure
        setUserData({
          id: '',
          name: '',
          email: '',
          avatar: '',
          bio: '',
          location: '',
          phone: '',
          socialLinks: {
            twitter: '',
            instagram: '',
            facebook: '',
            linkedin: ''
          },
          profileVisibility: 'public',
          joinDate: '',
          lastLogin: ''
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);
  // Handle section changes
  const handleSectionChange = (section: SettingsSection) => {
    setActiveSection(section);
  };
  // Render the active section content
  const renderSectionContent = () => {
    if (isLoading) {
      return <div className="py-12 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>;
    }
    if (!userData) {
      return <div className="py-12 px-4 text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Error Loading Data
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Unable to load user information. Please try again later.
          </p>
        </div>;
    }
    switch (activeSection) {
      case 'profile':
        return <ProfileInformation userData={userData} />;
      case 'password':
        return <PasswordSecurity userData={userData} />;
      case 'privacy':
        return <PrivacySettings userData={userData} />;
      case 'notifications':
        return <NotificationPreferences userData={userData} />;
      default:
        return <div className="py-12 px-4 text-center">
            <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
            <p className="mt-2 text-sm text-gray-500">
              This section is currently under development.
            </p>
          </div>;
    }
  };
  return <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-6 px-4 sm:px-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Account Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your profile, security, and preferences
            </p>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="md:grid md:grid-cols-12">
            {/* Sidebar */}
            <div className="md:col-span-3 border-r border-gray-200">
              <SettingsSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
            </div>
            {/* Main content area */}
            <div className="md:col-span-9">{renderSectionContent()}</div>
          </div>
        </div>
      </div>
    </div>;
};