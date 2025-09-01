import React, { useState, Component } from 'react';
/**
 * Component: Global Search
 * Type: CSR
 * Mockdata: OFF
 * Description: Site-wide search with suggestions
 * Components: None
 */
import { SearchIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
export const GlobalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const {
    navigateTo
  } = useNavigationContext();
  // Mock search results based on query
  const getSuggestions = (query: string) => {
    if (!query.trim()) return [];
    // Mock event suggestions
    const eventSuggestions = [{
      id: 'e1',
      name: 'Clearwater Jazz Holiday',
      type: 'event'
    }, {
      id: 'e2',
      name: 'Farmers Market on Cleveland',
      type: 'event'
    }, {
      id: 'e3',
      name: 'Downtown Art Walk',
      type: 'event'
    }, {
      id: 'e4',
      name: 'Comedy Night at Capitol Theatre',
      type: 'event'
    }, {
      id: 'e5',
      name: 'Summer Sunset Concert Series',
      type: 'event'
    }].filter(e => e.name.toLowerCase().includes(query.toLowerCase()));
    // Mock category suggestions
    const categorySuggestions = [{
      id: 'c1',
      name: 'Music Events',
      type: 'category'
    }, {
      id: 'c2',
      name: 'Food & Drink',
      type: 'category'
    }, {
      id: 'c3',
      name: 'Art Exhibitions',
      type: 'category'
    }, {
      id: 'c4',
      name: 'Family Friendly',
      type: 'category'
    }, {
      id: 'c5',
      name: 'Outdoor Activities',
      type: 'category'
    }].filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
    return {
      events: eventSuggestions.slice(0, 3),
      categories: categorySuggestions.slice(0, 2)
    };
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    navigateTo(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsFocused(false);
  };
  const handleSuggestionClick = (item: any) => {
    if (item.type === 'event') {
      navigateTo(`/event?id=${item.id}`);
    } else if (item.type === 'category') {
      navigateTo(`/events?category=${encodeURIComponent(item.name)}`);
    }
    setIsFocused(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchResults(getSuggestions(query));
  };
  return <div className="relative">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search events, venues, or categories..." value={searchQuery} onChange={handleInputChange} onFocus={() => setIsFocused(true)} onBlur={() => setTimeout(() => setIsFocused(false), 200)} />
        </div>
      </form>
      {isFocused && searchQuery.length > 0 && <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-sm">
          {searchResults.events && searchResults.events.length > 0 && <>
              <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                Suggested Events
              </div>
              {searchResults.events.map((event, index) => <button key={index} className="block w-full text-left px-4 py-2 hover:bg-gray-100" onMouseDown={() => handleSuggestionClick(event)}>
                  {event.name}
                </button>)}
            </>}
          {searchResults.categories && searchResults.categories.length > 0 && <>
              <div className="border-t border-gray-100 my-1"></div>
              <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                Categories
              </div>
              {searchResults.categories.map((category, index) => <button key={index} className="block w-full text-left px-4 py-2 hover:bg-gray-100" onMouseDown={() => handleSuggestionClick(category)}>
                  {category.name}
                </button>)}
            </>}
          <div className="border-t border-gray-100 my-1"></div>
          <button className="block w-full text-left px-4 py-2 text-indigo-600 hover:bg-gray-100" onMouseDown={handleSearch}>
            View all results for "{searchQuery}"
          </button>
        </div>}
    </div>;
};