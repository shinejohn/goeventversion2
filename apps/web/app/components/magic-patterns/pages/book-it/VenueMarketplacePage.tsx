import React, { useEffect, useState } from 'react';
import { SearchIcon, CheckCircleIcon, GridIcon, ListIcon, MapIcon, ChevronDownIcon, FilterIcon, XIcon, HomeIcon, ChevronRightIcon } from 'lucide-react';
import { FilterSidebar } from '../../components/venue-marketplace/FilterSidebar';
import { VenueCard } from '../../components/venue-marketplace/VenueCard';
import { VenueListItem } from '../../components/venue-marketplace/VenueListItem';
import { MapView } from '../../components/venue-marketplace/MapView';
import { useNavigate } from 'react-router';
import { mockVenues } from '../../mockdata/venues';
type ViewMode = 'grid' | 'list' | 'map';
type SortOption = 'recommended' | 'price_low' | 'price_high' | 'distance' | 'capacity' | 'rating' | 'newest';

interface VenueMarketplacePageProps {
  venues?: any[];
}

export const VenueMarketplacePage = ({ venues: propVenues }: VenueMarketplacePageProps) => {
  const navigate = useNavigate();
  // State for filters, sorting, and view mode
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  // Use props if available, fallback to mock data
  const initialVenues = propVenues && propVenues.length > 0 ? propVenues : mockVenues;
  const [venues, setVenues] = useState(initialVenues);
  const [filteredVenues, setFilteredVenues] = useState(initialVenues);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState({
    venueTypes: [] as string[],
    minCapacity: 10,
    maxCapacity: 5000,
    minPrice: 50,
    maxPrice: 10000,
    amenities: [] as string[],
    location: {
      address: '',
      radius: 25,
      neighborhoods: [] as string[]
    },
    flexibleDates: false
  });
  // Effect to filter venues based on filters and search
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    const timer = setTimeout(() => {
      let results = [...initialVenues];
      // Apply search filter if exists
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(venue => venue.name.toLowerCase().includes(query) || venue.location.neighborhood.toLowerCase().includes(query) || venue.eventTypes.some(type => type.toLowerCase().includes(query)));
      }
      // Apply venue type filters
      if (filters.venueTypes.length > 0) {
        results = results.filter(venue => filters.venueTypes.some(type => venue.venueType === type));
      }
      // Apply capacity filter
      results = results.filter(venue => venue.capacity >= filters.minCapacity && venue.capacity <= filters.maxCapacity);
      // Apply price filter
      results = results.filter(venue => venue.pricePerHour >= filters.minPrice && venue.pricePerHour <= filters.maxPrice);
      // Apply amenities filter
      if (filters.amenities.length > 0) {
        results = results.filter(venue => filters.amenities.every(amenity => venue.amenities.includes(amenity)));
      }
      // Apply sort
      switch (sortOption) {
        case 'price_low':
          results.sort((a, b) => a.pricePerHour - b.pricePerHour);
          break;
        case 'price_high':
          results.sort((a, b) => b.pricePerHour - a.pricePerHour);
          break;
        case 'distance':
          results.sort((a, b) => a.distance - b.distance);
          break;
        case 'capacity':
          results.sort((a, b) => a.capacity - b.capacity);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          results.sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
          break;
        default:
          // Recommended - a combination of rating and relevance
          results.sort((a, b) => b.rating - a.rating);
      }
      setFilteredVenues(results);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filters, sortOption]);
  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters({
      ...filters,
      ...newFilters
    });
  };
  // Toggle sidebar on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Book a Venue Space
            </h1>
            <p className="mt-3 text-xl">
              Find the perfect space for your event from 500+ local venues
            </p>
            {/* Search Bar */}
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white focus:border-white text-gray-900" placeholder="Search by venue name, location, or event type..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white">
                    <FilterIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Stats Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="font-semibold text-indigo-600 mr-2">
                {mockVenues.length}
              </span>
              Venues Available
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-indigo-600 mr-2">127</span>
              Bookings This Month
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-indigo-600 mr-2">
                {mockVenues.filter(v => v.verified).length}
              </span>
              Verified Venues
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex text-sm text-gray-500">
          <button onClick={() => navigate('/')} className="hover:text-gray-700 flex items-center">
            <HomeIcon className="h-4 w-4 mr-1" />
            Home
          </button>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <button onClick={() => navigate('/book')} className="hover:text-gray-700">
            Book It
          </button>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">Venues</span>
        </nav>
      </div>
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Mobile Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button onClick={toggleFilters} className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              {showFilters ? <XIcon className="h-5 w-5 mr-2" /> : <FilterIcon className="h-5 w-5 mr-2" />}
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">
                Showing {filteredVenues.length} of {mockVenues.length} venues
              </span>
            </div>
          </div>
          {/* Filter Sidebar */}
          {(showFilters || !window.matchMedia('(max-width: 1024px)').matches) && <div className="lg:w-1/4 w-full">
              <FilterSidebar filters={filters} onFilterChange={handleFilterChange} selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>}
          {/* Main Content */}
          <div className="lg:w-3/4 w-full">
            {/* Sort and View Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={sortOption} onChange={e => setSortOption(e.target.value as SortOption)}>
                    <option value="recommended">Recommended</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="distance">Distance: Nearest First</option>
                    <option value="capacity">Capacity: Small to Large</option>
                    <option value="rating">Rating: Highest First</option>
                    <option value="newest">Newest Listings</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="hidden lg:flex items-center text-sm text-gray-500 mr-4">
                  <span>
                    Showing {filteredVenues.length} of {mockVenues.length}{' '}
                    venues
                  </span>
                </div>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`} onClick={() => setViewMode('grid')} title="Grid View">
                    <GridIcon className="h-5 w-5" />
                  </button>
                  <button className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`} onClick={() => setViewMode('list')} title="List View">
                    <ListIcon className="h-5 w-5" />
                  </button>
                  <button className={`p-2 ${viewMode === 'map' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`} onClick={() => setViewMode('map')} title="Map View">
                    <MapIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            {/* Venue Listings */}
            {isLoading ?
          // Skeleton loading state
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden h-80 animate-pulse">
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>)}
              </div> : filteredVenues.length > 0 ? viewMode === 'map' ? <MapView venues={filteredVenues} onVenueSelect={id => navigate(`/book-it/venues/${id}`)} /> : viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredVenues.map(venue => <VenueCard key={venue.id} venue={venue} selectedDate={selectedDate} onViewDetails={() => navigate(`/book-it/venues/${venue.id}`)} />)}
                </div> : <div className="space-y-6">
                  {filteredVenues.map(venue => <VenueListItem key={venue.id} venue={venue} selectedDate={selectedDate} onViewDetails={() => navigate(`/book-it/venues/${venue.id}`)} />)}
                </div> :
          // Empty state
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No venues found
                </h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your filters or search query to find more
                  venues.
                </p>
                <div className="mt-6">
                  <button onClick={() => {
                setFilters({
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
                setSearchQuery('');
              }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Reset all filters
                  </button>
                </div>
              </div>}
            {/* Pagination */}
            {filteredVenues.length > 0 && <div className="mt-8 flex justify-center">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Load more venues
                </button>
              </div>}
          </div>
        </div>
      </div>
      {/* Back to top button */}
      <button onClick={() => typeof window !== "undefined" && window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })} className="fixed bottom-6 right-6 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      {/* Help Button */}
      <button className="fixed bottom-20 right-6 p-2 bg-white text-indigo-600 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>;
};