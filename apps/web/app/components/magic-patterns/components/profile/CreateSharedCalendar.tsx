import React, { useState } from 'react';
import { CalendarIcon, PlusIcon, EyeIcon, UsersIcon, LockIcon, SaveIcon, XIcon } from 'lucide-react';
type CreateSharedCalendarProps = {
  onSave: () => void;
  onCancel: () => void;
};
export const CreateSharedCalendar = ({
  onSave,
  onCancel
}: CreateSharedCalendarProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'public',
    color: 'blue'
  });
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    // In a real app, this would make an API call to create the calendar
    console.log('Creating calendar:', formData);
    onSave();
  };
  // Color options for the calendar
  const colorOptions = [{
    id: 'blue',
    name: 'Blue',
    class: 'bg-blue-500'
  }, {
    id: 'green',
    name: 'Green',
    class: 'bg-green-500'
  }, {
    id: 'purple',
    name: 'Purple',
    class: 'bg-purple-500'
  }, {
    id: 'pink',
    name: 'Pink',
    class: 'bg-pink-500'
  }, {
    id: 'orange',
    name: 'Orange',
    class: 'bg-orange-500'
  }, {
    id: 'teal',
    name: 'Teal',
    class: 'bg-teal-500'
  }, {
    id: 'red',
    name: 'Red',
    class: 'bg-red-500'
  }, {
    id: 'indigo',
    name: 'Indigo',
    class: 'bg-indigo-500'
  }];
  return <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Create New Shared Calendar
        </h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-500">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Calendar Title
          </label>
          <input type="text" name="title" id="title" required value={formData.title} onChange={handleInputChange} placeholder="e.g., Jazz Events This Month" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleInputChange} placeholder="Briefly describe what this calendar is about..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <div>
          <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
            Visibility
          </label>
          <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className={`relative border rounded-md px-4 py-3 flex items-center cursor-pointer ${formData.visibility === 'public' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`} onClick={() => setFormData({
            ...formData,
            visibility: 'public'
          })}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${formData.visibility === 'public' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                  <EyeIcon className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-900">Public</label>
                  <p className="text-gray-500">Anyone can view</p>
                </div>
              </div>
              <input type="radio" name="visibility" value="public" checked={formData.visibility === 'public'} onChange={handleInputChange} className="sr-only" />
            </div>
            <div className={`relative border rounded-md px-4 py-3 flex items-center cursor-pointer ${formData.visibility === 'followers' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`} onClick={() => setFormData({
            ...formData,
            visibility: 'followers'
          })}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${formData.visibility === 'followers' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                  <UsersIcon className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-900">Followers</label>
                  <p className="text-gray-500">Only followers</p>
                </div>
              </div>
              <input type="radio" name="visibility" value="followers" checked={formData.visibility === 'followers'} onChange={handleInputChange} className="sr-only" />
            </div>
            <div className={`relative border rounded-md px-4 py-3 flex items-center cursor-pointer ${formData.visibility === 'private' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`} onClick={() => setFormData({
            ...formData,
            visibility: 'private'
          })}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${formData.visibility === 'private' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                  <LockIcon className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-900">Private</label>
                  <p className="text-gray-500">Only you</p>
                </div>
              </div>
              <input type="radio" name="visibility" value="private" checked={formData.visibility === 'private'} onChange={handleInputChange} className="sr-only" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Calendar Color
          </label>
          <div className="mt-2 flex flex-wrap gap-3">
            {colorOptions.map(color => <div key={color.id} className="flex items-center">
                <input id={`color-${color.id}`} name="color" type="radio" value={color.id} checked={formData.color === color.id} onChange={handleInputChange} className="sr-only" />
                <label htmlFor={`color-${color.id}`} className={`relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ${formData.color === color.id ? 'ring-2 ring-indigo-500' : ''}`}>
                  <span aria-hidden="true" className={`h-8 w-8 rounded-full border border-gray-200 ${color.class}`}></span>
                </label>
              </div>)}
          </div>
        </div>
        <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancel
          </button>
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={!formData.title}>
            <SaveIcon className="h-4 w-4 mr-2" />
            Create Calendar
          </button>
        </div>
      </form>
    </div>;
};