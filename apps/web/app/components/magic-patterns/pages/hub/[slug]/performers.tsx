import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigationContext } from '../../../context/NavigationContext';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { DirectoryFilters } from '../../../components/hub/directory/DirectoryFilters';
import { DirectoryCard } from '../../../components/hub/directory/DirectoryCard';
import { mockPerformers } from '../../../mockdata/performers';
import { ArrowLeftIcon, PlusIcon, SearchIcon, FilterIcon, GridIcon, LayoutIcon, MusicIcon, UsersIcon } from 'lucide-react';
export default function HubPerformersPage() {
  const {
    slug
  } = useParams();
  const {
    navigateTo
  } = useNavigationContext();
  const [isLoading, setIsLoading] = useState(true);
  const [hubData, setHubData] = useState<any>(null);
  const [performers, setPerformers] = useState<any[]>([]);
  const [filteredPerformers, setFilteredPerformers] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genres: [],
    location: '',
    availability: null,
    priceRange: null,
    memberRecommended: false,
    rating: null,
    hasUpcomingEvents: false
  });
  // Fetch hub data and performers
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
        locations: ['New York, NY', 'Chicago, IL', 'New Orleans, LA', 'San Francisco, CA', 'Austin, TX', 'Online']
      };
      // Filter performers relevant to this hub
      let relevantPerformers = [];
      if (slug === 'jazz-lovers') {
        // Filter for jazz-related performers
        relevantPerformers = mockPerformers.filter(performer => performer.genres.some(genre => ['Jazz/Blues', 'Soul', 'Funk', 'World Music'].includes(genre)));
        // Add hub-specific badges to performers
        relevantPerformers = relevantPerformers.map(performer => ({
          ...performer,
          hubBadges: getHubBadges(performer, 'jazz-lovers')
        }));
      } else {
        // For other hubs, just use a subset of performers
        relevantPerformers = mockPerformers.slice(0, 12).map(performer => ({
          ...performer,
          hubBadges: getHubBadges(performer, slug as string)
        }));
      }
      setHubData(mockHubData);
      setPerformers(relevantPerformers);
      setFilteredPerformers(relevantPerformers);
      setIsLoading(false);
    }, 1000);
  }, [slug]);
  // Filter performers based on selected filters
  useEffect(() => {
    if (!performers.length) return;
    const filtered = performers.filter(performer => {
      // Filter by search query
      const matchesSearch = !searchQuery || performer.name.toLowerCase().includes(searchQuery.toLowerCase()) || performer.bio.toLowerCase().includes(searchQuery.toLowerCase()) || performer.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()));
      // Filter by genres
      const matchesGenres = !filters.genres.length || filters.genres.some(genre => performer.genres.includes(genre));
      // Filter by location
      const matchesLocation = !filters.location || performer.homeCity.toLowerCase().includes(filters.location.toLowerCase());
      // Filter by availability
      const matchesAvailability = !filters.availability || filters.availability === 'booking' && performer.availableForBooking || filters.availability === 'touring' && performer.isTouringNow;
      // Filter by price range (simplified for demo)
      const matchesPriceRange = !filters.priceRange || filters.priceRange === 'budget' && performer.introductoryPricing || filters.priceRange === 'premium' && !performer.introductoryPricing;
      // Filter by member recommended (using trendingScore as proxy)
      const matchesRecommended = !filters.memberRecommended || performer.trendingScore > 80;
      // Filter by rating
      const matchesRating = !filters.rating || performer.rating >= filters.rating;
      // Filter by upcoming events
      const matchesUpcomingEvents = !filters.hasUpcomingEvents || performer.upcomingShows && performer.upcomingShows.length > 0;
      return matchesSearch && matchesGenres && matchesLocation && matchesAvailability && matchesPriceRange && matchesRecommended && matchesRating && matchesUpcomingEvents;
    });
    setFilteredPerformers(filtered);
  }, [filters, searchQuery, performers]);
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
      genres: [],
      location: '',
      availability: null,
      priceRange: null,
      memberRecommended: false,
      rating: null,
      hasUpcomingEvents: false
    });
    setSearchQuery('');
  };
  // Submit new performer listing
  const handleSubmitListing = () => {
    navigateTo(`/hub/${slug}/submit-performer`);
  };
  // Helper function to get hub-specific badges for performers
  function getHubBadges(performer: any, hubSlug: string) {
    const badges = [];
    if (hubSlug === 'jazz-lovers') {
      // Jazz-specific badges
      if (performer.genres.includes('Jazz/Blues')) {
        badges.push('Jazz Performer');
      }
      if (performer.yearsActive > 10) {
        badges.push('Veteran');
      }
      if (performer.rating >= 4.8) {
        badges.push('Top Rated');
      }
      if (performer.trendingScore > 85) {
        badges.push('Community Favorite');
      }
    } else {
      // Generic badges
      if (performer.rating >= 4.8) {
        badges.push('Highly Rated');
      }
      if (performer.trendingScore > 80) {
        badges.push('Trending');
      }
      if (performer.availableForPrivateEvents) {
        badges.push('Available for Events');
      }
    }
    return badges;
  }
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hub Header */}
        <div className="bg-gray-900 text-white relative" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${hubData?.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-4">
              <button onClick={() => navigateTo(`/hubs/${slug}`)} className="flex items-center text-white/80 hover:text-white">
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Hub
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {hubData.name} - Performers
                </h1>
                <p className="mt-2 text-white/80 max-w-2xl">
                  Discover talented performers in the{' '}
                  {hubData.name.toLowerCase()} community.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button onClick={handleSubmitListing} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Submit Performer
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
                <input type="text" placeholder="Search performers..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                <DirectoryFilters type="performers" hubData={hubData} filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
              </div>}
          </div>
          {/* Performers Count */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredPerformers.length} Performer
              {filteredPerformers.length !== 1 ? 's' : ''}
            </h2>
            {filteredPerformers.length !== performers.length && <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800">
                Clear all filters
              </button>}
          </div>
          {/* Performers Grid/List */}
          {filteredPerformers.length === 0 ? <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <MusicIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No performers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                We couldn't find any performers matching your criteria. Try
                adjusting your filters or search term.
              </p>
              <div className="mt-6">
                <button onClick={clearFilters} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Clear all filters
                </button>
              </div>
            </div> : <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredPerformers.map(performer => <DirectoryCard key={performer.id} item={performer} type="performer" viewMode={viewMode} hubSlug={slug as string} onView={() => navigateTo(`/performers/${performer.id}`)} onFollow={() => {
            // Handle follow action
            console.log(`Following performer: ${performer.id}`);
          }} />)}
            </div>}
        </div>
      </div>
      <Footer />
    </>;
}