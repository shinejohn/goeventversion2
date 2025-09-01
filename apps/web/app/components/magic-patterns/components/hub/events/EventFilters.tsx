import React from 'react';
import { CalendarIcon, TagIcon, MapPinIcon, DollarSignIcon, ThumbsUpIcon, XIcon } from 'lucide-react';
type EventFiltersProps = {
  hubData: any;
  filters: {
    date: Date | null;
    subcategory: string[];
    location: string;
    price: string | null;
    memberRecommended: boolean;
    searchQuery: string;
  };
  onFilterChange: (filterType: string, value: any) => void;
  onClearFilters: () => void;
};
export const EventFilters = ({
  hubData,
  filters,
  onFilterChange,
  onClearFilters
}: EventFiltersProps) => {
  const handleSubcategoryToggle = (subcategory: string) => {
    if (filters.subcategory.includes(subcategory)) {
      onFilterChange('subcategory', filters.subcategory.filter(sc => sc !== subcategory));
    } else {
      onFilterChange('subcategory', [...filters.subcategory, subcategory]);
    }
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
              Date
            </div>
          </label>
          <input type="date" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={filters.date ? new Date(filters.date).toISOString().split('T')[0] : ''} onChange={e => onFilterChange('date', e.target.value ? new Date(e.target.value) : null)} />
        </div>
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
              Location
            </div>
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={filters.location} onChange={e => onFilterChange('location', e.target.value)}>
            <option value="">All Locations</option>
            {hubData.locations.map((location: string) => <option key={location} value={location}>
                {location}
              </option>)}
          </select>
        </div>
        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <DollarSignIcon className="h-4 w-4 mr-1 text-gray-500" />
              Price
            </div>
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={filters.price || ''} onChange={e => onFilterChange('price', e.target.value || null)}>
            <option value="">Any Price</option>
            <option value="free">Free</option>
            <option value="under25">Under $25</option>
            <option value="under50">Under $50</option>
            <option value="paid">Paid Events</option>
          </select>
        </div>
        {/* Member Recommended Filter */}
        <div className="flex items-end">
          <label className="inline-flex items-center">
            <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-5 w-5" checked={filters.memberRecommended} onChange={e => onFilterChange('memberRecommended', e.target.checked)} />
            <span className="ml-2 text-sm text-gray-700 flex items-center">
              <ThumbsUpIcon className="h-4 w-4 mr-1 text-gray-500" />
              Member Recommended
            </span>
          </label>
        </div>
      </div>
      {/* Subcategory Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <TagIcon className="h-4 w-4 mr-1 text-gray-500" />
            Subcategories
          </div>
        </label>
        <div className="flex flex-wrap gap-2">
          {hubData.subcategories.map((subcategory: string) => <button key={subcategory} onClick={() => handleSubcategoryToggle(subcategory)} className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${filters.subcategory.includes(subcategory) ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}>
              {subcategory}
              {filters.subcategory.includes(subcategory) && <XIcon className="ml-1 h-3 w-3" />}
            </button>)}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button type="button" onClick={onClearFilters} className="mr-3 px-4 py-2 text-sm text-gray-700 hover:text-gray-500">
          Clear All
        </button>
        <button type="button" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700">
          Apply Filters
        </button>
      </div>
    </div>;
};