import React, { useState, Component } from 'react';
/**
 * Page: Book Performer Page
 * Type: CSR
 * Mockdata: OFF
 * Description: Find and book performers
 * Components: None
 */
import { SearchIcon, FilterIcon, MusicIcon, CalendarIcon, MapPinIcon, DollarSignIcon, StarIcon, UsersIcon, ArrowRightIcon, InstagramIcon, YoutubeIcon, ExternalLinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
// Mock performer data
const performers = [{
  id: 'performer-1',
  name: 'The Local Echoes',
  type: 'Band',
  genre: ['Indie Rock', 'Alternative'],
  image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  description: 'A dynamic indie rock band known for energetic performances and catchy original songs',
  location: 'Tampa, FL',
  priceRange: '$$',
  rating: 4.8,
  reviewCount: 32,
  memberCount: 4,
  experience: '5+ years',
  equipment: ['Full PA System', 'Instruments', 'Lighting'],
  socialMedia: {
    instagram: '@localechoes',
    youtube: 'LocalEchoesBand'
  },
  availability: ['Weekends', 'Evenings'],
  eventTypes: ['Concerts', 'Private Parties', 'Corporate Events'],
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
}, {
  id: 'performer-2',
  name: 'DJ Waves',
  type: 'DJ',
  genre: ['Electronic', 'House', 'Top 40'],
  image: 'https://images.unsplash.com/photo-1571266028243-5156d5e8c2a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  description: 'Versatile DJ with experience in clubs, weddings, and corporate events',
  location: 'St. Petersburg, FL',
  priceRange: '$$',
  rating: 4.9,
  reviewCount: 45,
  memberCount: 1,
  experience: '8+ years',
  equipment: ['Professional DJ Equipment', 'Speakers', 'Lighting'],
  socialMedia: {
    instagram: '@djwaves',
    youtube: 'DJWavesOfficial'
  },
  availability: ['Weekends', 'Weekdays'],
  eventTypes: ['Weddings', 'Clubs', 'Corporate Events', 'Private Parties'],
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
}, {
  id: 'performer-3',
  name: 'Acoustic Sunrise',
  type: 'Solo Artist',
  genre: ['Acoustic', 'Folk', 'Pop Covers'],
  image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  description: 'Solo acoustic guitarist and vocalist with a repertoire of over 200 songs',
  location: 'Clearwater, FL',
  priceRange: '$',
  rating: 4.7,
  reviewCount: 28,
  memberCount: 1,
  experience: '10+ years',
  equipment: ['Acoustic Guitar', 'Vocals', 'Small PA'],
  socialMedia: {
    instagram: '@acousticsunrise'
  },
  availability: ['Flexible'],
  eventTypes: ['Restaurants', 'Cafes', 'Private Events', 'Weddings'],
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
}, {
  id: 'performer-4',
  name: 'Brass Attack',
  type: 'Band',
  genre: ['Jazz', 'Funk', 'R&B'],
  image: 'https://images.unsplash.com/photo-1528569937393-ee892b976859?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  description: 'High-energy brass band bringing New Orleans style funk to any event',
  location: 'Tampa, FL',
  priceRange: '$$$',
  rating: 4.9,
  reviewCount: 37,
  memberCount: 6,
  experience: '12+ years',
  equipment: ['Brass Instruments', 'Percussion', 'Small PA'],
  socialMedia: {
    instagram: '@brassattack',
    youtube: 'BrassAttackOfficial'
  },
  availability: ['Weekends', 'Some Weekdays'],
  eventTypes: ['Festivals', 'Parades', 'Corporate Events', 'Private Parties'],
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
}, {
  id: 'performer-5',
  name: 'Classical Strings Quartet',
  type: 'Ensemble',
  genre: ['Classical', 'Contemporary'],
  image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  description: 'Elegant string quartet performing classical masterpieces and modern arrangements',
  location: 'St. Petersburg, FL',
  priceRange: '$$$',
  rating: 4.8,
  reviewCount: 22,
  memberCount: 4,
  experience: '15+ years',
  equipment: ['String Instruments'],
  socialMedia: {},
  availability: ['Weekends', 'Weekdays'],
  eventTypes: ['Weddings', 'Corporate Events', 'Receptions', 'Ceremonies'],
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
}, {
  id: 'performer-6',
  name: 'Comedy Crew',
  type: 'Comedy Group',
  genre: ['Stand-up', 'Improv'],
  image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  description: 'Hilarious comedy troupe specializing in customized performances for any event',
  location: 'Tampa, FL',
  priceRange: '$$',
  rating: 4.6,
  reviewCount: 19,
  memberCount: 5,
  experience: '7+ years',
  equipment: ['Microphones', 'Small PA'],
  socialMedia: {
    instagram: '@comedycrew'
  },
  availability: ['Evenings', 'Weekends'],
  eventTypes: ['Corporate Events', 'Private Parties', 'Fundraisers'],
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
}];
type FilterState = {
  performerType: string[];
  genre: string[];
  location: string[];
  priceRange: string[];
  memberCount: string[];
  eventType: string[];
};
export const BookPerformerPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    performerType: [],
    genre: [],
    location: [],
    priceRange: [],
    memberCount: [],
    eventType: []
  });
  // Filter performers based on search term and filters
  const filteredPerformers = performers.filter(performer => {
    // Search term filter
    if (searchTerm && !performer.name.toLowerCase().includes(searchTerm.toLowerCase()) && !performer.description.toLowerCase().includes(searchTerm.toLowerCase()) && !performer.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    // Filter by performer type if any selected
    if (filters.performerType.length > 0 && !filters.performerType.includes(performer.type)) {
      return false;
    }
    // Filter by genre
    if (filters.genre.length > 0) {
      const genreMatch = filters.genre.some(g => performer.genre.some(pg => pg.includes(g)));
      if (!genreMatch) return false;
    }
    // Filter by location
    if (filters.location.length > 0 && !filters.location.includes(performer.location)) {
      return false;
    }
    // Filter by price range
    if (filters.priceRange.length > 0 && !filters.priceRange.includes(performer.priceRange)) {
      return false;
    }
    // Filter by member count
    if (filters.memberCount.length > 0) {
      const memberCountMatch = filters.memberCount.some(count => {
        if (count === 'solo' && performer.memberCount === 1) return true;
        if (count === 'duo' && performer.memberCount === 2) return true;
        if (count === 'small' && performer.memberCount >= 3 && performer.memberCount <= 4) return true;
        if (count === 'large' && performer.memberCount >= 5) return true;
        return false;
      });
      if (!memberCountMatch) return false;
    }
    // Filter by event type
    if (filters.eventType.length > 0) {
      const eventTypeMatch = filters.eventType.some(type => performer.eventTypes.includes(type));
      if (!eventTypeMatch) return false;
    }
    return true;
  });
  // Sort performers
  const sortedPerformers = [...filteredPerformers].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.priceRange.length - b.priceRange.length;
    } else if (sortBy === 'price-high') {
      return b.priceRange.length - a.priceRange.length;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'experience-high') {
      return parseInt(b.experience) - parseInt(a.experience);
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
      performerType: [],
      genre: [],
      location: [],
      priceRange: [],
      memberCount: [],
      eventType: []
    });
    setSearchTerm('');
    setDateRange('');
  };
  const handleViewPerformer = (performerId: string) => {
    navigate(`/performers/${performerId}`);
  };
  // Count active filters
  const activeFilterCount = Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  return <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Find the Perfect Performer
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-purple-100">
              Discover and book talented musicians, DJs, and entertainers
            </p>
          </div>
          {/* Search Form */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Search performers by name, genre, or description" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Event Date" value={dateRange} onChange={e => setDateRange(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700" onClick={() => setShowFilters(!showFilters)}>
                      <FilterIcon className="h-5 w-5 mr-2" />
                      Filters{' '}
                      {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </button>
                  </div>
                  <div>
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700" onClick={() => {
                    // In a real app, this would apply the search and filters
                    console.log('Search applied', {
                      searchTerm,
                      dateRange,
                      filters
                    });
                  }}>
                      Search Performers
                    </button>
                  </div>
                </div>
                {/* Filter Panel */}
                {showFilters && <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Performer Type
                        </h3>
                        <div className="space-y-2">
                          {['Band', 'DJ', 'Solo Artist', 'Ensemble', 'Comedy Group'].map(type => <div key={type} className="flex items-center">
                              <input id={`type-${type}`} name="performerType" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={filters.performerType.includes(type)} onChange={() => toggleFilter('performerType', type)} />
                              <label htmlFor={`type-${type}`} className="ml-3 text-sm text-gray-700">
                                {type}
                              </label>
                            </div>)}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mt-4 mb-2">
                          Genre
                        </h3>
                        <div className="space-y-2">
                          {['Rock', 'Jazz', 'Electronic', 'Classical', 'Folk', 'Pop', 'R&B', 'Hip Hop', 'Country'].map(genre => <div key={genre} className="flex items-center">
                              <input id={`genre-${genre}`} name="genre" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={filters.genre.includes(genre)} onChange={() => toggleFilter('genre', genre)} />
                              <label htmlFor={`genre-${genre}`} className="ml-3 text-sm text-gray-700">
                                {genre}
                              </label>
                            </div>)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Location
                        </h3>
                        <div className="space-y-2">
                          {['Tampa, FL', 'St. Petersburg, FL', 'Clearwater, FL'].map(location => <div key={location} className="flex items-center">
                              <input id={`location-${location}`} name="location" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={filters.location.includes(location)} onChange={() => toggleFilter('location', location)} />
                              <label htmlFor={`location-${location}`} className="ml-3 text-sm text-gray-700">
                                {location}
                              </label>
                            </div>)}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mt-4 mb-2">
                          Price Range
                        </h3>
                        <div className="space-y-2">
                          {['$', '$$', '$$$'].map(price => <div key={price} className="flex items-center">
                              <input id={`price-${price}`} name="price" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={filters.priceRange.includes(price)} onChange={() => toggleFilter('priceRange', price)} />
                              <label htmlFor={`price-${price}`} className="ml-3 text-sm text-gray-700">
                                {price}
                              </label>
                            </div>)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Size
                        </h3>
                        <div className="space-y-2">
                          {[{
                        id: 'solo',
                        label: 'Solo (1 person)'
                      }, {
                        id: 'duo',
                        label: 'Duo (2 people)'
                      }, {
                        id: 'small',
                        label: 'Small Group (3-4 people)'
                      }, {
                        id: 'large',
                        label: 'Large Group (5+ people)'
                      }].map(option => <div key={option.id} className="flex items-center">
                              <input id={`size-${option.id}`} name="memberCount" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={filters.memberCount.includes(option.id)} onChange={() => toggleFilter('memberCount', option.id)} />
                              <label htmlFor={`size-${option.id}`} className="ml-3 text-sm text-gray-700">
                                {option.label}
                              </label>
                            </div>)}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mt-4 mb-2">
                          Event Type
                        </h3>
                        <div className="space-y-2">
                          {['Weddings', 'Corporate Events', 'Private Parties', 'Concerts', 'Festivals', 'Clubs', 'Restaurants'].map(type => <div key={type} className="flex items-center">
                              <input id={`event-${type}`} name="eventType" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={filters.eventType.includes(type)} onChange={() => toggleFilter('eventType', type)} />
                              <label htmlFor={`event-${type}`} className="ml-3 text-sm text-gray-700">
                                {type}
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
              {sortedPerformers.length}{' '}
              {sortedPerformers.length === 1 ? 'Performer' : 'Performers'}{' '}
              Available
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeFilterCount > 0 ? `Filtered by ${activeFilterCount} ${activeFilterCount === 1 ? 'criteria' : 'criteria'}` : 'Showing all performers'}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
                Sort by:
              </label>
              <select id="sort" name="sort" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="experience-high">Most Experienced</option>
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
        {/* Performer Results */}
        {sortedPerformers.length === 0 ? <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <MusicIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No performers found
            </h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any performers matching your criteria. Try
              adjusting your filters or search terms.
            </p>
            <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200" onClick={clearFilters}>
              Clear all filters
            </button>
          </div> : viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPerformers.map(performer => <div key={performer.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                <div className="h-48 overflow-hidden relative">
                  <img src={performer.image} alt={performer.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  <div className="absolute top-0 right-0 m-2">
                    <div className="flex items-center bg-purple-100 px-2 py-1 rounded text-sm text-purple-800">
                      <span className="font-bold">{performer.rating}</span>
                      <StarIcon className="h-4 w-4 text-yellow-500 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {performer.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">
                        {performer.location}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MusicIcon className="h-4 w-4 mr-1" />
                    <span>{performer.type}</span>
                    <span className="mx-2">•</span>
                    <span>{performer.genre.join(', ')}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 flex-1">
                    {performer.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {performer.eventTypes.slice(0, 3).map(type => <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {type}
                      </span>)}
                    {performer.eventTypes.length > 3 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{performer.eventTypes.length - 3}
                      </span>}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-700">
                          {performer.memberCount}{' '}
                          {performer.memberCount === 1 ? 'member' : 'members'}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {performer.priceRange}
                      </div>
                    </div>
                    <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" onClick={() => handleViewPerformer(performer.id)}>
                      View Profile
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>)}
          </div> : <div className="space-y-4">
            {sortedPerformers.map(performer => <div key={performer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                    <img src={performer.image} alt={performer.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 md:p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {performer.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-500">
                            {performer.location}
                          </span>
                          <span className="mx-2">•</span>
                          <MusicIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-500">
                            {performer.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-purple-100 px-2 py-1 rounded text-sm text-purple-800 flex items-center">
                          <span className="font-bold">{performer.rating}</span>
                          <StarIcon className="h-4 w-4 text-yellow-500 ml-1" />
                          <span className="text-gray-600 ml-1">
                            ({performer.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {performer.genre.map(g => <span key={g} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {g}
                        </span>)}
                    </div>
                    <p className="text-gray-600 mt-2">
                      {performer.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {performer.eventTypes.map(type => <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {type}
                        </span>)}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between">
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-700">
                            {performer.memberCount}{' '}
                            {performer.memberCount === 1 ? 'member' : 'members'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSignIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {performer.priceRange}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-700">
                            {performer.experience} experience
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4 md:mt-0">
                        {performer.socialMedia.instagram && <a href="#" className="text-gray-400 hover:text-pink-600" title="Instagram">
                            <InstagramIcon className="h-5 w-5" />
                          </a>}
                        {performer.socialMedia.youtube && <a href="#" className="text-gray-400 hover:text-red-600" title="YouTube">
                            <YoutubeIcon className="h-5 w-5" />
                          </a>}
                        <a href="#" className="text-gray-400 hover:text-blue-600" title="Website">
                          <ExternalLinkIcon className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" onClick={() => handleViewPerformer(performer.id)}>
                        View Profile
                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
      {/* Need Help Section */}
      <div className="bg-purple-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Need Help Finding the Perfect Performer?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our talent specialists can help you find the perfect performer for
              your event based on your specific requirements.
            </p>
            <div className="mt-6">
              <button type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" onClick={() => navigate('/book/start')}>
                Get Personalized Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};