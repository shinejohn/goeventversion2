import React, { useEffect, useState } from 'react';
import { MapPinIcon, StarIcon, TrendingUpIcon, FilterIcon, SearchIcon, UsersIcon, MusicIcon, CalendarIcon, ThumbsUpIcon, BuildingIcon, ChevronRightIcon, HomeIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
// Mock data for trending venues
const trendingVenues = [{
  id: 'venue-1',
  name: 'The Grand Hall',
  type: 'Event Space',
  image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'Downtown, Seattle',
  rating: 4.9,
  reviewCount: 128,
  trending: 'Up 15% this week',
  description: 'Historic venue with modern amenities, perfect for weddings and corporate events.',
  capacity: 350,
  amenities: ['Stage', 'Sound System', 'Catering', 'Parking'],
  popularFor: ['Weddings', 'Corporate Events', 'Galas']
}, {
  id: 'venue-2',
  name: 'Skyline Loft',
  type: 'Rooftop Venue',
  image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'Capitol Hill, Seattle',
  rating: 4.8,
  reviewCount: 94,
  trending: 'Up 22% this week',
  description: 'Modern rooftop venue with panoramic city views and indoor/outdoor options.',
  capacity: 200,
  amenities: ['Rooftop Deck', 'Bar', 'Lighting', 'Climate Control'],
  popularFor: ['Cocktail Parties', 'Corporate Events', 'Birthday Parties']
}, {
  id: 'venue-3',
  name: 'The Sound Studio',
  type: 'Music Venue',
  image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'Belltown, Seattle',
  rating: 4.7,
  reviewCount: 156,
  trending: 'Up 18% this week',
  description: 'Professional recording studio and performance space for musicians and bands.',
  capacity: 150,
  amenities: ['Professional Sound', 'Lighting', 'Backstage Area', 'Bar'],
  popularFor: ['Concerts', 'Album Release Parties', 'Recording Sessions']
}, {
  id: 'venue-4',
  name: 'The Garden Pavilion',
  type: 'Outdoor Venue',
  image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'Greenlake, Seattle',
  rating: 4.6,
  reviewCount: 87,
  trending: 'Up 12% this week',
  description: 'Beautiful garden venue with covered pavilion, perfect for outdoor events.',
  capacity: 250,
  amenities: ['Gardens', 'Covered Area', 'Catering', 'Parking'],
  popularFor: ['Weddings', 'Garden Parties', 'Corporate Retreats']
}, {
  id: 'venue-5',
  name: 'Warehouse 23',
  type: 'Industrial Space',
  image: 'https://images.unsplash.com/photo-1559329255-2e7cb3839e36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'SODO, Seattle',
  rating: 4.5,
  reviewCount: 72,
  trending: 'Up 25% this week',
  description: 'Converted warehouse with industrial charm and flexible space configurations.',
  capacity: 400,
  amenities: ['Open Floor Plan', 'High Ceilings', 'Loading Dock', 'Parking'],
  popularFor: ['Art Shows', 'Product Launches', 'Fashion Shows']
}, {
  id: 'venue-6',
  name: 'The Emerald Room',
  type: 'Ballroom',
  image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'Downtown, Seattle',
  rating: 4.8,
  reviewCount: 110,
  trending: 'Up 10% this week',
  description: 'Elegant ballroom with crystal chandeliers and classic architectural details.',
  capacity: 300,
  amenities: ['Dance Floor', 'Stage', 'Full Kitchen', 'Valet Parking'],
  popularFor: ['Weddings', 'Galas', 'Corporate Events']
}];
export const TrendingVenuesPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenueType, setSelectedVenueType] = useState<string | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);
  const [filteredVenues, setFilteredVenues] = useState(trendingVenues);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const venueTypes = ['All Types', 'Event Space', 'Rooftop Venue', 'Music Venue', 'Outdoor Venue', 'Industrial Space', 'Ballroom'];
  const capacityOptions = [{
    label: 'Any Capacity',
    value: null
  }, {
    label: 'Up to 100 guests',
    value: '100'
  }, {
    label: '100-200 guests',
    value: '200'
  }, {
    label: '200-300 guests',
    value: '300'
  }, {
    label: '300+ guests',
    value: '301'
  }];
  useEffect(() => {
    let results = trendingVenues;
    // Apply search filter
    if (searchTerm) {
      results = results.filter(venue => venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || venue.location.toLowerCase().includes(searchTerm.toLowerCase()) || venue.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Apply venue type filter
    if (selectedVenueType && selectedVenueType !== 'All Types') {
      results = results.filter(venue => venue.type === selectedVenueType);
    }
    // Apply capacity filter
    if (selectedCapacity) {
      const capacity = parseInt(selectedCapacity);
      if (capacity === 301) {
        results = results.filter(venue => venue.capacity >= 300);
      } else {
        results = results.filter(venue => venue.capacity <= capacity);
      }
    }
    setFilteredVenues(results);
  }, [searchTerm, selectedVenueType, selectedCapacity]);
  const handleVenueClick = (venueId: string) => {
    navigateTo(`/book-it/venues/${venueId}`);
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500">
            <button onClick={() => navigateTo('/')} className="hover:text-gray-700 flex items-center">
              <HomeIcon className="h-4 w-4 mr-1" />
              Home
            </button>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <button onClick={() => navigateTo('/venues')} className="hover:text-gray-700">
              Venues
            </button>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">Trending</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center justify-center md:justify-start">
            <TrendingUpIcon className="h-10 w-10 mr-4" />
            <h1 className="text-3xl md:text-4xl font-bold">Trending Venues</h1>
          </div>
          <p className="mt-4 text-indigo-100 text-lg max-w-3xl">
            Discover the hottest venues that are gaining popularity right now.
            These spaces are seeing increased bookings and generating buzz.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search venues by name, location, or features..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="mt-3 md:mt-0 flex items-center">
              <button onClick={() => setIsFiltersVisible(!isFiltersVisible)} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
              <span className="ml-3 text-sm text-gray-500">
                {filteredVenues.length} venues found
              </span>
            </div>
          </div>
          {isFiltersVisible && <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="venue-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Type
                </label>
                <select id="venue-type" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={selectedVenueType || 'All Types'} onChange={e => setSelectedVenueType(e.target.value === 'All Types' ? null : e.target.value)}>
                  {venueTypes.map(type => <option key={type} value={type}>
                      {type}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <select id="capacity" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={selectedCapacity || ''} onChange={e => setSelectedCapacity(e.target.value || null)}>
                  {capacityOptions.map(option => <option key={option.label} value={option.value || ''}>
                      {option.label}
                    </option>)}
                </select>
              </div>
            </div>}
        </div>
      </div>

      {/* Trending Venues List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredVenues.length === 0 ? <div className="text-center py-12">
            <BuildingIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No venues found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
            <div className="mt-6">
              <button onClick={() => {
            setSearchTerm('');
            setSelectedVenueType(null);
            setSelectedCapacity(null);
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Clear all filters
              </button>
            </div>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map(venue => <div key={venue.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleVenueClick(venue.id)}>
                <div className="relative h-48">
                  <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 mt-2 mr-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <TrendingUpIcon className="h-3 w-3 mr-1" />
                      {venue.trending}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {venue.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {venue.type}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPinIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                    {venue.location}
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map(rating => <StarIcon key={rating} className={`h-4 w-4 ${venue.rating > rating ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">
                      {venue.rating} ({venue.reviewCount} reviews)
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {venue.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <UsersIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                    Up to {venue.capacity} guests
                  </div>
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Popular For
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {venue.popularFor.map(item => <span key={item} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {item}
                        </span>)}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm font-medium text-indigo-600">
                      View Details
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                        <ThumbsUpIcon className="h-5 w-5" />
                      </button>
                      <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                        <BookmarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>

      {/* Why Trending Section */}
      <div className="bg-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Why These Venues Are Trending
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our trending venues are determined by a combination of factors
              that indicate rising popularity and demand.
            </p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow px-5 py-6 text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <TrendingUpIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Booking Velocity
              </h3>
              <p className="mt-2 text-base text-gray-500">
                These venues have seen a significant increase in booking
                requests over the past 30 days.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow px-5 py-6 text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <StarIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Recent Reviews
              </h3>
              <p className="mt-2 text-base text-gray-500">
                They've received exceptional reviews and ratings from recent
                events and gatherings.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow px-5 py-6 text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Seasonal Demand
              </h3>
              <p className="mt-2 text-base text-gray-500">
                These venues are particularly in-demand for the current or
                upcoming season.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to book your event?</span>
            <span className="block text-indigo-600">
              Secure your trending venue today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button onClick={() => navigateTo('/book-it/venues')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Browse All Venues
              </button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <button onClick={() => navigateTo('/book/start')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
                Start Planning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};