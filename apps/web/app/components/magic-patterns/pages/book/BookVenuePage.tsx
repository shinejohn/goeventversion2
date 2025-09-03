import React, { useState, Component } from 'react';
/**
 * Page: Book Venue Page
 * Type: CSR
 * Mockdata: OFF
 * Description: Find and book venues
 * Components: None
 */
import { SearchIcon, FilterIcon, MapPinIcon, CalendarIcon, UsersIcon, MusicIcon, BuildingIcon, DollarSignIcon, StarIcon, ChevronDownIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
// Mock venue data
const venues = [{
  id: 'venue-1',
  name: 'The Grand Hall',
  description: 'Elegant venue with high ceilings and historic architecture',
  image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  location: 'Downtown',
  address: '123 Main St, Clearwater, FL',
  capacity: 300,
  priceRange: '$$',
  rating: 4.8,
  reviewCount: 124,
  features: ['Stage', 'Sound System', 'Lighting', 'Bar', 'Catering'],
  eventTypes: ['Concerts', 'Weddings', 'Corporate'],
  availability: ['Weekends', 'Evenings']
}, {
  id: 'venue-2',
  name: 'Beachside Pavilion',
  description: 'Open-air venue with stunning ocean views',
  image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  location: 'Beachfront',
  address: '456 Beach Dr, Clearwater, FL',
  capacity: 200,
  priceRange: '$$$',
  rating: 4.9,
  reviewCount: 87,
  features: ['Ocean View', 'Outdoor Space', 'Covered Area', 'Power'],
  eventTypes: ['Weddings', 'Parties', 'Corporate'],
  availability: ['Daily']
}, {
  id: 'venue-3',
  name: 'The Underground',
  description: 'Intimate basement venue with industrial charm',
  image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  location: 'Arts District',
  address: '789 Central Ave, St. Petersburg, FL',
  capacity: 150,
  priceRange: '$',
  rating: 4.6,
  reviewCount: 56,
  features: ['Stage', 'Sound System', 'Bar', 'Unique Atmosphere'],
  eventTypes: ['Concerts', 'Performances', 'Art Shows'],
  availability: ['Evenings', 'Weekends']
}, {
  id: 'venue-4',
  name: 'Skyline Rooftop',
  description: 'Modern rooftop venue with panoramic city views',
  image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  location: 'Downtown',
  address: '101 Tower Rd, Tampa, FL',
  capacity: 180,
  priceRange: '$$$',
  rating: 4.7,
  reviewCount: 92,
  features: ['City Views', 'Bar', 'Indoor/Outdoor', 'Climate Control'],
  eventTypes: ['Corporate', 'Parties', 'Networking'],
  availability: ['Evenings', 'Weekends']
}, {
  id: 'venue-5',
  name: 'The Warehouse',
  description: 'Converted industrial space with raw charm',
  image: 'https://images.unsplash.com/photo-1559329255-2e7cb2e21ca7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  location: 'Industrial District',
  address: '555 Factory Ln, Tampa, FL',
  capacity: 400,
  priceRange: '$$',
  rating: 4.5,
  reviewCount: 68,
  features: ['High Ceilings', 'Open Floor Plan', 'Loading Dock', 'Parking'],
  eventTypes: ['Concerts', 'Exhibitions', 'Markets'],
  availability: ['Flexible']
}, {
  id: 'venue-6',
  name: 'Garden Terrace',
  description: 'Lush garden venue with beautiful landscaping',
  image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  location: 'Suburbs',
  address: '222 Bloom St, Clearwater, FL',
  capacity: 120,
  priceRange: '$$',
  rating: 4.9,
  reviewCount: 45,
  features: ['Gardens', 'Fountain', 'Covered Patio', 'Lighting'],
  eventTypes: ['Weddings', 'Parties', 'Photography'],
  availability: ['Daytime', 'Weekends']
}];
type FilterState = {
  location: string[];
  capacity: string[];
  priceRange: string[];
  eventType: string[];
  features: string[];
  availability: string[];
};
export const BookVenuePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: [],
    capacity: [],
    priceRange: [],
    eventType: [],
    features: [],
    availability: []
  });
  // Filter venues based on search term and filters
  const filteredVenues = venues.filter(venue => {
    // Search term filter
    if (searchTerm && !venue.name.toLowerCase().includes(searchTerm.toLowerCase()) && !venue.description.toLowerCase().includes(searchTerm.toLowerCase()) && !venue.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Filter by location if any selected
    if (filters.location.length > 0 && !filters.location.includes(venue.location)) {
      return false;
    }
    // Filter by capacity
    if (filters.capacity.length > 0) {
      const capacityMatch = filters.capacity.some(cap => {
        if (cap === 'small' && venue.capacity <= 100) return true;
        if (cap === 'medium' && venue.capacity > 100 && venue.capacity <= 250) return true;
        if (cap === 'large' && venue.capacity > 250) return true;
        return false;
      });
      if (!capacityMatch) return false;
    }
    // Filter by price range
    if (filters.priceRange.length > 0 && !filters.priceRange.includes(venue.priceRange)) {
      return false;
    }
    // Filter by event type
    if (filters.eventType.length > 0) {
      const eventTypeMatch = filters.eventType.some(type => venue.eventTypes.includes(type));
      if (!eventTypeMatch) return false;
    }
    // Filter by features
    if (filters.features.length > 0) {
      const featuresMatch = filters.features.some(feature => venue.features.includes(feature));
      if (!featuresMatch) return false;
    }
    // Filter by availability
    if (filters.availability.length > 0) {
      const availabilityMatch = filters.availability.some(avail => venue.availability.includes(avail));
      if (!availabilityMatch) return false;
    }
    return true;
  });
  // Sort venues
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.priceRange.length - b.priceRange.length;
    } else if (sortBy === 'price-high') {
      return b.priceRange.length - a.priceRange.length;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'capacity-high') {
      return b.capacity - a.capacity;
    } else if (sortBy === 'capacity-low') {
      return a.capacity - b.capacity;
    }
    // Default: recommended
    return b.rating - a.rating;
  });
  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = [...prev[category]];
      if (current.includes(value)) {
        return {
          ...prev,
          [category]: current.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [category]: [...current, value]
        };
      }
    });
  };
  const clearFilters = () => {
    setFilters({
      location: [],
      capacity: [],
      priceRange: [],
      eventType: [],
      features: [],
      availability: []
    });
    setSearchTerm('');
    setDateRange('');
    setGuestCount('');
  };
  const handleViewVenue = (venueId: string) => {
    navigate(`/book-it/venues/${venueId}`);
  };
  // Count active filters
  const activeFilterCount = Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  return <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Find the Perfect Venue
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-indigo-100">
              Browse and book unique venues for your next event
            </p>
          </div>
          {/* Search Form */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search venues by name, location, or features" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Date / Date Range" value={dateRange} onChange={e => setDateRange(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UsersIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="number" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Number of guests" value={guestCount} onChange={e => setGuestCount(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowFilters(!showFilters)}>
                      <FilterIcon className="h-5 w-5 mr-2" />
                      Filters{' '}
                      {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </button>
                  </div>
                  <div className="md:col-span-1">
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" onClick={() => {
                    // In a real app, this would apply the search and filters
                    console.log('Search applied', {
                      searchTerm,
                      dateRange,
                      guestCount,
                      filters
                    });
                  }}>
                      Search Venues
                    </button>
                  </div>
                </div>
                {/* Filter Panel */}
                {showFilters && <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Location
                        </h3>
                        <div className="space-y-2">
                          {['Downtown', 'Beachfront', 'Arts District', 'Suburbs', 'Industrial District'].map(location => <div key={location} className="flex items-center">
                              <input id={`location-${location}`} name="location" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={filters.location.includes(location)} onChange={() => toggleFilter('location', location)} />
                              <label htmlFor={`location-${location}`} className="ml-3 text-sm text-gray-700">
                                {location}
                              </label>
                            </div>)}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mt-4 mb-2">
                          Capacity
                        </h3>
                        <div className="space-y-2">
                          {[{
                        id: 'small',
                        label: 'Small (up to 100)'
                      }, {
                        id: 'medium',
                        label: 'Medium (101-250)'
                      }, {
                        id: 'large',
                        label: 'Large (251+)'
                      }].map(option => <div key={option.id} className="flex items-center">
                              <input id={`capacity-${option.id}`} name="capacity" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={filters.capacity.includes(option.id)} onChange={() => toggleFilter('capacity', option.id)} />
                              <label htmlFor={`capacity-${option.id}`} className="ml-3 text-sm text-gray-700">
                                {option.label}
                              </label>
                            </div>)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Price Range
                        </h3>
                        <div className="space-y-2">
                          {['$', '$$', '$$$'].map(price => <div key={price} className="flex items-center">
                              <input id={`price-${price}`} name="price" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={filters.priceRange.includes(price)} onChange={() => toggleFilter('priceRange', price)} />
                              <label htmlFor={`price-${price}`} className="ml-3 text-sm text-gray-700">
                                {price}
                              </label>
                            </div>)}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mt-4 mb-2">
                          Event Type
                        </h3>
                        <div className="space-y-2">
                          {['Concerts', 'Weddings', 'Corporate', 'Parties', 'Exhibitions'].map(type => <div key={type} className="flex items-center">
                              <input id={`type-${type}`} name="eventType" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={filters.eventType.includes(type)} onChange={() => toggleFilter('eventType', type)} />
                              <label htmlFor={`type-${type}`} className="ml-3 text-sm text-gray-700">
                                {type}
                              </label>
                            </div>)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Features
                        </h3>
                        <div className="space-y-2">
                          {['Stage', 'Sound System', 'Bar', 'Catering', 'Outdoor Space', 'Parking'].map(feature => <div key={feature} className="flex items-center">
                              <input id={`feature-${feature}`} name="features" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={filters.features.includes(feature)} onChange={() => toggleFilter('features', feature)} />
                              <label htmlFor={`feature-${feature}`} className="ml-3 text-sm text-gray-700">
                                {feature}
                              </label>
                            </div>)}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mt-4 mb-2">
                          Availability
                        </h3>
                        <div className="space-y-2">
                          {['Weekends', 'Weekdays', 'Evenings', 'Daytime', 'Flexible'].map(avail => <div key={avail} className="flex items-center">
                              <input id={`avail-${avail}`} name="availability" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={filters.availability.includes(avail)} onChange={() => toggleFilter('availability', avail)} />
                              <label htmlFor={`avail-${avail}`} className="ml-3 text-sm text-gray-700">
                                {avail}
                              </label>
                            </div>)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button type="button" className="text-sm text-gray-700 hover:text-gray-500" onClick={clearFilters}>
                        Clear all filters
                      </button>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedVenues.length}{' '}
              {sortedVenues.length === 1 ? 'Venue' : 'Venues'} Available
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeFilterCount > 0 ? `Filtered by ${activeFilterCount} ${activeFilterCount === 1 ? 'criteria' : 'criteria'}` : 'Showing all venues'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
                Sort by:
              </label>
              <select id="sort" name="sort" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="capacity-high">Capacity: High to Low</option>
                <option value="capacity-low">Capacity: Low to High</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button type="button" className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`} onClick={() => setViewMode('grid')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button type="button" className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`} onClick={() => setViewMode('list')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Venue Results */}
        {sortedVenues.length === 0 ? <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <BuildingIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No venues found
            </h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any venues matching your criteria. Try adjusting
              your filters or search terms.
            </p>
            <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200" onClick={clearFilters}>
              Clear all filters
            </button>
          </div> : viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVenues.map(venue => <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img src={venue.image} alt={venue.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {venue.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          {venue.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center bg-indigo-100 px-2 py-1 rounded text-sm text-indigo-800">
                      <span className="font-bold">{venue.rating}</span>
                      <StarIcon className="h-4 w-4 text-yellow-500 ml-1" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 flex-1">
                    {venue.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {venue.eventTypes.slice(0, 3).map(type => <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {type}
                      </span>)}
                    {venue.eventTypes.length > 3 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{venue.eventTypes.length - 3}
                      </span>}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-700">
                          Up to {venue.capacity}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {venue.priceRange}
                      </div>
                    </div>
                    <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => handleViewVenue(venue.id)}>
                      View Details
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>)}
          </div> : <div className="space-y-4">
            {sortedVenues.map(venue => <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                    <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 md:p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {venue.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-500">
                            {venue.address}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-indigo-100 px-2 py-1 rounded text-sm text-indigo-800 flex items-center">
                          <span className="font-bold">{venue.rating}</span>
                          <StarIcon className="h-4 w-4 text-yellow-500 ml-1" />
                          <span className="text-gray-600 ml-1">
                            ({venue.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{venue.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {venue.features.map(feature => <span key={feature} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {feature}
                        </span>)}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between">
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-700">
                            Up to {venue.capacity}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSignIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {venue.priceRange}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MusicIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-700">
                            {venue.eventTypes.join(', ')}
                          </span>
                        </div>
                      </div>
                      <button type="button" className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => handleViewVenue(venue.id)}>
                        View Details
                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
      {/* Need Help Section */}
      <div className="bg-indigo-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Need Help Finding the Perfect Venue?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our venue specialists can help you find the perfect space for your
              event based on your specific requirements.
            </p>
            <div className="mt-6">
              <button type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => navigate('/book/start')}>
                Get Personalized Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};