import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { SearchIcon, FilterIcon, GridIcon, ListIcon, CalendarIcon, XIcon, ChevronDownIcon, MapPinIcon, TrendingUpIcon, UsersIcon, MusicIcon, StarIcon, HeartIcon, PlayIcon, CheckCircleIcon, SparklesIcon } from 'lucide-react';
import { ClientOnly } from '@kit/ui/client-only';
import { mockPerformers } from '../../mockdata/performers';
import { FilterSidebar } from '../../components/performers/FilterSidebar';
import { PerformerGrid } from '../../components/performers/PerformerGrid';
import { PerformerList } from '../../components/performers/PerformerList';
import { PerformerCalendar } from '../../components/performers/PerformerCalendar';
import { DiscoverySections } from '../../components/performers/DiscoverySections';
type ViewMode = 'grid' | 'list' | 'calendar';
type SortOption = 'trending' | 'popular' | 'newest' | 'upcoming' | 'reviews' | 'alphabetical';
const PerformerDiscoveryPageInternal = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [performers, setPerformers] = useState(mockPerformers);
  const [filteredPerformers, setFilteredPerformers] = useState(mockPerformers);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
  const [selectedTouringStatus, setSelectedTouringStatus] = useState<string | null>(null);
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<string | null>(null);
  const [selectedSpecialFeatures, setSelectedSpecialFeatures] = useState<string[]>([]);
  const [distance, setDistance] = useState(50);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery)) {
        const newRecentSearches = [searchQuery, ...recentSearches.slice(0, 4)];
        setRecentSearches(newRecentSearches);
      }
      // Filter performers based on search query
      const filtered = mockPerformers.filter(performer => performer.name.toLowerCase().includes(searchQuery.toLowerCase()) || performer.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())));
      setFilteredPerformers(filtered);
    } else {
      setFilteredPerformers(performers);
    }
    setShowRecentSearches(false);
  };
  // Apply filters
  const applyFilters = (genres: string[], availability: string | null, touringStatus: string | null, experienceLevel: string | null, specialFeatures: string[], distanceValue: number) => {
    setSelectedGenres(genres);
    setSelectedAvailability(availability);
    setSelectedTouringStatus(touringStatus);
    setSelectedExperienceLevel(experienceLevel);
    setSelectedSpecialFeatures(specialFeatures);
    setDistance(distanceValue);
    let filtered = [...mockPerformers];
    // Apply genre filter
    if (genres.length > 0) {
      filtered = filtered.filter(performer => performer.genres.some(genre => genres.includes(genre)));
    }
    // Apply availability filter
    if (availability) {
      const today = new Date();
      const weekend = new Date(today);
      weekend.setDate(today.getDate() + (6 - today.getDay()));
      filtered = filtered.filter(performer => {
        if (availability === 'tonight') {
          return performer.upcomingShows.some(show => {
            const showDate = new Date(show.date);
            return showDate.toDateString() === today.toDateString();
          });
        } else if (availability === 'this-weekend') {
          return performer.upcomingShows.some(show => {
            const showDate = new Date(show.date);
            return showDate >= today && showDate <= weekend;
          });
        } else if (availability === 'next-7-days') {
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          return performer.upcomingShows.some(show => {
            const showDate = new Date(show.date);
            return showDate >= today && showDate <= nextWeek;
          });
        } else if (availability === 'next-30-days') {
          const nextMonth = new Date(today);
          nextMonth.setDate(today.getDate() + 30);
          return performer.upcomingShows.some(show => {
            const showDate = new Date(show.date);
            return showDate >= today && showDate <= nextMonth;
          });
        }
        return true;
      });
    }
    // Apply touring status filter
    if (touringStatus) {
      filtered = filtered.filter(performer => {
        if (touringStatus === 'currently-touring') {
          return performer.isTouringNow;
        } else if (touringStatus === 'local-only') {
          return !performer.isTouringNow && performer.homeCity === 'Clearwater, FL';
        } else if (touringStatus === 'available-booking') {
          return performer.availableForBooking;
        }
        return true;
      });
    }
    // Apply experience level filter
    if (experienceLevel) {
      filtered = filtered.filter(performer => {
        if (experienceLevel === 'verified-professionals') {
          return performer.isVerified && performer.yearsActive >= 5;
        } else if (experienceLevel === 'rising-stars') {
          return performer.yearsActive < 5 && performer.followerCount > 1000;
        } else if (experienceLevel === 'established-acts') {
          return performer.yearsActive >= 5 && performer.followerCount > 10000;
        } else if (experienceLevel === 'legends') {
          return performer.yearsActive >= 15 && performer.followerCount > 50000;
        }
        return true;
      });
    }
    // Apply special features filter
    if (specialFeatures.length > 0) {
      filtered = filtered.filter(performer => {
        if (specialFeatures.includes('meet-greet') && !performer.offersMeetAndGreet) return false;
        if (specialFeatures.includes('merchandise') && !performer.hasMerchandise) return false;
        if (specialFeatures.includes('original-music') && !performer.hasOriginalMusic) return false;
        if (specialFeatures.includes('takes-requests') && !performer.takesRequests) return false;
        if (specialFeatures.includes('private-events') && !performer.availableForPrivateEvents) return false;
        if (specialFeatures.includes('family-friendly') && !performer.isFamilyFriendly) return false;
        return true;
      });
    }
    // Apply distance filter
    if (distanceValue < 100) {
      filtered = filtered.filter(performer => performer.distanceMiles <= distanceValue);
    }
    // Apply search query if exists
    if (searchQuery.trim()) {
      filtered = filtered.filter(performer => performer.name.toLowerCase().includes(searchQuery.toLowerCase()) || performer.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())));
    }
    // Apply sorting
    filtered = sortPerformers(filtered, sortBy);
    setFilteredPerformers(filtered);
  };
  // Sort performers
  const sortPerformers = (performersToSort: typeof mockPerformers, sortOption: SortOption) => {
    let sorted = [...performersToSort];
    switch (sortOption) {
      case 'trending':
        sorted.sort((a, b) => b.trendingScore - a.trendingScore);
        break;
      case 'popular':
        sorted.sort((a, b) => b.followerCount - a.followerCount);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
        break;
      case 'upcoming':
        sorted.sort((a, b) => {
          if (a.upcomingShows.length === 0) return 1;
          if (b.upcomingShows.length === 0) return -1;
          return new Date(a.upcomingShows[0].date).getTime() - new Date(b.upcomingShows[0].date).getTime();
        });
        break;
      case 'reviews':
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  };
  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setFilteredPerformers(sortPerformers(filteredPerformers, option));
  };
  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };
  // Reset all filters
  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedAvailability(null);
    setSelectedTouringStatus(null);
    setSelectedExperienceLevel(null);
    setSelectedSpecialFeatures([]);
    setDistance(50);
    setSearchQuery('');
    setFilteredPerformers(sortPerformers(mockPerformers, sortBy));
  };
  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedGenres.length > 0) count++;
    if (selectedAvailability) count++;
    if (selectedTouringStatus) count++;
    if (selectedExperienceLevel) count++;
    if (selectedSpecialFeatures.length > 0) count++;
    if (distance < 50) count++;
    return count;
  };
  // Focus search input when clicking on search container
  const handleSearchContainerClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      setShowRecentSearches(true);
    }
  };
  // Close recent searches when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setShowRecentSearches(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Initial sort
  useEffect(() => {
    setFilteredPerformers(sortPerformers(mockPerformers, sortBy));
  }, []);
  return <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Discover Performers & Artists
            </h1>
            <p className="mt-3 text-xl text-indigo-200">
              Find your next favorite artist from 10,000+ local and touring
              performers
            </p>
            {/* Hero Search Bar */}
            <div className="mt-8 relative">
              <div className="bg-white rounded-lg shadow-md flex items-center p-1 cursor-text" onClick={handleSearchContainerClick}>
                <form onSubmit={handleSearch} className="flex-grow flex">
                  <div className="flex-grow relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input ref={searchInputRef} type="text" className="w-full pl-10 pr-4 py-3 rounded-l-md focus:outline-none text-gray-900 placeholder-gray-500" placeholder="Search by artist name, genre, or instrument..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setShowRecentSearches(true)} />
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-r-md font-medium hover:bg-indigo-700">
                    Search
                  </button>
                </form>
              </div>
              {/* Recent Searches Dropdown */}
              {showRecentSearches && recentSearches.length > 0 && <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg py-1 text-sm text-left">
                  <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  {recentSearches.map((search, index) => <button key={index} className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left" onClick={() => {
                setSearchQuery(search);
                setShowRecentSearches(false);
                const filtered = mockPerformers.filter(performer => performer.name.toLowerCase().includes(search.toLowerCase()) || performer.genres.some(genre => genre.toLowerCase().includes(search.toLowerCase())));
                setFilteredPerformers(filtered);
              }}>
                      <SearchIcon className="h-4 w-4 inline mr-2 text-gray-400" />
                      {search}
                    </button>)}
                  <button className="block w-full px-4 py-2 text-indigo-600 hover:bg-gray-100 text-left border-t border-gray-100" onClick={() => {
                setRecentSearches([]);
                setShowRecentSearches(false);
              }}>
                    Clear recent searches
                  </button>
                </div>}
            </div>
          </div>
        </div>
      </div>
      {/* Quick Stats Bar */}
      <div className="bg-indigo-700 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center">
              <MusicIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">
                {mockPerformers.length} Performers Active
              </span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">127 Shows This Week</span>
            </div>
            <div className="flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">43 New Artists This Month</span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50">
              <FilterIcon className="h-5 w-5 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {getActiveFilterCount()}
                </span>}
            </button>
            {/* Sort Dropdown (Mobile) */}
            <div className="relative">
              <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => typeof document !== "undefined" && document.getElementById('mobile-sort-dropdown')?.classList.toggle('hidden')}>
                <TrendingUpIcon className="h-5 w-5 mr-2" />
                {sortBy === 'trending' && 'Trending Now'}
                {sortBy === 'popular' && 'Most Popular'}
                {sortBy === 'newest' && 'Newest Artists'}
                {sortBy === 'upcoming' && 'Upcoming Shows'}
                {sortBy === 'reviews' && 'Most Reviews'}
                {sortBy === 'alphabetical' && 'Alphabetical'}
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </button>
              <div id="mobile-sort-dropdown" className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'trending' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                  handleSortChange('trending');
                  typeof document !== "undefined" && document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
                }}>
                    Trending Now
                  </button>
                  <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'popular' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                  handleSortChange('popular');
                  typeof document !== "undefined" && document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
                }}>
                    Most Popular
                  </button>
                  <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'newest' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                  handleSortChange('newest');
                  typeof document !== "undefined" && document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
                }}>
                    Newest Artists
                  </button>
                  <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'upcoming' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                  handleSortChange('upcoming');
                  typeof document !== "undefined" && document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
                }}>
                    Upcoming Shows
                  </button>
                  <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'reviews' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                  handleSortChange('reviews');
                  typeof document !== "undefined" && document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
                }}>
                    Most Reviews
                  </button>
                  <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'alphabetical' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                  handleSortChange('alphabetical');
                  typeof document !== "undefined" && document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
                }}>
                    Alphabetical
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile Filter Sidebar (Overlay) */}
          {isMobileFilterOpen && <div className="fixed inset-0 z-40 flex md:hidden">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFilterOpen(false)}></div>
              <div className="relative w-full max-w-xs bg-white h-full overflow-y-auto">
                <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar selectedGenres={selectedGenres} selectedAvailability={selectedAvailability} selectedTouringStatus={selectedTouringStatus} selectedExperienceLevel={selectedExperienceLevel} selectedSpecialFeatures={selectedSpecialFeatures} distance={distance} applyFilters={applyFilters} resetFilters={resetFilters} isMobile={true} closeMobileFilter={() => setIsMobileFilterOpen(false)} />
                </div>
              </div>
            </div>}
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block md:w-1/4 lg:w-1/5">
            <FilterSidebar selectedGenres={selectedGenres} selectedAvailability={selectedAvailability} selectedTouringStatus={selectedTouringStatus} selectedExperienceLevel={selectedExperienceLevel} selectedSpecialFeatures={selectedSpecialFeatures} distance={distance} applyFilters={applyFilters} resetFilters={resetFilters} isMobile={false} />
          </div>
          {/* Main Content Area */}
          <div className="md:w-3/4 lg:w-4/5">
            {/* Desktop Sort & View Controls */}
            <div className="hidden md:flex justify-between items-center mb-6">
              {/* Sort Controls */}
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Sort by:</span>
                <div className="relative">
                  <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => typeof document !== "undefined" && document.getElementById('sort-dropdown')?.classList.toggle('hidden')}>
                    {sortBy === 'trending' && 'Trending Now'}
                    {sortBy === 'popular' && 'Most Popular'}
                    {sortBy === 'newest' && 'Newest Artists'}
                    {sortBy === 'upcoming' && 'Upcoming Shows'}
                    {sortBy === 'reviews' && 'Most Reviews'}
                    {sortBy === 'alphabetical' && 'Alphabetical'}
                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                  </button>
                  <div id="sort-dropdown" className="hidden absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'trending' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                      handleSortChange('trending');
                      typeof document !== "undefined" && document.getElementById('sort-dropdown')?.classList.add('hidden');
                    }}>
                        Trending Now
                      </button>
                      <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'popular' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                      handleSortChange('popular');
                      typeof document !== "undefined" && document.getElementById('sort-dropdown')?.classList.add('hidden');
                    }}>
                        Most Popular
                      </button>
                      <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'newest' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                      handleSortChange('newest');
                      typeof document !== "undefined" && document.getElementById('sort-dropdown')?.classList.add('hidden');
                    }}>
                        Newest Artists
                      </button>
                      <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'upcoming' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                      handleSortChange('upcoming');
                      typeof document !== "undefined" && document.getElementById('sort-dropdown')?.classList.add('hidden');
                    }}>
                        Upcoming Shows
                      </button>
                      <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'reviews' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                      handleSortChange('reviews');
                      typeof document !== "undefined" && document.getElementById('sort-dropdown')?.classList.add('hidden');
                    }}>
                        Most Reviews
                      </button>
                      <button className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'alphabetical' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => {
                      handleSortChange('alphabetical');
                      typeof document !== "undefined" && document.getElementById('sort-dropdown')?.classList.add('hidden');
                    }}>
                        Alphabetical
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* View Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 mr-2">View:</span>
                <button className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => handleViewModeChange('grid')} aria-label="Grid view">
                  <GridIcon className="h-5 w-5" />
                </button>
                <button className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => handleViewModeChange('list')} aria-label="List view">
                  <ListIcon className="h-5 w-5" />
                </button>
                <button className={`p-2 rounded ${viewMode === 'calendar' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => handleViewModeChange('calendar')} aria-label="Calendar view">
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            {/* Results Count */}
            <div className="mb-4 text-gray-600">
              Showing {filteredPerformers.length} performers
              {getActiveFilterCount() > 0 && ` with ${getActiveFilterCount()} active filters`}
            </div>
            {/* Active Filters */}
            {getActiveFilterCount() > 0 && <div className="mb-6 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedGenres.map(genre => <span key={genre} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                    {genre}
                    <button className="ml-1 text-indigo-600 hover:text-indigo-800" onClick={() => {
                const newGenres = selectedGenres.filter(g => g !== genre);
                applyFilters(newGenres, selectedAvailability, selectedTouringStatus, selectedExperienceLevel, selectedSpecialFeatures, distance);
              }}>
                      <XIcon className="h-4 w-4" />
                    </button>
                  </span>)}
                {selectedAvailability && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                    {selectedAvailability === 'tonight' && 'Tonight'}
                    {selectedAvailability === 'this-weekend' && 'This Weekend'}
                    {selectedAvailability === 'next-7-days' && 'Next 7 Days'}
                    {selectedAvailability === 'next-30-days' && 'Next 30 Days'}
                    <button className="ml-1 text-indigo-600 hover:text-indigo-800" onClick={() => {
                applyFilters(selectedGenres, null, selectedTouringStatus, selectedExperienceLevel, selectedSpecialFeatures, distance);
              }}>
                      <XIcon className="h-4 w-4" />
                    </button>
                  </span>}
                {selectedTouringStatus && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                    {selectedTouringStatus === 'currently-touring' && 'Currently Touring'}
                    {selectedTouringStatus === 'local-only' && 'Local Artists Only'}
                    {selectedTouringStatus === 'available-booking' && 'Available for Booking'}
                    <button className="ml-1 text-indigo-600 hover:text-indigo-800" onClick={() => {
                applyFilters(selectedGenres, selectedAvailability, null, selectedExperienceLevel, selectedSpecialFeatures, distance);
              }}>
                      <XIcon className="h-4 w-4" />
                    </button>
                  </span>}
                {selectedExperienceLevel && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                    {selectedExperienceLevel === 'verified-professionals' && 'Verified Professionals'}
                    {selectedExperienceLevel === 'rising-stars' && 'Rising Stars'}
                    {selectedExperienceLevel === 'established-acts' && 'Established Acts'}
                    {selectedExperienceLevel === 'legends' && 'Legends/Veterans'}
                    <button className="ml-1 text-indigo-600 hover:text-indigo-800" onClick={() => {
                applyFilters(selectedGenres, selectedAvailability, selectedTouringStatus, null, selectedSpecialFeatures, distance);
              }}>
                      <XIcon className="h-4 w-4" />
                    </button>
                  </span>}
                {selectedSpecialFeatures.map(feature => <span key={feature} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                    {feature === 'meet-greet' && 'Meet & Greets'}
                    {feature === 'merchandise' && 'Merchandise'}
                    {feature === 'original-music' && 'Original Music'}
                    {feature === 'takes-requests' && 'Takes Requests'}
                    {feature === 'private-events' && 'Private Events'}
                    {feature === 'family-friendly' && 'Family Friendly'}
                    <button className="ml-1 text-indigo-600 hover:text-indigo-800" onClick={() => {
                const newFeatures = selectedSpecialFeatures.filter(f => f !== feature);
                applyFilters(selectedGenres, selectedAvailability, selectedTouringStatus, selectedExperienceLevel, newFeatures, distance);
              }}>
                      <XIcon className="h-4 w-4" />
                    </button>
                  </span>)}
                {distance < 50 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                    Within {distance} miles
                    <button className="ml-1 text-indigo-600 hover:text-indigo-800" onClick={() => {
                applyFilters(selectedGenres, selectedAvailability, selectedTouringStatus, selectedExperienceLevel, selectedSpecialFeatures, 50);
              }}>
                      <XIcon className="h-4 w-4" />
                    </button>
                  </span>}
                <button className="text-sm text-indigo-600 hover:text-indigo-800 underline" onClick={resetFilters}>
                  Clear all filters
                </button>
              </div>}
            {/* No Results State */}
            {filteredPerformers.length === 0 && <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <MusicIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No performers found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any performers matching your current filters.
                  Try broadening your search criteria.
                </p>
                <button onClick={resetFilters} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Reset all filters
                </button>
                <div className="mt-6 text-sm text-gray-500">
                  <p>Can't find who you're looking for?</p>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Request an Artist
                  </button>
                </div>
              </div>}
            {/* Performer Grid/List/Calendar View */}
            {filteredPerformers.length > 0 && <>
                {viewMode === 'grid' && <PerformerGrid performers={filteredPerformers} onPerformerClick={performerId => navigate(`/performers/${performerId}`)} />}
                {viewMode === 'list' && <PerformerList performers={filteredPerformers} onPerformerClick={performerId => navigate(`/performers/${performerId}`)} />}
                {viewMode === 'calendar' && <PerformerCalendar performers={filteredPerformers} onPerformerClick={performerId => navigate(`/performers/${performerId}`)} />}
              </>}
            {/* Discovery Sections (only show when no search/filters active) */}
            {searchQuery === '' && getActiveFilterCount() === 0 && <DiscoverySections performers={mockPerformers} onPerformerClick={performerId => navigate(`/performers/${performerId}`)} />}
          </div>
        </div>
      </div>
    </div>;
};

export const PerformerDiscoveryPage = () => {
  return (
    <ClientOnly>
      <PerformerDiscoveryPageInternal />
    </ClientOnly>
  );
};