import React, { useState, useRef } from 'react';
import { UploadIcon, PlusIcon, TrashIcon, EyeIcon, XIcon } from 'lucide-react';
type CustomizationStepProps = {
  formData: any;
  updateFormData: (data: any) => void;
};
export const CustomizationStep = ({
  formData,
  updateFormData
}: CustomizationStepProps) => {
  const [customization, setCustomization] = useState(formData.customization || {
    bannerImage: '',
    logo: '',
    colorTheme: 'indigo',
    customCategories: [],
    welcomeMessage: '',
    memberPermissions: {
      canAddEvents: false,
      canInviteMembers: false,
      canModerateDiscussions: false,
      canEditCalendar: false
    }
  });
  const [newCategory, setNewCategory] = useState('');
  const fileInputBannerRef = useRef<HTMLInputElement>(null);
  const fileInputLogoRef = useRef<HTMLInputElement>(null);
  // Color theme options
  const colorThemes = [{
    id: 'indigo',
    name: 'Indigo',
    class: 'bg-indigo-500'
  }, {
    id: 'blue',
    name: 'Blue',
    class: 'bg-blue-500'
  }, {
    id: 'green',
    name: 'Green',
    class: 'bg-green-500'
  }, {
    id: 'red',
    name: 'Red',
    class: 'bg-red-500'
  }, {
    id: 'purple',
    name: 'Purple',
    class: 'bg-purple-500'
  }, {
    id: 'pink',
    name: 'Pink',
    class: 'bg-pink-500'
  }, {
    id: 'yellow',
    name: 'Yellow',
    class: 'bg-yellow-500'
  }, {
    id: 'orange',
    name: 'Orange',
    class: 'bg-orange-500'
  }, {
    id: 'teal',
    name: 'Teal',
    class: 'bg-teal-500'
  }, {
    id: 'cyan',
    name: 'Cyan',
    class: 'bg-cyan-500'
  }];
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload the file to a server
      // For this demo, we'll use a URL.createObjectURL as a placeholder
      const url = URL.createObjectURL(e.target.files[0]);
      setCustomization({
        ...customization,
        bannerImage: url
      });
    }
  };
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCustomization({
        ...customization,
        logo: url
      });
    }
  };
  const handleAddCategory = () => {
    if (newCategory.trim() && !customization.customCategories.includes(newCategory.trim())) {
      setCustomization({
        ...customization,
        customCategories: [...customization.customCategories, newCategory.trim()]
      });
      setNewCategory('');
    }
  };
  const handleRemoveCategory = (category: string) => {
    setCustomization({
      ...customization,
      customCategories: customization.customCategories.filter(c => c !== category)
    });
  };
  const handlePermissionChange = (permission: string, value: boolean) => {
    setCustomization({
      ...customization,
      memberPermissions: {
        ...customization.memberPermissions,
        [permission]: value
      }
    });
  };
  const handleSubmit = () => {
    updateFormData(customization);
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Customization
        </h2>
        <p className="text-sm text-gray-500">
          Personalize your calendar's appearance and configure member
          permissions.
        </p>
      </div>
      {/* Banner Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Banner Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          {customization.bannerImage ? <div className="w-full text-center">
              <div className="relative w-full h-40 mb-3 mx-auto">
                <img src={customization.bannerImage} alt="Banner preview" className="h-full w-full object-cover rounded-md" />
                <button type="button" onClick={() => setCustomization({
              ...customization,
              bannerImage: ''
            })} className="absolute top-2 right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
              <button type="button" onClick={() => fileInputBannerRef.current?.click()} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <UploadIcon className="h-4 w-4 mr-1.5" />
                Change Banner
              </button>
            </div> : <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="banner-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>Upload a banner</span>
                  <input id="banner-upload" ref={fileInputBannerRef} type="file" className="sr-only" accept="image/*" onChange={handleBannerUpload} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB (1200x400px recommended)
              </p>
            </div>}
        </div>
      </div>
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Calendar Logo
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          {customization.logo ? <div className="text-center">
              <div className="relative h-32 w-32 mb-3 mx-auto">
                <img src={customization.logo} alt="Logo preview" className="h-full w-full object-cover rounded-md" />
                <button type="button" onClick={() => setCustomization({
              ...customization,
              logo: ''
            })} className="absolute top-2 right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
              <button type="button" onClick={() => fileInputLogoRef.current?.click()} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <UploadIcon className="h-4 w-4 mr-1.5" />
                Change Logo
              </button>
            </div> : <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>Upload a logo</span>
                  <input id="logo-upload" ref={fileInputLogoRef} type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB (square image recommended)
              </p>
            </div>}
        </div>
      </div>
      {/* Color Theme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color Theme
        </label>
        <div className="mt-2 flex flex-wrap gap-3">
          {colorThemes.map(color => <div key={color.id} className="flex items-center">
              <input id={`color-${color.id}`} name="color-theme" type="radio" value={color.id} checked={customization.colorTheme === color.id} onChange={() => setCustomization({
            ...customization,
            colorTheme: color.id
          })} className="sr-only" />
              <label htmlFor={`color-${color.id}`} className={`relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ${customization.colorTheme === color.id ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}>
                <span aria-hidden="true" className={`h-8 w-8 rounded-full border border-gray-200 ${color.class}`}></span>
              </label>
              <span className="ml-2 text-sm text-gray-700">{color.name}</span>
            </div>)}
        </div>
      </div>
      {/* Custom Categories */}
      <div>
        <label htmlFor="custom-categories" className="block text-sm font-medium text-gray-700 mb-1">
          Custom Categories
        </label>
        <div className="flex items-center">
          <input type="text" id="custom-categories" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="e.g., smooth jazz, bebop" className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCategory();
          }
        }} />
          <button type="button" onClick={handleAddCategory} className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Add custom categories specific to your calendar.
        </p>
        {customization.customCategories.length > 0 && <div className="mt-3 flex flex-wrap gap-2">
            {customization.customCategories.map(category => <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {category}
                <button type="button" onClick={() => handleRemoveCategory(category)} className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none">
                  <XIcon className="h-3 w-3" />
                </button>
              </span>)}
          </div>}
      </div>
      {/* Welcome Message */}
      <div>
        <label htmlFor="welcome-message" className="block text-sm font-medium text-gray-700 mb-1">
          Welcome Message
        </label>
        <textarea id="welcome-message" rows={3} value={customization.welcomeMessage} onChange={e => setCustomization({
        ...customization,
        welcomeMessage: e.target.value
      })} placeholder="Welcome to our calendar! Here you'll find..." className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
        <p className="mt-1 text-sm text-gray-500">
          This message will be displayed to new subscribers.
        </p>
      </div>
      {/* Member Permissions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Member Permissions
        </label>
        <div className="space-y-3">
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input id="permission-add-events" type="checkbox" checked={customization.memberPermissions.canAddEvents} onChange={e => handlePermissionChange('canAddEvents', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="permission-add-events" className="font-medium text-gray-700">
                Members can add events
              </label>
              <p className="text-gray-500">
                Allow members to suggest or directly add events to the calendar.
              </p>
            </div>
          </div>
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input id="permission-invite" type="checkbox" checked={customization.memberPermissions.canInviteMembers} onChange={e => handlePermissionChange('canInviteMembers', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="permission-invite" className="font-medium text-gray-700">
                Members can invite others
              </label>
              <p className="text-gray-500">
                Allow members to invite others to join this calendar.
              </p>
            </div>
          </div>
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input id="permission-moderate" type="checkbox" checked={customization.memberPermissions.canModerateDiscussions} onChange={e => handlePermissionChange('canModerateDiscussions', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="permission-moderate" className="font-medium text-gray-700">
                Members can moderate discussions
              </label>
              <p className="text-gray-500">
                Allow members to moderate comments and discussions.
              </p>
            </div>
          </div>
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input id="permission-edit" type="checkbox" checked={customization.memberPermissions.canEditCalendar} onChange={e => handlePermissionChange('canEditCalendar', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="permission-edit" className="font-medium text-gray-700">
                Members can edit calendar settings
              </label>
              <p className="text-gray-500">
                Allow members to edit calendar details and settings.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-200 my-8"></div>
      <button type="button" onClick={handleSubmit} className="hidden">
        Save and Continue
      </button>
    </div>;
};