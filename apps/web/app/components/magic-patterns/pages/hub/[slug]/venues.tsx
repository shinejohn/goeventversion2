import React, { useEffect, useState } from 'react';
import { useRouter } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { DirectoryFilters } from '../../../components/hub/directory/DirectoryFilters';
import { DirectoryCard } from '../../../components/hub/directory/DirectoryCard';
import { mockVenues } from '../../../mockdata/venues';
import { ArrowLeftIcon, PlusIcon, SearchIcon, FilterIcon, GridIcon, LayoutIcon, BuildingIcon } from 'lucide-react';
export default function HubVenuesPage() {
  const router = useRouter();
  const {
    slug
  } = router.params || {};
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hubData, setHubData] = useState<any>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    venueTypes: [],
    location: '',
    capacity: null,
    priceRange: null,
    memberRecommended: false,
    rating: null,
    amenities: []
  });
  // Fetch hub data and venues
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Mock hub data
      const mockHubData = {
        id: slug,
        name: slug === 'jazz-lovers' ? 'Jazz Lovers Collective' : 'Urban Gardeners Network',
        image: slug === 'jazz-lovers' ? 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' : 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        memberCount: slug === 'jazz-lovers' ? 3427 : 2156,
        categories: slug === 'jazz-lovers' ? ['music', 'arts', 'culture'] : ['lifestyle', 'hobbies'],
        subcategories: slug === 'jazz-lovers' ? ['Jazz Fusion', 'Bebop', 'Smooth Jazz', 'Big Band', 'Contemporary', 'Vocal Jazz', 'Latin Jazz'] : ['Indoor Plants', 'Vegetables', 'Herbs', 'Community Gardens', 'Container Gardening', 'Urban Farming'],
        description: slug === 'jazz-lovers' ? 'A community dedicated to sharing jazz events, discussing legendary artists, and connecting musicians with venues.' : 'Connect with fellow urban gardeners to share tips, organize seed swaps, and collaborate on community garden projects.',
        venueTypes: slug === 'jazz-lovers' ? ['Jazz Club', 'Concert Hall', 'Outdoor Stage', 'Restaurant', 'Bar', 'Theater', 'Community Center'] : ['Community Garden', 'Botanical Garden', 'Greenhouse', 'Urban Farm', 'Workshop Space', 'Educational Center'],
        locations: ['New York, NY', 'Chicago, IL', 'New Orleans, LA', 'San Francisco, CA', 'Austin, TX', 'Online']
      };
      // Generate more mock venues based on the hub
      const generatedVenues = generateMockVenues(mockHubData);
      setHubData(mockHubData);
      setVenues(generatedVenues);
      setFilteredVenues(generatedVenues);
      setIsLoading(false);
    }, 1000);
  }, [slug]);
  // Filter venues based on selected filters
  useEffect(() => {
    if (!venues.length) return;
    const filtered = venues.filter(venue => {
      // Filter by search query
      const matchesSearch = !searchQuery || venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || venue.description.toLowerCase().includes(searchQuery.toLowerCase()) || venue.venueType.toLowerCase().includes(searchQuery.toLowerCase());
      // Filter by venue types
      const matchesVenueTypes = !filters.venueTypes.length || filters.venueTypes.includes(venue.venueType);
      // Filter by location
      const matchesLocation = !filters.location || venue.location.address.toLowerCase().includes(filters.location.toLowerCase());
      // Filter by capacity
      const matchesCapacity = !filters.capacity || filters.capacity === 'small' && venue.capacity <= 100 || filters.capacity === 'medium' && venue.capacity > 100 && venue.capacity <= 300 || filters.capacity === 'large' && venue.capacity > 300;
      // Filter by price range
      const matchesPriceRange = !filters.priceRange || filters.priceRange === 'budget' && venue.pricePerHour < 200 || filters.priceRange === 'mid' && venue.pricePerHour >= 200 && venue.pricePerHour <= 500 || filters.priceRange === 'premium' && venue.pricePerHour > 500;
      // Filter by member recommended (using rating as proxy)
      const matchesRecommended = !filters.memberRecommended || venue.rating >= 4.7;
      // Filter by rating
      const matchesRating = !filters.rating || venue.rating >= filters.rating;
      // Filter by amenities
      const matchesAmenities = !filters.amenities.length || filters.amenities.every(amenity => venue.amenities.includes(amenity));
      return matchesSearch && matchesVenueTypes && matchesLocation && matchesCapacity && matchesPriceRange && matchesRecommended && matchesRating && matchesAmenities;
    });
    setFilteredVenues(filtered);
  }, [filters, searchQuery, venues]);
  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      venueTypes: [],
      location: '',
      capacity: null,
      priceRange: null,
      memberRecommended: false,
      rating: null,
      amenities: []
    });
    setSearchQuery('');
  };
  // Submit new venue listing
  const handleSubmitListing = () => {
    navigate(`/hub/${slug}/submit-venue`);
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Hub Header */}
      <div className="bg-gray-900 text-white relative" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${hubData.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-4">
            <button onClick={() => navigate(`/hubs/${slug}`)} className="flex items-center text-white/80 hover:text-white">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Hub
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{hubData.name} - Venues</h1>
              <p className="mt-2 text-white/80 max-w-2xl">
                Discover great venues for {hubData.name.toLowerCase()} events
                and gatherings.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button onClick={handleSubmitListing} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Submit Venue
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* View Toggle */}
            <div className="inline-flex rounded-md shadow-sm">
              <button type="button" className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${viewMode === 'grid' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => setViewMode('grid')}>
                <GridIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Grid</span>
              </button>
              <button type="button" className={`relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border ${viewMode === 'list' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => setViewMode('list')}>
                <LayoutIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">List</span>
              </button>
            </div>
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search venues..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            {/* Filter Toggle Button */}
            <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center px-3 py-2 border rounded-md ${showFilters ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
              <FilterIcon className="h-4 w-4 mr-2" />
              <span>Filters</span>
              {(Object.values(filters).some(val => Array.isArray(val) ? val.length > 0 : Boolean(val)) || searchQuery) && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Active
                </span>}
            </button>
          </div>
          {/* Filters */}
          {showFilters && <div className="mt-4 pt-4 border-t border-gray-200">
              <DirectoryFilters type="venues" hubData={hubData} filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
            </div>}
        </div>
        {/* Venues Count */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {filteredVenues.length} Venue
            {filteredVenues.length !== 1 ? 's' : ''}
          </h2>
          {filteredVenues.length !== venues.length && <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800">
              Clear all filters
            </button>}
        </div>
        {/* Venues Grid/List */}
        {filteredVenues.length === 0 ? <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <BuildingIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No venues found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find any venues matching your criteria. Try adjusting
              your filters or search term.
            </p>
            <div className="mt-6">
              <button onClick={clearFilters} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Clear all filters
              </button>
            </div>
          </div> : <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredVenues.map(venue => <DirectoryCard key={venue.id} item={venue} type="venue" viewMode={viewMode} hubSlug={slug as string} onView={() => navigate(`/venues/${venue.id}`)} onFollow={() => {
          // Handle follow action
          console.log(`Following venue: ${venue.id}`);
        }} />)}
          </div>}
      </div>
    </div>;
}
// Helper function to generate mock venues based on hub data
function generateMockVenues(hubData: any) {
  const baseVenue = mockVenues[0];
  const venues = [];
  const venueTypes = hubData.venueTypes || [];
  const locations = hubData.locations || [];
  // Generate 15 venues with variations
  for (let i = 0; i < 15; i++) {
    const venueType = venueTypes[Math.floor(Math.random() * venueTypes.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const capacity = Math.floor(Math.random() * 700) + 50;
    const pricePerHour = Math.floor(Math.random() * 800) + 100;
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 200) + 10;
    // Select random amenities based on venue type
    const possibleAmenities = ['Professional sound system', 'Stage lighting', 'Green room', 'Backstage area', 'Loading dock', 'Elevator access', 'Kitchen facilities', 'Bar setup', 'Tables and chairs', 'Projector and screen', 'Outdoor space', 'Parking', 'Wheelchair accessible', 'Wi-Fi', 'Climate controlled', 'Security staff', 'Storage space'];
    const amenitiesCount = Math.floor(Math.random() * 8) + 3;
    const shuffledAmenities = [...possibleAmenities].sort(() => 0.5 - Math.random());
    const selectedAmenities = shuffledAmenities.slice(0, amenitiesCount);
    // Generate random images based on venue type
    let images = [];
    if (hubData.id === 'jazz-lovers') {
      images = ['https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'];
    } else {
      images = ['https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'];
    }
    // Add hub-specific badges
    const hubBadges = [];
    if (Math.random() > 0.7) hubBadges.push('Member Favorite');
    if (rating > 4.7) hubBadges.push('Top Rated');
    if (Math.random() > 0.8) hubBadges.push('Community Verified');
    if (hubData.id === 'jazz-lovers' && venueType === 'Jazz Club') hubBadges.push('Authentic Jazz Venue');
    // Create the venue object
    venues.push({
      id: `venue-${i + 1}`,
      name: `${venueType} ${i + 1}`,
      description: `A ${venueType.toLowerCase()} perfect for ${hubData.name.toLowerCase()} events and gatherings.`,
      capacity: capacity,
      pricePerHour: pricePerHour,
      location: {
        address: `${Math.floor(Math.random() * 999) + 100} Main Street, ${location}`,
        coordinates: {
          lat: 27.965853 + (Math.random() - 0.5) * 0.1,
          lng: -82.800102 + (Math.random() - 0.5) * 0.1
        }
      },
      rating: parseFloat(rating),
      reviewCount: reviewCount,
      verified: Math.random() > 0.3,
      responseTimeHours: Math.floor(Math.random() * 24) + 1,
      images: images,
      amenities: selectedAmenities,
      venueType: venueType,
      upcomingEvents: Math.floor(Math.random() * 10),
      followersCount: Math.floor(Math.random() * 500) + 50,
      hubBadges: hubBadges
    });
  }
  return venues;
}