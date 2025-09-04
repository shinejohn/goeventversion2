import React, { useEffect, useState } from 'react';
import { ArrowRightIcon, MapPinIcon, StarIcon, CalendarIcon, SearchIcon, GridIcon, ListIcon, MapIcon, SlidersIcon, XIcon, CheckCircleIcon, FilterIcon, TicketIcon, ClockIcon, MusicIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { FilterSidebar } from '../components/venue-marketplace/FilterSidebar';
import { VenueCard } from '../components/venue-marketplace/VenueCard';
import { VenueListItem } from '../components/venue-marketplace/VenueListItem';
import { VenueMap } from '../components/venue-marketplace/VenueMap';

type ViewMode = 'grid' | 'list' | 'map';
type SortOption = 'recommended' | 'popular' | 'newest' | 'price_low' | 'price_high' | 'distance' | 'rating' | 'capacity';

interface VenueData {
  id: string;
  name: string;
  description: string | null;
  address: string;
  capacity: number | null;
  images: any;
  amenities: any;
  average_rating: number | null;
  total_reviews: number | null;
  slug: string;
  community_id: string;
  account_id: string | null;
  venue_type: string;
  price_per_hour: number | null;
  distance: number | null;
  listed_date: string | null;
  last_booked_days_ago: number | null;
  unavailable_dates: string[] | null;
  image_url: string | null;
  city: string | null;
  verified: boolean;
  // Add other fields as needed
}

export const VenuesPage = ({ venues }: { venues?: VenueData[] }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCollectionPopup, setShowCollectionPopup] = useState<string | null>(null);
  const [filters, setFilters] = useState({
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
  // Use provided venues (required prop)
  const venuesData = venues || [];
  
  useEffect(() => {
    console.log('VenuesPage received venues:', venues?.length || 0, 'venues');
    if (venues && venues.length > 0) {
      console.log('First venue:', venues[0]);
    }
  }, [venues]);
  
  // Filtered venues based on search and filters
  const filteredVenues = venuesData.filter(venue => {
    // Simple search implementation - in a real app this would be more sophisticated
    if (searchQuery && !venue.name.toLowerCase().includes(searchQuery.toLowerCase()) && !(venue.description || '').toLowerCase().includes(searchQuery.toLowerCase()) && !(venue.venue_type || '').toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Filter by venue type
    if (filters.venueTypes.length > 0 && !filters.venueTypes.includes(venue.venue_type)) {
      return false;
    }
    // Filter by capacity
    if (venue.capacity && (venue.capacity < filters.minCapacity || venue.capacity > filters.maxCapacity)) {
      return false;
    }
    // Filter by price
    if (venue.price_per_hour && (venue.price_per_hour < filters.minPrice || venue.price_per_hour > filters.maxPrice)) {
      return false;
    }
    // Filter by amenities
    if (filters.amenities.length > 0 && venue.amenities) {
      const amenitiesArray = Array.isArray(venue.amenities) ? venue.amenities : [];
      const hasAllAmenities = filters.amenities.every(amenity => amenitiesArray.includes(amenity));
      if (!hasAllAmenities) return false;
    }
    // Filter by date availability
    if (selectedDate && venue.unavailable_dates) {
      const dateString = selectedDate.toISOString().split('T')[0];
      if (venue.unavailable_dates.includes(dateString)) {
        return false;
      }
    }
    return true;
  });
  // Sort venues based on selected sort option
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.total_reviews || 0) - (a.total_reviews || 0);
      case 'newest':
        return new Date(b.listed_date || 0).getTime() - new Date(a.listed_date || 0).getTime();
      case 'price_low':
        return (a.price_per_hour || 0) - (b.price_per_hour || 0);
      case 'price_high':
        return (b.price_per_hour || 0) - (a.price_per_hour || 0);
      case 'distance':
        return (a.distance || 0) - (b.distance || 0);
      case 'rating':
        return (b.average_rating || 0) - (a.average_rating || 0);
      case 'capacity':
        return (a.capacity || 0) - (b.capacity || 0);
      default:
        // For 'recommended', use a combination of rating and review count
        return (b.average_rating || 0) * 0.7 + (b.total_reviews || 0) * 0.3 - ((a.average_rating || 0) * 0.7 + (a.total_reviews || 0) * 0.3);
    }
  });
  // Get trending venues (highest review count in the last month)
  const trendingVenues = [...venuesData].sort((a, b) => {
    const aScore = (b.total_reviews || 0) / Math.max(b.last_booked_days_ago || 30, 1);
    const bScore = (a.total_reviews || 0) / Math.max(a.last_booked_days_ago || 30, 1);
    return aScore - bScore;
  }).slice(0, 4);
  // Get new venues (added in the last 90 days)
  const newVenues = venuesData.filter(venue => {
    if (!venue.listed_date) return false;
    const listedDate = new Date(venue.listed_date);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return listedDate > ninetyDaysAgo;
  }).slice(0, 4);
  // TODO: Load real upcoming events from database
  const upcomingEvents = [];
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({
      ...filters,
      ...newFilters
    });
  };
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this might trigger an API call
    console.log('Searching for:', searchQuery);
  };
  // Venue type categories with counts
  const venueCategories = [{
    title: 'Music Venues',
    count: venuesData.filter(v => v.venue_type === 'Concert Halls').length
  }, {
    title: 'Restaurants & Bars',
    count: venuesData.filter(v => v.venue_type === 'Restaurants & Bars').length
  }, {
    title: 'Event Spaces',
    count: venuesData.filter(v => v.venue_type === 'Event Spaces').length
  }, {
    title: 'Outdoor Venues',
    count: venuesData.filter(v => v.venue_type === 'Outdoor Venues').length
  }, {
    title: 'Galleries & Museums',
    count: venuesData.filter(v => v.venue_type === 'Galleries & Museums').length
  }, {
    title: 'Unique Spaces',
    count: venuesData.filter(v => v.venue_type === 'Unique Spaces').length
  }];
  // Handle navigation to venue detail
  const handleViewVenueDetail = (venueId: string) => {
    navigate(`/venues/${venueId}`);
  };
  // Handle navigation to venue collections
  const handleNavigateToCollection = (collectionPath: string) => {
    // Show collection popup for now (in a real app, we'd navigate)
    setShowCollectionPopup(collectionPath);
  };
  // Handle venue submission form navigation
  const handleListVenue = () => {
    navigate('/venues/submit');
  };
  // Handle venue management navigation
  const handleVenueManagement = () => {
    navigate('/venues/management');
  };
  // Handle trending venues navigation
  const handleViewAllTrending = () => {
    navigate('/venues/trending');
  };
  // Handle new venues navigation
  const handleViewAllNew = () => {
    navigate('/venues/new');
  };
  // Handle event detail navigation
  const handleViewEventDetail = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };
  return <div className="min-h-screen bg-white">
      {/* Search Bar - Replacing the hero section */}
      <div className="bg-gray-50 py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
              <div className="text-sm text-gray-500 flex items-center gap-3">
                <div>
                  <span className="font-semibold">{venuesData.length}</span>{' '}
                  Venues
                </div>
                <div>
                  <span className="font-semibold">427</span> Events This Week
                </div>
                <div>
                  <span className="font-semibold">{newVenues.length}</span> New
                  Venues
                </div>
              </div>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <div className="flex shadow-sm">
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search for venues, events, or activities..." className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-l-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent" />
                </div>
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content - Remove Quick Stats Bar and adjust padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} selectedDate={selectedDate} onDateChange={setSelectedDate} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Sort & View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
              <div className="flex items-center w-full sm:w-auto">
                <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center mr-3 text-gray-700 hover:text-indigo-600">
                  <FilterIcon className="h-5 w-5 mr-1" />
                  <span>Filters</span>
                </button>
                <div className="relative flex-grow sm:flex-grow-0">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} className="block w-full pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
                    <option value="popular">Most Popular</option>
                    <option value="recommended">Recommended</option>
                    <option value="newest">Newest Venues</option>
                    <option value="distance">Distance: Nearest</option>
                    <option value="rating">Rating: Highest</option>
                    <option value="capacity">Capacity: Largest</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="text-sm text-gray-500">
                  {filteredVenues.length}{' '}
                  {filteredVenues.length === 1 ? 'venue' : 'venues'} found
                </div>
                <div className="flex ml-4 border border-gray-300 rounded-md overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-500 hover:text-gray-700'}`} aria-label="Grid view">
                    <GridIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-500 hover:text-gray-700'}`} aria-label="List view">
                    <ListIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode('map')} className={`p-1.5 ${viewMode === 'map' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-500 hover:text-gray-700'}`} aria-label="Map view">
                    <MapIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Applied Filters */}
            {(filters.venueTypes.length > 0 || filters.amenities.length > 0 || selectedDate) && <div className="flex flex-wrap gap-2 mb-6">
                {filters.venueTypes.map(type => <div key={type} className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {type}
                    <button onClick={() => handleFilterChange({
                venueTypes: filters.venueTypes.filter(t => t !== type)
              })} className="ml-1 text-indigo-400 hover:text-indigo-600">
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>)}
                {filters.amenities.map(amenity => <div key={amenity} className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {amenity}
                    <button onClick={() => handleFilterChange({
                amenities: filters.amenities.filter(a => a !== amenity)
              })} className="ml-1 text-indigo-400 hover:text-indigo-600">
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>)}
                {selectedDate && <div className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    Events on {selectedDate.toLocaleDateString()}
                    <button onClick={() => setSelectedDate(null)} className="ml-1 text-indigo-400 hover:text-indigo-600">
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>}
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
              setSelectedDate(null);
            }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Clear all filters
                </button>
              </div>}

            {/* Upcoming Events Section */}
            {searchQuery === '' && !selectedDate && filters.venueTypes.length === 0 && <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Upcoming Events at Popular Venues
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingEvents.map(event => <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewEventDetail(event.id)}>
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-40 h-32 sm:h-full relative">
                            <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {event.date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                              <span className="mx-1">•</span>
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {event.date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                            </div>
                            <h3 className="font-bold text-gray-900">
                              {event.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.venue.name}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <MusicIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">
                                  {event.venue.venue_type}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900 mr-2">
                                  {event.ticketPrice}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${event.ticketStatus === 'Available' ? 'bg-green-100 text-green-800' : event.ticketStatus === 'Selling Fast' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {event.ticketStatus}
                                </span>
                              </div>
                            </div>
                            <button onClick={e => {
                      e.stopPropagation();
                      handleViewEventDetail(event.id);
                    }} className="mt-3 text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 inline-flex items-center">
                              <TicketIcon className="h-3 w-3 mr-1" />
                              Get Tickets
                            </button>
                          </div>
                        </div>
                      </div>)}
                  </div>
                  <div className="mt-4 text-center">
                    <button onClick={() => navigate('/events')} className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                      View all upcoming events
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </section>}

            {/* Venues Display */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Popular Venues
              </h2>
              {filteredVenues.length > 0 ? <>
                  {viewMode === 'grid' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedVenues.map(venue => <VenueCard key={venue.id} venue={venue} selectedDate={selectedDate} onViewDetails={() => handleViewVenueDetail(venue.id)} />)}
                    </div>}
                  {viewMode === 'list' && <div className="space-y-4">
                      {sortedVenues.map(venue => <VenueListItem key={venue.id} venue={venue} selectedDate={selectedDate} onViewDetails={() => handleViewVenueDetail(venue.id)} />)}
                    </div>}
                  {viewMode === 'map' && <div className="h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                      <VenueMap venues={sortedVenues} onVenueSelect={venueId => handleViewVenueDetail(venueId)} />
                    </div>}
                </> : <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <SlidersIcon className="h-12 w-12" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No venues found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria
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
                  setSelectedDate(null);
                  setSearchQuery('');
                }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Reset all filters
                    </button>
                  </div>
                </div>}
            </section>

            {/* Discovery Sections */}
            {searchQuery === '' && filters.venueTypes.length === 0 && filters.amenities.length === 0 && !selectedDate && <div className="mt-16 space-y-16">
                  {/* Trending Venues */}
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <div className="h-6 w-6 text-orange-500 mr-2" />
                        Trending Venues
                      </h2>
                      <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium" onClick={handleViewAllTrending}>
                        View all trending
                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {trendingVenues.map((venue, index) => <div key={venue.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer relative" onClick={() => handleViewVenueDetail(venue.id)}>
                          <div className="absolute top-2 left-2 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <div className="h-3 w-3 mr-1" />
                            Trending #{index + 1}
                          </div>
                          <div className="h-40 overflow-hidden">
                            <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                              {venue.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {venue.location.neighborhood}
                            </div>
                            <div className="flex items-center mt-2">
                              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 font-medium">
                                {venue.average_rating}
                              </span>
                              <span className="ml-1 text-gray-500">
                                ({venue.total_reviews})
                              </span>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </section>

                  {/* New Venues */}
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        New Venues
                      </h2>
                      <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium" onClick={handleViewAllNew}>
                        View all new venues
                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {newVenues.map(venue => <div key={venue.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer relative" onClick={() => handleViewVenueDetail(venue.id)}>
                          <div className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            New Venue
                          </div>
                          <div className="h-40 overflow-hidden">
                            <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                              {venue.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {venue.location.neighborhood}
                            </div>
                            <div className="flex items-center mt-2 text-sm text-green-600 font-medium">
                              Just added{' '}
                              {new Date(venue.listed_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </section>

                  {/* Perfect For... */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Explore Venues By Type
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[{
                  title: 'Live Music Venues',
                  image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                  path: '/venues/collections/live-music'
                }, {
                  title: 'Comedy Clubs',
                  image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                  path: '/venues/collections/comedy'
                }, {
                  title: 'Art Galleries',
                  image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                  path: '/venues/collections/galleries'
                }, {
                  title: 'Theaters & Performing Arts',
                  image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                  path: '/venues/collections/theaters'
                }, {
                  title: 'Nightlife & Clubs',
                  image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                  path: '/venues/collections/nightlife'
                }, {
                  title: 'Outdoor Event Spaces',
                  image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                  path: '/venues/collections/outdoor'
                }].map((collection, index) => <div key={index} className="group relative h-48 rounded-lg overflow-hidden shadow-md cursor-pointer" onClick={() => handleNavigateToCollection(collection.path)}>
                          <img src={collection.image} alt={collection.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-xl">
                              {collection.title}
                            </h3>
                            <div className="flex items-center mt-1 text-white/90 text-sm">
                              <span>Find events</span>
                              <ArrowRightIcon className="ml-1 h-3 w-3" />
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </section>
                </div>}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {showFilters && <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowFilters(false)}></div>
          <div className="relative w-full max-w-xs p-4 h-full bg-white overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-500">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button onClick={() => setShowFilters(false)} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700">
                Apply Filters
              </button>
            </div>
          </div>
        </div>}

      {/* CTA Section */}
      <div className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Own or manage a venue?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            List your venue on When's The Fun to connect with event-goers and
            increase your visibility
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm" onClick={handleListVenue}>
              List Your Venue
            </button>
            <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-md shadow-sm border border-gray-300" onClick={handleVenueManagement}>
              Venue Management
            </button>
          </div>
        </div>
      </div>

      {/* Collection Popup */}
      {showCollectionPopup && <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowCollectionPopup(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Collection:{' '}
                    {showCollectionPopup.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This collection would show venues specifically for{' '}
                      {showCollectionPopup.split('/').pop()?.replace(/-/g, ' ')}
                      . In a complete implementation, this would navigate to a
                      dedicated page for this collection.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm" onClick={() => setShowCollectionPopup(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};