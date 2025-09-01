import React, { useState } from 'react';
import { XIcon, PlusIcon } from 'lucide-react';
type BasicInfoStepProps = {
  formData: any;
  updateFormData: (data: any) => void;
};
export const BasicInfoStep = ({
  formData,
  updateFormData
}: BasicInfoStepProps) => {
  const [name, setName] = useState(formData.name || '');
  const [category, setCategory] = useState(formData.category || '');
  const [description, setDescription] = useState(formData.description || '');
  const [tags, setTags] = useState<string[]>(formData.tags || []);
  const [newTag, setNewTag] = useState('');
  const [geographicScope, setGeographicScope] = useState(formData.geographicScope || 'local');
  const [visibility, setVisibility] = useState(formData.visibility || 'public');
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  const handleSubmit = () => {
    updateFormData({
      name,
      category,
      description,
      tags,
      geographicScope,
      visibility
    });
  };
  // Available categories
  const categories = [{
    id: 'music',
    name: 'Music'
  }, {
    id: 'arts',
    name: 'Arts & Culture'
  }, {
    id: 'food',
    name: 'Food & Drink'
  }, {
    id: 'sports',
    name: 'Sports & Fitness'
  }, {
    id: 'nightlife',
    name: 'Nightlife'
  }, {
    id: 'family',
    name: 'Family & Kids'
  }, {
    id: 'education',
    name: 'Education & Learning'
  }, {
    id: 'business',
    name: 'Business & Networking'
  }, {
    id: 'community',
    name: 'Community & Causes'
  }, {
    id: 'tech',
    name: 'Technology'
  }, {
    id: 'health',
    name: 'Health & Wellness'
  }, {
    id: 'other',
    name: 'Other'
  }];
  return <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Basic Information
        </h2>
        <p className="text-sm text-gray-500">
          Provide the essential details about your calendar to help people
          discover and understand it.
        </p>
      </div>
      {/* Calendar Name */}
      <div>
        <label htmlFor="calendar-name" className="block text-sm font-medium text-gray-700 mb-1">
          Calendar Name*
        </label>
        <input type="text" id="calendar-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Downtown Jazz Nights" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
      </div>
      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Primary Category*
        </label>
        <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
          <option value="">Select a category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>)}
        </select>
      </div>
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description*
        </label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe what makes your calendar special and what kind of events people can expect to find..." className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required></textarea>
        <p className="mt-1 text-sm text-gray-500">
          {description.length}/500 characters
        </p>
      </div>
      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Target Audience Tags
        </label>
        <div className="flex items-center">
          <input type="text" id="tags" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., jazz, live music, downtown" className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          <button type="button" onClick={handleAddTag} className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Press Enter to add a tag. Add up to 10 tags.
        </p>
        {tags.length > 0 && <div className="mt-3 flex flex-wrap gap-2">
            {tags.map(tag => <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none">
                  <XIcon className="h-3 w-3" />
                </button>
              </span>)}
          </div>}
      </div>
      {/* Geographic Scope */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Geographic Scope
        </label>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[{
          id: 'local',
          label: 'Local (City/Town)'
        }, {
          id: 'regional',
          label: 'Regional (State/Province)'
        }, {
          id: 'national',
          label: 'National'
        }, {
          id: 'international',
          label: 'International'
        }, {
          id: 'virtual',
          label: 'Virtual/Online'
        }, {
          id: 'hybrid',
          label: 'Hybrid (In-person & Virtual)'
        }].map(scope => <div key={scope.id} className={`border rounded-md px-4 py-3 flex items-center cursor-pointer ${geographicScope === scope.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`} onClick={() => setGeographicScope(scope.id)}>
              <input type="radio" id={`scope-${scope.id}`} name="geographic-scope" value={scope.id} checked={geographicScope === scope.id} onChange={() => setGeographicScope(scope.id)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
              <label htmlFor={`scope-${scope.id}`} className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                {scope.label}
              </label>
            </div>)}
        </div>
      </div>
      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Calendar Visibility
        </label>
        <div className="mt-2 space-y-4">
          <div className={`relative border rounded-md px-4 py-3 flex items-center cursor-pointer ${visibility === 'public' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`} onClick={() => setVisibility('public')}>
            <input type="radio" id="visibility-public" name="visibility" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
            <label htmlFor="visibility-public" className="ml-3 flex flex-col cursor-pointer">
              <span className="block text-sm font-medium text-gray-900">
                Public
              </span>
              <span className="block text-sm text-gray-500">
                Anyone can view this calendar and its events
              </span>
            </label>
          </div>
          <div className={`relative border rounded-md px-4 py-3 flex items-center cursor-pointer ${visibility === 'private' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`} onClick={() => setVisibility('private')}>
            <input type="radio" id="visibility-private" name="visibility" value="private" checked={visibility === 'private'} onChange={() => setVisibility('private')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
            <label htmlFor="visibility-private" className="ml-3 flex flex-col cursor-pointer">
              <span className="block text-sm font-medium text-gray-900">
                Private
              </span>
              <span className="block text-sm text-gray-500">
                Only you and people you invite can view this calendar
              </span>
            </label>
          </div>
          <div className={`relative border rounded-md px-4 py-3 flex items-center cursor-pointer ${visibility === 'paid' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`} onClick={() => setVisibility('paid')}>
            <input type="radio" id="visibility-paid" name="visibility" value="paid" checked={visibility === 'paid'} onChange={() => setVisibility('paid')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
            <label htmlFor="visibility-paid" className="ml-3 flex flex-col cursor-pointer">
              <span className="block text-sm font-medium text-gray-900">
                Paid Subscription
              </span>
              <span className="block text-sm text-gray-500">
                Users must pay a subscription fee to access this calendar
              </span>
            </label>
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-200 my-8"></div>
      <button type="button" onClick={handleSubmit} className="hidden">
        Save and Continue
      </button>
    </div>;
};