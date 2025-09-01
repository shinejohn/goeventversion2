import React from 'react';
import { TagIcon, MapPinIcon, CalendarIcon, DollarSignIcon, ThumbsUpIcon, StarIcon, CheckIcon, BuildingIcon, MusicIcon, XIcon } from 'lucide-react';
type DirectoryFiltersProps = {
  type: 'performers' | 'venues';
  hubData: any;
  filters: any;
  onFilterChange: (filterType: string, value: any) => void;
  onClearFilters: () => void;
};
export const DirectoryFilters = ({
  type,
  hubData,
  filters,
  onFilterChange,
  onClearFilters
}: DirectoryFiltersProps) => {
  // Toggle function for array-based filters
  const handleArrayToggle = (filterType: string, value: string) => {
    const currentValues = filters[filterType] || [];
    if (currentValues.includes(value)) {
      onFilterChange(filterType, currentValues.filter(v => v !== value));
    } else {
      onFilterChange(filterType, [...currentValues, value]);
    }
  };
  // Get all possible genres for performers
  const allGenres = ['Rock/Alternative', 'Pop/Top 40', 'Jazz/Blues', 'Hip-Hop/Rap', 'Electronic/DJ', 'Country/Folk', 'Classical/Orchestra', 'R&B', 'Latin', 'World Music', 'Funk', 'Soul', 'Reggae', 'Metal', 'Indie', 'Cover Bands', 'Comedy', 'Kids/Family'];
  // Get all possible amenities for venues
  const allAmenities = ['Professional sound system', 'Stage lighting', 'Green room', 'Backstage area', 'Loading dock', 'Kitchen facilities', 'Bar setup', 'Tables and chairs', 'Projector and screen', 'Outdoor space', 'Parking', 'Wheelchair accessible', 'Wi-Fi'];
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Genres/Venue Types Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <TagIcon className="h-4 w-4 mr-1 text-gray-500" />
              {type === 'performers' ? 'Genres' : 'Venue Types'}
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            {type === 'performers' ?
          // Display genres for performers
          allGenres.map((genre, index) => <button key={index} onClick={() => handleArrayToggle('genres', genre)} className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${filters.genres.includes(genre) ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}>
                    {genre}
                    {filters.genres.includes(genre) && <XIcon className="ml-1 h-3 w-3" />}
                  </button>) :
          // Display venue types for venues
          hubData.venueTypes.map((venueType: string, index: number) => <button key={index} onClick={() => handleArrayToggle('venueTypes', venueType)} className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${filters.venueTypes.includes(venueType) ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}>
                    {venueType}
                    {filters.venueTypes.includes(venueType) && <XIcon className="ml-1 h-3 w-3" />}
                  </button>)}
          </div>
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
        {/* Availability/Capacity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              {type === 'performers' ? <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" /> : <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />}
              {type === 'performers' ? 'Availability' : 'Capacity'}
            </div>
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={type === 'performers' ? filters.availability : filters.capacity} onChange={e => onFilterChange(type === 'performers' ? 'availability' : 'capacity', e.target.value || null)}>
            <option value="">Any</option>
            {type === 'performers' ? <>
                <option value="booking">Available for Booking</option>
                <option value="touring">Currently Touring</option>
              </> : <>
                <option value="small">Small (up to 100)</option>
                <option value="medium">Medium (101-300)</option>
                <option value="large">Large (300+)</option>
              </>}
          </select>
        </div>
        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <DollarSignIcon className="h-4 w-4 mr-1 text-gray-500" />
              Price Range
            </div>
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={filters.priceRange || ''} onChange={e => onFilterChange('priceRange', e.target.value || null)}>
            <option value="">Any Price</option>
            {type === 'performers' ? <>
                <option value="budget">Budget-Friendly</option>
                <option value="premium">Premium</option>
              </> : <>
                <option value="budget">Budget (Under $200/hr)</option>
                <option value="mid">Mid-Range ($200-500/hr)</option>
                <option value="premium">Premium ($500+/hr)</option>
              </>}
          </select>
        </div>
        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 mr-1 text-gray-500" />
              Minimum Rating
            </div>
          </label>
          <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={filters.rating || ''} onChange={e => onFilterChange('rating', parseFloat(e.target.value) || null)}>
            <option value="">Any Rating</option>
            <option value="3.0">3.0+</option>
            <option value="3.5">3.5+</option>
            <option value="4.0">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="4.8">4.8+</option>
          </select>
        </div>
        {/* Additional Filters */}
        <div className="flex flex-col space-y-3">
          {/* Member Recommended */}
          <label className="inline-flex items-center">
            <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-5 w-5" checked={filters.memberRecommended} onChange={e => onFilterChange('memberRecommended', e.target.checked)} />
            <span className="ml-2 text-sm text-gray-700 flex items-center">
              <ThumbsUpIcon className="h-4 w-4 mr-1 text-gray-500" />
              Member Recommended
            </span>
          </label>
          {/* Has Upcoming Events */}
          {type === 'performers' && <label className="inline-flex items-center">
              <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-5 w-5" checked={filters.hasUpcomingEvents} onChange={e => onFilterChange('hasUpcomingEvents', e.target.checked)} />
              <span className="ml-2 text-sm text-gray-700 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                Has Upcoming Events
              </span>
            </label>}
        </div>
      </div>
      {/* Amenities Filter (Venues only) */}
      {type === 'venues' && <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <CheckIcon className="h-4 w-4 mr-1 text-gray-500" />
              Amenities
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            {allAmenities.map((amenity, index) => <button key={index} onClick={() => handleArrayToggle('amenities', amenity)} className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${filters.amenities.includes(amenity) ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}>
                {amenity}
                {filters.amenities.includes(amenity) && <XIcon className="ml-1 h-3 w-3" />}
              </button>)}
          </div>
        </div>}
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
// Add the missing UsersIcon component
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>;
}