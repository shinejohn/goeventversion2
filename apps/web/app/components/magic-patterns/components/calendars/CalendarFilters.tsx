import React, { useState } from 'react';
import { MapPinIcon, UsersIcon, ClockIcon, TagIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
type FiltersProps = {
  filters: {
    location: {
      address: string;
      radius: number;
    };
    followers: {
      min: number;
      max: number;
    };
    updateFrequency: string;
    priceType: string;
  };
  onFilterChange: (filters: any) => void;
  onClose: () => void;
};
export const CalendarFilters = ({
  filters,
  onFilterChange,
  onClose
}: FiltersProps) => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    followers: true,
    updates: true,
    price: true
  });
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  const handleRadiusChange = (radius: number) => {
    onFilterChange({
      location: {
        ...filters.location,
        radius
      }
    });
  };
  const handleFollowerRangeChange = (min: number, max: number) => {
    onFilterChange({
      followers: {
        min,
        max
      }
    });
  };
  const handleUpdateFrequencyChange = (frequency: string) => {
    onFilterChange({
      updateFrequency: frequency
    });
  };
  const handlePriceTypeChange = (priceType: string) => {
    onFilterChange({
      priceType
    });
  };
  const resetFilters = () => {
    onFilterChange({
      location: {
        address: 'Clearwater, FL',
        radius: 25
      },
      followers: {
        min: 0,
        max: 10000
      },
      updateFrequency: 'any',
      priceType: 'all'
    });
  };
  return <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <div className="flex items-center space-x-2">
          <button onClick={resetFilters} className="text-sm text-indigo-600 hover:text-indigo-800">
            Reset
          </button>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* Location Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button className="flex items-center justify-between w-full text-left" onClick={() => toggleSection('location')}>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-base font-medium text-gray-900">Location</h3>
          </div>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.location ? 'transform rotate-180' : ''}`} />
        </button>
        {expandedSections.location && <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="location-input" className="block text-sm font-medium text-gray-700 mb-1">
                Near
              </label>
              <input type="text" id="location-input" value={filters.location.address} onChange={e => onFilterChange({
            location: {
              ...filters.location,
              address: e.target.value
            }
          })} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter city or zip code" />
            </div>
            <div>
              <label htmlFor="radius-slider" className="block text-sm font-medium text-gray-700 mb-1">
                Radius: {filters.location.radius} miles
              </label>
              <input id="radius-slider" type="range" min="5" max="100" step="5" value={filters.location.radius} onChange={e => handleRadiusChange(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 mi</span>
                <span>50 mi</span>
                <span>100 mi</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[10, 25, 50, 100].map(radius => <button key={radius} onClick={() => handleRadiusChange(radius)} className={`px-2 py-1 text-xs rounded-full ${filters.location.radius === radius ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}>
                  {radius} miles
                </button>)}
            </div>
          </div>}
      </div>
      {/* Followers Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button className="flex items-center justify-between w-full text-left" onClick={() => toggleSection('followers')}>
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-base font-medium text-gray-900">Followers</h3>
          </div>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.followers ? 'transform rotate-180' : ''}`} />
        </button>
        {expandedSections.followers && <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="followers-slider" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Followers: {filters.followers.min}+
              </label>
              <input id="followers-slider" type="range" min="0" max="10000" step="100" value={filters.followers.min} onChange={e => handleFollowerRangeChange(parseInt(e.target.value), filters.followers.max)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[0, 100, 500, 1000, 5000].map(count => <button key={count} onClick={() => handleFollowerRangeChange(count, filters.followers.max)} className={`px-2 py-1 text-xs rounded-full ${filters.followers.min === count ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}>
                  {count > 0 ? `${count}+` : 'Any'}
                </button>)}
            </div>
          </div>}
      </div>
      {/* Update Frequency Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button className="flex items-center justify-between w-full text-left" onClick={() => toggleSection('updates')}>
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-base font-medium text-gray-900">
              Update Frequency
            </h3>
          </div>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.updates ? 'transform rotate-180' : ''}`} />
        </button>
        {expandedSections.updates && <div className="mt-4 space-y-2">
            {['any', 'daily', 'weekly', 'monthly'].map(frequency => <div key={frequency} className="flex items-center">
                <input id={`frequency-${frequency}`} name="update-frequency" type="radio" checked={filters.updateFrequency === frequency} onChange={() => handleUpdateFrequencyChange(frequency)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                <label htmlFor={`frequency-${frequency}`} className="ml-2 block text-sm text-gray-700 capitalize">
                  {frequency === 'any' ? 'Any frequency' : `${frequency}`}
                </label>
              </div>)}
          </div>}
      </div>
      {/* Price Filter */}
      <div>
        <button className="flex items-center justify-between w-full text-left" onClick={() => toggleSection('price')}>
          <div className="flex items-center">
            <TagIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-base font-medium text-gray-900">Price</h3>
          </div>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.price ? 'transform rotate-180' : ''}`} />
        </button>
        {expandedSections.price && <div className="mt-4 space-y-2">
            {['all', 'free', 'paid'].map(priceType => <div key={priceType} className="flex items-center">
                <input id={`price-${priceType}`} name="price-type" type="radio" checked={filters.priceType === priceType} onChange={() => handlePriceTypeChange(priceType)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                <label htmlFor={`price-${priceType}`} className="ml-2 block text-sm text-gray-700 capitalize">
                  {priceType === 'all' ? 'All calendars' : `${priceType} only`}
                </label>
              </div>)}
          </div>}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button onClick={() => navigate('/calendars/marketplace')} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm">
          Browse Calendars
        </button>
      </div>
    </div>;
};