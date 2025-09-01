import React, { useEffect, useState, memo } from 'react';
import { HubData } from '../../pages/hub/create';
import { InfoIcon, AlertCircleIcon } from 'lucide-react';
type SetupWizardProps = {
  hubData: HubData;
  updateHubData: (field: string, value: any) => void;
  errors: Record<string, string[]>;
};
// Mock categories and subcategories
const CATEGORIES = [{
  id: 'music',
  name: 'Music'
}, {
  id: 'arts',
  name: 'Arts & Culture'
}, {
  id: 'sports',
  name: 'Sports & Recreation'
}, {
  id: 'food',
  name: 'Food & Drink'
}, {
  id: 'technology',
  name: 'Technology'
}, {
  id: 'business',
  name: 'Business & Entrepreneurship'
}, {
  id: 'education',
  name: 'Education & Learning'
}, {
  id: 'health',
  name: 'Health & Wellness'
}, {
  id: 'lifestyle',
  name: 'Lifestyle'
}, {
  id: 'community',
  name: 'Community & Causes'
}];
const SUBCATEGORIES: Record<string, {
  id: string;
  name: string;
}[]> = {
  music: [{
    id: 'jazz',
    name: 'Jazz'
  }, {
    id: 'rock',
    name: 'Rock'
  }, {
    id: 'electronic',
    name: 'Electronic'
  }, {
    id: 'classical',
    name: 'Classical'
  }, {
    id: 'hiphop',
    name: 'Hip Hop'
  }, {
    id: 'indie',
    name: 'Indie'
  }, {
    id: 'folk',
    name: 'Folk'
  }, {
    id: 'world',
    name: 'World Music'
  }],
  arts: [{
    id: 'visual',
    name: 'Visual Arts'
  }, {
    id: 'performing',
    name: 'Performing Arts'
  }, {
    id: 'literature',
    name: 'Literature'
  }, {
    id: 'film',
    name: 'Film & Cinema'
  }, {
    id: 'photography',
    name: 'Photography'
  }, {
    id: 'crafts',
    name: 'Crafts & DIY'
  }, {
    id: 'design',
    name: 'Design'
  }],
  sports: [{
    id: 'basketball',
    name: 'Basketball'
  }, {
    id: 'football',
    name: 'Football'
  }, {
    id: 'soccer',
    name: 'Soccer'
  }, {
    id: 'baseball',
    name: 'Baseball'
  }, {
    id: 'running',
    name: 'Running'
  }, {
    id: 'cycling',
    name: 'Cycling'
  }, {
    id: 'yoga',
    name: 'Yoga'
  }, {
    id: 'fitness',
    name: 'Fitness'
  }]
  // Add more subcategories for other categories as needed
};
export const SetupWizard: React.FC<SetupWizardProps> = ({
  hubData,
  updateHubData,
  errors
}) => {
  const [availableSubcategories, setAvailableSubcategories] = useState<{
    id: string;
    name: string;
  }[]>([]);
  const [slugPreview, setSlugPreview] = useState('');
  // Update available subcategories when category changes
  useEffect(() => {
    if (hubData.category && SUBCATEGORIES[hubData.category]) {
      setAvailableSubcategories(SUBCATEGORIES[hubData.category]);
    } else {
      setAvailableSubcategories([]);
    }
  }, [hubData.category]);
  // Generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };
  // Handle name change and auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    updateHubData('name', name);
    const generatedSlug = generateSlug(name);
    setSlugPreview(generatedSlug);
  };
  // Handle slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.replace(/[^a-z0-9-]/g, '');
    updateHubData('slug', slug);
  };
  // Apply generated slug
  const applyGeneratedSlug = () => {
    updateHubData('slug', slugPreview);
  };
  // Handle subcategory selection
  const handleSubcategoryChange = (subcategoryId: string) => {
    const currentSubcategories = [...hubData.subcategories];
    if (currentSubcategories.includes(subcategoryId)) {
      updateHubData('subcategories', currentSubcategories.filter(id => id !== subcategoryId));
    } else {
      updateHubData('subcategories', [...currentSubcategories, subcategoryId]);
    }
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Hub Setup</h2>
      {/* Hub Name */}
      <div className="mb-6">
        <label htmlFor="hub-name" className="block text-sm font-medium text-gray-700 mb-1">
          Hub Name*
        </label>
        <input id="hub-name" type="text" value={hubData.name} onChange={handleNameChange} placeholder="e.g., Jazz Lovers Community" className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
        {errors.name && <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircleIcon className="h-4 w-4 mr-1" />
            {errors.name[0]}
          </p>}
        <p className="mt-1 text-xs text-gray-500">
          Choose a clear, descriptive name for your hub that reflects its
          purpose.
        </p>
      </div>
      {/* URL Slug */}
      <div className="mb-6">
        <label htmlFor="hub-slug" className="block text-sm font-medium text-gray-700 mb-1">
          URL Slug*
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            hub/
          </span>
          <input id="hub-slug" type="text" value={hubData.slug} onChange={handleSlugChange} placeholder="jazz-lovers-community" className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none ${errors.slug ? 'border-red-300' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 border`} />
          {slugPreview && hubData.slug !== slugPreview && <button type="button" onClick={applyGeneratedSlug} className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 text-sm hover:bg-gray-100">
              Apply
            </button>}
          {!slugPreview && <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              .com
            </span>}
        </div>
        {errors.slug && <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircleIcon className="h-4 w-4 mr-1" />
            {errors.slug[0]}
          </p>}
        <p className="mt-1 text-xs text-gray-500">
          This will be the URL of your hub. Only lowercase letters, numbers, and
          hyphens are allowed.
        </p>
      </div>
      {/* Category */}
      <div className="mb-6">
        <label htmlFor="hub-category" className="block text-sm font-medium text-gray-700 mb-1">
          Category*
        </label>
        <select id="hub-category" value={hubData.category} onChange={e => updateHubData('category', e.target.value)} className={`w-full px-3 py-2 border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}>
          <option value="">Select a category</option>
          {CATEGORIES.map(category => <option key={category.id} value={category.id}>
              {category.name}
            </option>)}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircleIcon className="h-4 w-4 mr-1" />
            {errors.category[0]}
          </p>}
        <p className="mt-1 text-xs text-gray-500">
          Choose the main category that best describes your hub.
        </p>
      </div>
      {/* Subcategories */}
      {hubData.category && availableSubcategories.length > 0 && <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategories (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableSubcategories.map(subcategory => <div key={subcategory.id} className="flex items-center">
                <input id={`subcategory-${subcategory.id}`} type="checkbox" checked={hubData.subcategories.includes(subcategory.id)} onChange={() => handleSubcategoryChange(subcategory.id)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor={`subcategory-${subcategory.id}`} className="ml-2 block text-sm text-gray-700">
                  {subcategory.name}
                </label>
              </div>)}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Select up to 5 subcategories to help people find your hub.
          </p>
        </div>}
      {/* Mission Statement */}
      <div className="mb-6">
        <label htmlFor="mission" className="block text-sm font-medium text-gray-700 mb-1">
          Mission Statement
        </label>
        <textarea id="mission" value={hubData.mission} onChange={e => updateHubData('mission', e.target.value)} rows={3} placeholder="Describe the purpose and mission of your hub" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        <p className="mt-1 text-xs text-gray-500">
          Clearly explain what your hub is about and what members can expect.
        </p>
      </div>
      {/* Target Audience */}
      <div className="mb-6">
        <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
          Target Audience
        </label>
        <input id="audience" type="text" value={hubData.audience} onChange={e => updateHubData('audience', e.target.value)} placeholder="e.g., Jazz musicians, enthusiasts, and venue owners" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        <p className="mt-1 text-xs text-gray-500">
          Describe who would benefit most from joining your hub.
        </p>
      </div>
      {/* Geographic Scope */}
      <div className="mb-6">
        <label htmlFor="geographic-scope" className="block text-sm font-medium text-gray-700 mb-1">
          Geographic Scope
        </label>
        <select id="geographic-scope" value={hubData.geographicScope} onChange={e => updateHubData('geographicScope', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option value="">Select geographic scope</option>
          <option value="local">Local (city/town)</option>
          <option value="regional">Regional (state/province)</option>
          <option value="national">National</option>
          <option value="global">Global</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Define the geographic reach of your hub.
        </p>
      </div>
      {/* Tips and Help */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <InfoIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Tips for a Successful Hub
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Be specific about your hub's purpose to attract the right
                  members
                </li>
                <li>
                  Choose a memorable name that clearly communicates what your
                  hub is about
                </li>
                <li>
                  Set clear expectations about the type of content and
                  discussions
                </li>
                <li>
                  Consider your geographic focus to better serve your community
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>;
};