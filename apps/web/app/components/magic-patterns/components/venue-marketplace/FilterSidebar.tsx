import React, { useState } from 'react';
import { CalendarIcon, ChevronDownIcon, XIcon } from 'lucide-react';
type FilterSidebarProps = {
  filters: any;
  onFilterChange: (filters: any) => void;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
};
export const FilterSidebar = ({
  filters,
  onFilterChange,
  selectedDate,
  onDateChange
}: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    dateTime: true,
    venueType: true,
    capacity: true,
    budget: true,
    amenities: true,
    location: true
  });
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  const handleVenueTypeChange = (type: string) => {
    const currentTypes = [...filters.venueTypes];
    const index = currentTypes.indexOf(type);
    if (index === -1) {
      currentTypes.push(type);
    } else {
      currentTypes.splice(index, 1);
    }
    onFilterChange({
      venueTypes: currentTypes
    });
  };
  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = [...filters.amenities];
    const index = currentAmenities.indexOf(amenity);
    if (index === -1) {
      currentAmenities.push(amenity);
    } else {
      currentAmenities.splice(index, 1);
    }
    onFilterChange({
      amenities: currentAmenities
    });
  };
  const handleCapacityChange = (min: number, max: number) => {
    onFilterChange({
      minCapacity: min,
      maxCapacity: max
    });
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onDateChange(new Date(e.target.value));
    } else {
      onDateChange(null);
    }
  };
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };
  const resetFilters = () => {
    onFilterChange({
      venueTypes: [],
      minCapacity: 10,
      maxCapacity: 5000,
      minPrice: 50,
      maxPrice: 10000,
      amenities: [],
      location: {
        address: '',
        radius: 25,
        neighborhoods: []
      },
      flexibleDates: false
    });
    onDateChange(null);
  };
  // Venue type options
  const venueTypes = ['Concert Halls', 'Restaurants & Bars', 'Event Spaces', 'Outdoor Venues', 'Galleries & Museums', 'Meeting Rooms', 'Warehouses', 'Private Homes', 'Unique Spaces'];
  // Amenity options
  const amenityOptions = ['Parking Available', 'Wheelchair Accessible', 'Kitchen/Catering', 'A/V Equipment', 'WiFi', 'Bar Service', 'Outdoor Space', 'Stage/Performance Area', 'Green Room', 'Load-in Access'];
  // Capacity quick select options
  const capacityOptions = [{
    label: 'Intimate (10-50)',
    min: 10,
    max: 50
  }, {
    label: 'Small (50-150)',
    min: 50,
    max: 150
  }, {
    label: 'Medium (150-300)',
    min: 150,
    max: 300
  }, {
    label: 'Large (300-500)',
    min: 300,
    max: 500
  }, {
    label: 'Massive (500+)',
    min: 500,
    max: 5000
  }];
  return <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button onClick={resetFilters} className="text-sm text-indigo-600 hover:text-indigo-800">
          Reset all
        </button>
      </div>
      {/* Date & Time Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button className="flex items-center justify-between w-full text-left" onClick={() => toggleSection('dateTime')}>
          <h3 className="text-base font-medium text-gray-900">Date & Time</h3>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.dateTime ? 'transform rotate-180' : ''}`} />
        </button>
        {expandedSections.dateTime && <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="date" id="event-date" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formatDate(selectedDate)} onChange={handleDateChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <select id="start-time" className="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">Any time</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                </select>
              </div>
              <div>
                <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <select id="end-time" className="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">Any time</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                  <option value="23:00">11:00 PM</option>
                  <option value="00:00">12:00 AM</option>
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <input id="flexible-dates" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={filters.flexibleDates} onChange={e => onFilterChange({
            flexibleDates: e.target.checked
          })} />
              <label htmlFor="flexible-dates" className="ml-2 block text-sm text-gray-700">
                My dates are flexible
              </label>
            </div>
          </div>}
      </div>
      {/* Venue Type Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button className="flex items-center justify-between w-full text-left" onClick={() => toggleSection('venueType')}>
          <h3 className="text-base font-medium text-gray-900">Venue Type</h3>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.venueType ? 'transform rotate-180' : ''}`} />
        </button>
        {expandedSections.venueType && <div className="mt-4 space-y-2">
            {venueTypes.map(type => <div key={type} className="flex items-center">
                <input id={`venue-type-${type}`} type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={filters.venueTypes.includes(type)} onChange={() => handleVenueTypeChange(type)} />
                <label htmlFor={`venue-type-${type}`} className="ml-2 block text-sm text-gray-700">
                  {type}
                </label>
              </div>)}
          </div>}
      </div>
      {/* Capacity Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button className="flex items-center justify-between w-full text-left" onClick={() => toggleSection('capacity')}>
          <h3 className="text-base font-medium text-gray-900">Capacity</h3>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.capacity ? 'transform rotate-180' : ''}`} />
        </button>
        {expandedSections.capacity && <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="capacity-slider" className="block text-sm font-medium text-gray-700 mb-1">
                Guest Count: {filters.minCapacity} -{' '}
                {filters.maxCapacity === 5000 ? '5000+' : filters.maxCapacity}
              </label>
              <input id="capacity-slider" type="range" min="10" max="5000" step="10" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" value={filters.maxCapacity} onChange={e => onFilterChange({
            maxCapacity: parseInt(e.target.value)
          })} />
            </div>
            <div className="flex flex-wrap gap-2">
              {capacityOptions.map(option => <button key={option.label} className={`px-3 py-1 text-xs rounded-full ${filters.minCapacity === option.min && filters.maxCapacity === option.max ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`} onClick={() => handleCapacityChange(option.min, option.max)}>
                  {option.label}
                </button>)}
            </div>
          </div>}
      </div>
      {/* Budget Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button className="flex items-center justify-between w-full text-left" onClick={() => toggleSection('budget')}>
          <h3 className="text-base font-medium text-gray-900">Budget</h3>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.budget ? 'transform rotate-180' : ''}`} />
        </button>
        {expandedSections.budget && <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="price-slider" className="block text-sm font-medium text-gray-700 mb-1">
                Price Range: ${filters.minPrice} - $
                {filters.maxPrice === 10000 ? '10,000+' : filters.maxPrice}
              </label>
              <input id="price-slider" type="range" min="50" max="10000" step="50" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" value={filters.maxPrice} onChange={e => onFilterChange({
            maxPrice: parseInt(e.target.value)
          })} />
            </div>
            <div>
              <label htmlFor="price-display" className="block text-sm font-medium text-gray-700 mb-1">
                Price Display
              </label>
              <select id="price-display" className="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="hour">Per Hour</option>
                <option value="event">Per Event</option>
                <option value="day">Per Day</option>
              </select>
            </div>
            <div className="flex items-center">
              <input id="include-fees" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="include-fees" className="ml-2 block text-sm text-gray-700">
                Include Additional Fees
              </label>
            </div>
          </div>}
      </div>
      {/* Amenities Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button className="flex items-center justify-between w-full text-left" onClick={() => toggleSection('amenities')}>
          <h3 className="text-base font-medium text-gray-900">Amenities</h3>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.amenities ? 'transform rotate-180' : ''}`} />
        </button>
        {expandedSections.amenities && <div className="mt-4 space-y-2">
            {amenityOptions.map(amenity => <div key={amenity} className="flex items-center">
                <input id={`amenity-${amenity}`} type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={filters.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} />
                <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-700">
                  {amenity}
                </label>
              </div>)}
          </div>}
      </div>
      {/* Location Filter */}
      <div>
        <button className="flex items-center justify-between w-full text-left" onClick={() => toggleSection('location')}>
          <h3 className="text-base font-medium text-gray-900">Location</h3>
          <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.location ? 'transform rotate-180' : ''}`} />
        </button>
        {expandedSections.location && <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="location-input" className="block text-sm font-medium text-gray-700 mb-1">
                Distance From
              </label>
              <input type="text" id="location-input" placeholder="Enter address or use my location" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={filters.location.address} onChange={e => onFilterChange({
            location: {
              ...filters.location,
              address: e.target.value
            }
          })} />
            </div>
            <div>
              <label htmlFor="radius-slider" className="block text-sm font-medium text-gray-700 mb-1">
                Radius: {filters.location.radius} miles
              </label>
              <input id="radius-slider" type="range" min="1" max="50" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" value={filters.location.radius} onChange={e => onFilterChange({
            location: {
              ...filters.location,
              radius: parseInt(e.target.value)
            }
          })} />
            </div>
            <div>
              <label htmlFor="neighborhood-select" className="block text-sm font-medium text-gray-700 mb-1">
                Neighborhoods
              </label>
              <select id="neighborhood-select" multiple className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" size={4}>
                <option value="downtown">Downtown</option>
                <option value="uptown">Uptown</option>
                <option value="midtown">Midtown</option>
                <option value="westside">Westside</option>
                <option value="eastside">Eastside</option>
                <option value="northside">Northside</option>
                <option value="southside">Southside</option>
              </select>
            </div>
            <div className="flex items-center">
              <input id="show-map" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="show-map" className="ml-2 block text-sm text-gray-700">
                Show Map View
              </label>
            </div>
          </div>}
      </div>
    </div>;
};