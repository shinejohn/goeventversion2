import React, { useState, Component } from 'react';
/**
 * Component: Profile Information
 * Type: CSR
 * Mockdata: ON
 * Description: User profile information form
 * Components: AvatarUploader
 */

import { AvatarUploader } from './AvatarUploader';
import { GlobeIcon, InstagramIcon, TwitterIcon, FacebookIcon, LinkedinIcon } from 'lucide-react';
type SocialLinks = {
  twitter: string;
  instagram: string;
  facebook: string;
  linkedin: string;
};
type UserData = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  phone: string;
  socialLinks: SocialLinks;
  profileVisibility: string;
  joinDate: string;
  lastLogin: string;
};
type ProfileInformationProps = {
  userData: UserData;
};
export const ProfileInformation = ({
  userData
}: ProfileInformationProps) => {
  const [formData, setFormData] = useState({
    name: userData.name,
    bio: userData.bio,
    location: userData.location,
    phone: userData.phone,
    socialLinks: {
      ...userData.socialLinks
    },
    profileVisibility: userData.profileVisibility
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    if (name.startsWith('social-')) {
      const socialPlatform = name.replace('social-', '');
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialPlatform]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };
  return <div className="py-6 px-4 sm:p-6 lg:pb-8">
      <div>
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Profile Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your personal information and how others see you on the
          platform.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row">
          <div className="mb-4 sm:mb-0 sm:w-1/3">
            <h3 className="text-sm font-medium text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-500">
              This will be displayed on your profile and in comments.
            </p>
          </div>
          <div className="sm:w-2/3">
            <AvatarUploader currentAvatar={userData.avatar} />
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input type="email" name="email" id="email" value={userData.email} disabled className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm" />
              <p className="mt-1 text-xs text-gray-500">
                To change your email, please go to Password & Security section.
              </p>
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio / About Me
              </label>
              <textarea name="bio" id="bio" rows={4} value={formData.bio} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Tell others a bit about yourself..." />
              <p className="mt-1 text-xs text-gray-500">
                Brief description for your profile. Maximum 200 characters.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GlobeIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
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
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="social-twitter" className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TwitterIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" name="social-twitter" id="social-twitter" value={formData.socialLinks.twitter} onChange={handleInputChange} className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="username" />
                </div>
              </div>
              <div>
                <label htmlFor="social-instagram" className="block text-sm font-medium text-gray-700">
                  Instagram
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <InstagramIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" name="social-instagram" id="social-instagram" value={formData.socialLinks.instagram} onChange={handleInputChange} className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="username" />
                </div>
              </div>
              <div>
                <label htmlFor="social-facebook" className="block text-sm font-medium text-gray-700">
                  Facebook
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FacebookIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" name="social-facebook" id="social-facebook" value={formData.socialLinks.facebook} onChange={handleInputChange} className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="username or profile URL" />
                </div>
              </div>
              <div>
                <label htmlFor="social-linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkedinIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" name="social-linkedin" id="social-linkedin" value={formData.socialLinks.linkedin} onChange={handleInputChange} className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="username" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-px bg-gray-200"></div>
        {/* Privacy Settings */}
        <div className="flex flex-col sm:flex-row">
          <div className="mb-4 sm:mb-0 sm:w-1/3">
            <h3 className="text-sm font-medium text-gray-900">
              Profile Visibility
            </h3>
            <p className="text-sm text-gray-500">
              Control who can see your profile information.
            </p>
          </div>
          <div className="sm:w-2/3">
            <select id="profileVisibility" name="profileVisibility" value={formData.profileVisibility} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
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
            <div className="mt-4">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input id="showUpcomingEvents" name="showUpcomingEvents" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
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
              <div className="relative flex items-start mt-3">
                <div className="flex items-center h-5">
                  <input id="allowTagging" name="allowTagging" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
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
            </div>
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
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
                  Profile updated successfully!
                </p>
              </div>
            </div>
          </div>}
      </form>
    </div>;
};