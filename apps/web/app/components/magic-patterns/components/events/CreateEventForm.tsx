import React, { useState } from 'react';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon,
  DollarSignIcon,
  UsersIcon,
  ImageIcon,
  TagIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
  AlertCircleIcon
} from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  address: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CreateEventFormProps {
  venues: Venue[];
  categories: Category[];
  onSubmit: (formData: any) => void;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
}

export const CreateEventForm = ({ 
  venues, 
  categories, 
  onSubmit, 
  isSubmitting = false,
  errors = {}
}: CreateEventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    venue_id: '',
    start_datetime: '',
    end_datetime: '',
    price: '',
    capacity: '',
    image_url: '',
    tags: [] as string[],
    is_recurring: false,
    recurring_type: 'none',
    max_attendees: '',
    age_restriction: '',
    requirements: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    social_media: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });
  
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('social_media.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social_media: {
          ...prev.social_media,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <TagIcon className="h-5 w-5 mr-2 text-indigo-600" />
          Basic Information
        </h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter a compelling event title"
            />
            {errors.title && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                {errors.title}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your event in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircleIcon className="h-4 w-4 mr-1" />
                  {errors.category}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="venue_id" className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <select
                id="venue_id"
                name="venue_id"
                value={formData.venue_id}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.venue_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a venue</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.address}
                  </option>
                ))}
              </select>
              {errors.venue_id && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircleIcon className="h-4 w-4 mr-1" />
                  {errors.venue_id}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
          Date & Time
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              id="start_datetime"
              name="start_datetime"
              value={formData.start_datetime}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.start_datetime ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.start_datetime && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                {errors.start_datetime}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700 mb-2">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              id="end_datetime"
              name="end_datetime"
              value={formData.end_datetime}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.end_datetime ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.end_datetime && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                {errors.end_datetime}
              </div>
            )}
          </div>
        </div>

        {/* Recurring Event */}
        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_recurring"
              name="is_recurring"
              checked={formData.is_recurring}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-900">
              This is a recurring event
            </label>
          </div>
          
          {formData.is_recurring && (
            <div className="mt-4">
              <label htmlFor="recurring_type" className="block text-sm font-medium text-gray-700 mb-2">
                Recurrence Pattern
              </label>
              <select
                id="recurring_type"
                name="recurring_type"
                value={formData.recurring_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Capacity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <DollarSignIcon className="h-5 w-5 mr-2 text-indigo-600" />
          Pricing & Capacity
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00 (leave empty for free event)"
            />
            {errors.price && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                {errors.price}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.capacity ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="100"
            />
            {errors.capacity && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                {errors.capacity}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2 text-indigo-600" />
          Media
        </h2>
        
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
            Event Image URL
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/event-image.jpg"
          />
          <p className="mt-1 text-sm text-gray-500">
            Add an image URL to make your event more attractive
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="contact@example.com"
            />
          </div>

          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              id="contact_phone"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Event...
            </>
          ) : (
            <>
              <CheckIcon className="h-4 w-4 mr-2" />
              Create Event
            </>
          )}
        </button>
      </div>
    </form>
  );
};

