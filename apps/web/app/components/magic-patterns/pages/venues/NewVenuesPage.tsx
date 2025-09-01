import React, { useEffect, useState } from 'react';
import { MapPinIcon, StarIcon, FilterIcon, SearchIcon, UsersIcon, CalendarIcon, ThumbsUpIcon, BookmarkIcon, BuildingIcon, ChevronRightIcon, HomeIcon, ClockIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
// Mock data for new venues
const newVenues = [{
  id: 'venue-7',
  name: 'Evergreen Studios',
  type: 'Creative Space',
  image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'Fremont, Seattle',
  rating: 4.6,
  reviewCount: 12,
  openedDate: '2023-06-15',
  description: 'Brand new creative studio space with natural light and modern amenities.',
  capacity: 75,
  amenities: ['Natural Light', 'Photography Equipment', 'Kitchenette', 'WiFi'],
  popularFor: ['Photo Shoots', 'Small Events', 'Workshops']
}, {
  id: 'venue-8',
  name: 'The Lakefront',
  type: 'Waterfront Venue',
  image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'Lake Union, Seattle',
  rating: 4.8,
  reviewCount: 9,
  openedDate: '2023-05-22',
  description: 'Stunning waterfront venue with panoramic lake views and outdoor deck.',
  capacity: 150,
  amenities: ['Waterfront Views', 'Outdoor Deck', 'Bar', 'Parking'],
  popularFor: ['Weddings', 'Corporate Events', 'Parties']
}, {
  id: 'venue-9',
  name: 'Tech Hub',
  type: 'Conference Space',
  image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'South Lake Union, Seattle',
  rating: 4.7,
  reviewCount: 15,
  openedDate: '2023-04-10',
  description: 'Modern conference facility with state-of-the-art technology and flexible layouts.',
  capacity: 200,
  amenities: ['AV Equipment', 'High-Speed Internet', 'Breakout Rooms', 'Catering'],
  popularFor: ['Conferences', 'Workshops', 'Presentations']
}, {
  id: 'venue-10',
  name: 'The Timber Room',
  type: 'Rustic Venue',
  image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'Ballard, Seattle',
  rating: 4.9,
  reviewCount: 8,
  openedDate: '2023-07-01',
  description: 'Rustic-chic venue featuring reclaimed wood and industrial elements.',
  capacity: 120,
  amenities: ['Wood Features', 'Fireplace', 'Bar', 'Outdoor Space'],
  popularFor: ['Weddings', 'Private Parties', 'Corporate Events']
}, {
  id: 'venue-11',
  name: 'Urban Gallery',
  type: 'Art Space',
  image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'Pioneer Square, Seattle',
  rating: 4.5,
  reviewCount: 11,
  openedDate: '2023-05-15',
  description: 'Contemporary gallery space in historic building with rotating art installations.',
  capacity: 100,
  amenities: ['Gallery Lighting', 'Display Systems', 'Sound System', 'Catering Prep'],
  popularFor: ['Art Shows', 'Receptions', 'Product Launches']
}, {
  id: 'venue-12',
  name: 'Culinary Workshop',
  type: 'Kitchen Venue',
  image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  location: 'Capitol Hill, Seattle',
  rating: 4.7,
  reviewCount: 6,
  openedDate: '2023-06-05',
  description: 'Professional kitchen venue for cooking classes, demonstrations, and food events.',
  capacity: 40,
  amenities: ['Professional Kitchen', 'Dining Area', 'Cameras for Demos', 'Wine Pairing'],
  popularFor: ['Cooking Classes', 'Chef Tastings', 'Food Photography']
}];
export const NewVenuesPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenueType, setSelectedVenueType] = useState<string | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);
  const [filteredVenues, setFilteredVenues] = useState(newVenues);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const venueTypes = ['All Types', 'Creative Space', 'Waterfront Venue', 'Conference Space', 'Rustic Venue', 'Art Space', 'Kitchen Venue'];
  const capacityOptions = [{
    label: 'Any Capacity',
    value: null
  }, {
    label: 'Up to 50 guests',
    value: '50'
  }, {
    label: '50-100 guests',
    value: '100'
  }, {
    label: '100-200 guests',
    value: '200'
  }, {
    label: '200+ guests',
    value: '201'
  }];
  useEffect(() => {
    let results = newVenues;
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
      if (capacity === 201) {
        results = results.filter(venue => venue.capacity >= 200);
      } else {
        results = results.filter(venue => venue.capacity <= capacity);
      }
    }
    setFilteredVenues(results);
  }, [searchTerm, selectedVenueType, selectedCapacity]);
  const handleVenueClick = (venueId: string) => {
    navigateTo(`/book-it/venues/${venueId}`);
  };
  // Calculate days since opening
  const getDaysSinceOpening = (dateString: string) => {
    const today = new Date();
    const openDate = new Date(dateString);
    const diffTime = Math.abs(today.getTime() - openDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
            <span className="text-gray-900 font-medium">New Venues</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center justify-center md:justify-start">
            <BuildingIcon className="h-10 w-10 mr-4" />
            <h1 className="text-3xl md:text-4xl font-bold">New Venues</h1>
          </div>
          <p className="mt-4 text-green-100 text-lg max-w-3xl">
            Be among the first to discover and book these recently opened
            venues. Get special introductory rates and availability.
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
              <input type="text" placeholder="Search new venues..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="mt-3 md:mt-0 flex items-center">
              <button onClick={() => setIsFiltersVisible(!isFiltersVisible)} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
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
                <select id="venue-type" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md" value={selectedVenueType || 'All Types'} onChange={e => setSelectedVenueType(e.target.value === 'All Types' ? null : e.target.value)}>
                  {venueTypes.map(type => <option key={type} value={type}>
                      {type}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <select id="capacity" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md" value={selectedCapacity || ''} onChange={e => setSelectedCapacity(e.target.value || null)}>
                  {capacityOptions.map(option => <option key={option.label} value={option.value || ''}>
                      {option.label}
                    </option>)}
                </select>
              </div>
            </div>}
        </div>
      </div>

      {/* New Venues List */}
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
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Clear all filters
              </button>
            </div>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map(venue => <div key={venue.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleVenueClick(venue.id)}>
                <div className="relative h-48">
                  <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 mt-2 mr-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      New • {getDaysSinceOpening(venue.openedDate)} days ago
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
                    <div className="flex items-center text-sm font-medium text-green-600">
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

      {/* Benefits of New Venues Section */}
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Why Book New Venues?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the advantages of being among the first to book these
              newly opened spaces.
            </p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow px-5 py-6 text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Better Availability
              </h3>
              <p className="mt-2 text-base text-gray-500">
                New venues typically have more open dates, including prime
                weekend slots.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow px-5 py-6 text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Introductory Rates
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Many new venues offer special pricing to build their reputation
                and client base.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow px-5 py-6 text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Modern Amenities
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Recently opened venues often feature the latest technology and
                updated facilities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Looking for the perfect venue?</span>
            <span className="block text-green-600">
              Be among the first to experience these new spaces.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button onClick={() => navigateTo('/book-it/venues')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                Browse All Venues
              </button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <button onClick={() => navigateTo('/venues/submit')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50">
                Submit Your Venue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};