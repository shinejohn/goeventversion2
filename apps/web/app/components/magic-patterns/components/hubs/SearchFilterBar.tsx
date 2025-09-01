import React from 'react';
import { SearchIcon, FilterIcon, MapPinIcon, UserIcon, ActivityIcon, SlidersIcon, XIcon, ChevronDownIcon } from 'lucide-react';
type SearchFilterBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  creatorFilter: string;
  setCreatorFilter: (creator: string) => void;
  activityFilter: 'all' | 'high' | 'medium' | 'low';
  setActivityFilter: (activity: 'all' | 'high' | 'medium' | 'low') => void;
  sortBy: 'popular' | 'newest' | 'active';
  setSortBy: (sort: 'popular' | 'newest' | 'active') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
};
export const SearchFilterBar = ({
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  creatorFilter,
  setCreatorFilter,
  activityFilter,
  setActivityFilter,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters
}: SearchFilterBarProps) => {
  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setCreatorFilter('');
    setActivityFilter('all');
  };
  const hasActiveFilters = searchQuery || locationFilter || creatorFilter || activityFilter !== 'all';
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Main Search Bar */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by topic, hub name, or description..." className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <XIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setSortBy(sortBy === 'popular' ? 'newest' : sortBy === 'newest' ? 'active' : 'popular')} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                <SlidersIcon className="h-4 w-4 mr-2" />
                <span>
                  {sortBy === 'popular' ? 'Most Popular' : sortBy === 'newest' ? 'Newest First' : 'Most Active'}
                </span>
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </button>
              {/* Sort options dropdown would go here */}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center px-4 py-2 border rounded-md ${showFilters ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
              <FilterIcon className="h-4 w-4 mr-2" />
              <span>Filters</span>
              {hasActiveFilters && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Active
                </span>}
            </button>
          </div>
        </div>
      </div>
      {/* Advanced Filters */}
      {showFilters && <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input id="location-filter" type="text" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} placeholder="Filter by location..." className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="creator-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Creator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input id="creator-filter" type="text" value={creatorFilter} onChange={e => setCreatorFilter(e.target.value)} placeholder="Filter by creator..." className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="activity-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Level
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ActivityIcon className="h-4 w-4 text-gray-400" />
                </div>
                <select id="activity-filter" value={activityFilter} onChange={e => setActivityFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')} className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                  <option value="all">Any activity level</option>
                  <option value="high">High activity</option>
                  <option value="medium">Medium activity</option>
                  <option value="low">Low activity</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={clearFilters} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
              Clear Filters
            </button>
          </div>
        </div>}
    </div>;
};