import React, { useEffect, useState } from 'react';
import { SearchIcon, MapPinIcon, SlidersIcon, TrendingUpIcon, UsersIcon, ClockIcon, PlusCircleIcon, XIcon, ChevronDownIcon, CheckIcon, StarIcon, CalendarIcon, FilterIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
import { CalendarCard } from '../../components/calendars/CalendarCard';
import { CalendarFilters } from '../../components/calendars/CalendarFilters';
import { FeaturedCalendars } from '../../components/calendars/FeaturedCalendars';
export const CalendarMarketplacePage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // Mock categories
  const categories = [{
    id: 'all',
    name: 'All'
  }, {
    id: 'jazz',
    name: 'Jazz'
  }, {
    id: 'kids',
    name: 'Kids & Family'
  }, {
    id: 'fitness',
    name: 'Fitness'
  }, {
    id: 'seniors',
    name: 'Seniors'
  }, {
    id: 'schools',
    name: 'Schools'
  }, {
    id: 'sports',
    name: 'Sports'
  }, {
    id: 'arts',
    name: 'Arts'
  }, {
    id: 'food',
    name: 'Food'
  }, {
    id: 'professional',
    name: 'Professional'
  }];
  // Sort options
  const sortOptions = [{
    id: 'trending',
    name: 'Trending',
    icon: <TrendingUpIcon className="h-4 w-4" />
  }, {
    id: 'followers',
    name: 'Most Followed',
    icon: <UsersIcon className="h-4 w-4" />
  }, {
    id: 'updated',
    name: 'Recently Updated',
    icon: <ClockIcon className="h-4 w-4" />
  }, {
    id: 'new',
    name: 'New',
    icon: <PlusCircleIcon className="h-4 w-4" />
  }, {
    id: 'nearby',
    name: 'Near You',
    icon: <MapPinIcon className="h-4 w-4" />
  }];
  // Filters state
  const [filters, setFilters] = useState({
    location: {
      address: 'Clearwater, FL',
      radius: 25
    },
    followers: {
      min: 0,
      max: 10000
    },
    updateFrequency: 'any',
    priceType: 'all'
  });
  // Generate mock calendar data
  useEffect(() => {
    const generateMockCalendars = () => {
      const mockCalendars = [];
      const calendarTypes = [{
        title: 'Downtown Jazz Nights',
        description: 'All the best jazz performances in downtown venues',
        category: 'jazz',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        creator: {
          name: 'Jazz Association',
          verified: true
        },
        followers: 2547,
        growthRate: 12,
        eventCount: 8,
        price: 0,
        events: [{
          title: 'Tuesday Blues Night',
          date: 'Tue, 7:30 PM',
          venue: 'Blue Note'
        }, {
          title: 'Saxophone Showcase',
          date: 'Thu, 8:00 PM',
          venue: 'Jazz Corner'
        }, {
          title: 'Weekend Jazz Ensemble',
          date: 'Sat, 9:00 PM',
          venue: 'Harmony Hall'
        }]
      }, {
        title: 'Family Fun Activities',
        description: 'Kid-friendly events and activities for the whole family',
        category: 'kids',
        image: 'https://images.unsplash.com/photo-1536337005238-94b997371b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        creator: {
          name: 'Family First',
          verified: true
        },
        followers: 3856,
        growthRate: 8,
        eventCount: 12,
        price: 4.99,
        events: [{
          title: 'Story Time at Library',
          date: 'Mon, 10:00 AM',
          venue: 'Public Library'
        }, {
          title: 'Kids Craft Workshop',
          date: 'Wed, 2:00 PM',
          venue: 'Art Center'
        }, {
          title: 'Family Movie Night',
          date: 'Fri, 6:00 PM',
          venue: 'Community Park'
        }]
      }, {
        title: 'Morning Fitness Club',
        description: 'Daily workouts and fitness events to start your day right',
        category: 'fitness',
        image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        creator: {
          name: 'FitLife',
          verified: false
        },
        followers: 1897,
        growthRate: 15,
        eventCount: 21,
        price: 9.99,
        events: [{
          title: 'Sunrise Yoga',
          date: 'Daily, 6:00 AM',
          venue: 'Beach Front'
        }, {
          title: 'HIIT Workout',
          date: 'MWF, 7:30 AM',
          venue: 'City Park'
        }, {
          title: 'Group Run',
          date: 'Sat, 8:00 AM',
          venue: 'Waterfront Trail'
        }]
      }, {
        title: 'Senior Social Club',
        description: 'Events and gatherings for our senior community members',
        category: 'seniors',
        image: 'https://images.unsplash.com/photo-1447710441604-5bdc41bc6517?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        creator: {
          name: 'Golden Years',
          verified: true
        },
        followers: 1245,
        growthRate: 5,
        eventCount: 6,
        price: 0,
        events: [{
          title: 'Coffee & Conversation',
          date: 'Tue, 9:00 AM',
          venue: 'Community Center'
        }, {
          title: 'Card Game Tournament',
          date: 'Thu, 1:00 PM',
          venue: 'Senior Center'
        }, {
          title: 'Weekend Dance Social',
          date: 'Sat, 4:00 PM',
          venue: 'Golden Hall'
        }]
      }, {
        title: 'High School Sports',
        description: 'Complete schedule of local high school sporting events',
        category: 'schools',
        image: 'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        creator: {
          name: 'School District',
          verified: true
        },
        followers: 3421,
        growthRate: 3,
        eventCount: 15,
        price: 0,
        events: [{
          title: 'Varsity Football',
          date: 'Fri, 7:00 PM',
          venue: 'Memorial Stadium'
        }, {
          title: 'Basketball Tournament',
          date: 'Sat, All Day',
          venue: 'High School Gym'
        }, {
          title: 'Track & Field Meet',
          date: 'Wed, 3:30 PM',
          venue: 'Athletics Field'
        }]
      }, {
        title: 'Local Food Festivals',
        description: 'Food events, tastings, and culinary experiences in the area',
        category: 'food',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        creator: {
          name: 'Foodies United',
          verified: false
        },
        followers: 4532,
        growthRate: 22,
        eventCount: 7,
        price: 0,
        events: [{
          title: 'Farmers Market',
          date: 'Sat, 8:00 AM - 1:00 PM',
          venue: 'Downtown Square'
        }, {
          title: 'Food Truck Rally',
          date: 'Sun, 11:00 AM - 8:00 PM',
          venue: 'Waterfront Park'
        }, {
          title: 'Wine Tasting',
          date: 'Fri, 6:00 PM',
          venue: 'Vineyard Estates'
        }]
      }, {
        title: 'Art Gallery Openings',
        description: 'New exhibits and gallery events throughout the city',
        category: 'arts',
        image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        creator: {
          name: 'Arts Council',
          verified: true
        },
        followers: 1876,
        growthRate: 7,
        eventCount: 9,
        price: 2.99,
        events: [{
          title: 'First Friday Art Walk',
          date: 'Fri, 6:00 PM - 9:00 PM',
          venue: 'Downtown Arts District'
        }, {
          title: 'New Exhibit Opening',
          date: 'Sat, 7:00 PM',
          venue: 'Modern Gallery'
        }, {
          title: 'Artist Talk Series',
          date: 'Wed, 6:30 PM',
          venue: 'Community Arts Center'
        }]
      }, {
        title: 'Professional Networking',
        description: 'Business events, workshops, and networking opportunities',
        category: 'professional',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        creator: {
          name: 'Business Network',
          verified: true
        },
        followers: 2765,
        growthRate: 14,
        eventCount: 5,
        price: 14.99,
        events: [{
          title: 'Morning Networking Breakfast',
          date: 'Tue, 7:30 AM',
          venue: 'Downtown Hotel'
        }, {
          title: 'Entrepreneurship Workshop',
          date: 'Thu, 6:00 PM',
          venue: 'Innovation Center'
        }, {
          title: 'Industry Mixer',
          date: 'Fri, 5:30 PM',
          venue: 'Business Lounge'
        }]
      }];
      // Generate multiple instances with variations
      for (let i = 0; i < 24; i++) {
        const template = calendarTypes[i % calendarTypes.length];
        const variation = {
          id: `calendar-${i + 1}`,
          title: i < calendarTypes.length ? template.title : `${template.title} ${Math.floor(i / calendarTypes.length) + 1}`,
          description: template.description,
          category: template.category,
          image: template.image,
          creator: {
            name: template.creator.name,
            verified: template.creator.verified
          },
          followers: template.followers + Math.floor(Math.random() * 1000),
          growthRate: template.growthRate + Math.floor(Math.random() * 10) - 5,
          eventCount: template.eventCount + Math.floor(Math.random() * 5) - 2,
          price: template.price,
          events: template.events,
          featured: i < 4,
          trending: i % 5 === 0
        };
        mockCalendars.push(variation);
      }
      return mockCalendars;
    };
    const loadCalendars = () => {
      setIsLoading(true);
      // Simulate API call with delay
      setTimeout(() => {
        const allCalendars = generateMockCalendars();
        // Filter calendars based on selected category
        let filteredCalendars = allCalendars;
        if (selectedCategory !== 'all') {
          filteredCalendars = allCalendars.filter(calendar => calendar.category === selectedCategory);
        }
        // Filter based on search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredCalendars = filteredCalendars.filter(calendar => calendar.title.toLowerCase().includes(query) || calendar.description.toLowerCase().includes(query) || calendar.creator.name.toLowerCase().includes(query));
        }
        // Apply sorting
        switch (sortOption) {
          case 'followers':
            filteredCalendars.sort((a, b) => b.followers - a.followers);
            break;
          case 'trending':
            filteredCalendars.sort((a, b) => b.growthRate - a.growthRate);
            break;
          case 'new':
            // In a real app, would sort by creation date
            filteredCalendars.sort((a, b) => b.id.localeCompare(a.id));
            break;
          case 'updated':
            // In a real app, would sort by last update date
            filteredCalendars.sort((a, b) => b.eventCount - a.eventCount);
            break;
          case 'nearby':
            // In a real app, would sort by proximity to user
            break;
          default:
            break;
        }
        // Filter based on price
        if (filters.priceType === 'free') {
          filteredCalendars = filteredCalendars.filter(calendar => calendar.price === 0);
        } else if (filters.priceType === 'paid') {
          filteredCalendars = filteredCalendars.filter(calendar => calendar.price > 0);
        }
        // Pagination
        const startIndex = 0;
        const endIndex = page * 12;
        const paginatedCalendars = filteredCalendars.slice(startIndex, endIndex);
        setCalendars(paginatedCalendars);
        setHasMore(endIndex < filteredCalendars.length);
        setIsLoading(false);
      }, 800);
    };
    loadCalendars();
  }, [selectedCategory, sortOption, searchQuery, page, filters]);
  const handleLoadMore = () => {
    setPage(page + 1);
  };
  const handleFilterChange = newFilters => {
    setFilters({
      ...filters,
      ...newFilters
    });
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-white text-indigo-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold sm:text-4xl mb-4">
              Discover Calendars Created by Your Community
            </h1>
            <p className="text-indigo-600 text-lg mb-8">
              Find and follow curated event calendars for any interest or
              activity
            </p>
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search for calendars by name, topic, or creator..." className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:ring-white" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Pills */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => <button key={category.id} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedCategory === category.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`} onClick={() => setSelectedCategory(category.id)}>
                {category.name}
              </button>)}
          </div>
        </div>
        {/* Sort and Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <div className="relative inline-block text-left">
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={sortOption} onChange={e => setSortOption(e.target.value)}>
                {sortOptions.map(option => <option key={option.id} value={option.id}>
                    {option.name}
                  </option>)}
              </select>
            </div>
          </div>
          <button onClick={toggleFilters} className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
            {Object.values(filters).some(filter => typeof filter === 'object' && Object.values(filter).some(val => typeof val === 'number' && val > 0 || typeof val === 'string' && val !== '') || typeof filter === 'string' && filter !== 'any' && filter !== 'all') && <span className="ml-1 bg-indigo-100 text-indigo-800 py-0.5 px-1.5 rounded-full text-xs">
                Active
              </span>}
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Shown on larger screens or when toggled */}
          <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <CalendarFilters filters={filters} onFilterChange={handleFilterChange} onClose={() => setShowFilters(false)} />
          </div>
          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Calendars Section */}
            {selectedCategory === 'all' && page === 1 && <FeaturedCalendars calendars={calendars.filter(calendar => calendar.featured)} />}
            {/* Calendar Grid */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {sortOptions.find(option => option.id === sortOption)?.name}{' '}
                Calendars
              </h2>
              {isLoading && calendars.length === 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden h-96 animate-pulse">
                      <div className="h-40 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>)}
                </div> : calendars.length > 0 ? <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {calendars.map(calendar => <CalendarCard key={calendar.id} calendar={calendar} />)}
                  </div>
                  {hasMore && <div className="mt-8 text-center">
                      <button onClick={handleLoadMore} disabled={isLoading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                        {isLoading ? <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                          </> : 'Load More'}
                      </button>
                    </div>}
                </> : <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No calendars found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your filters or search terms
                  </p>
                  <div className="mt-6">
                    <button onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setFilters({
                    location: {
                      address: 'Clearwater, FL',
                      radius: 25
                    },
                    followers: {
                      min: 0,
                      max: 10000
                    },
                    updateFrequency: 'any',
                    priceType: 'all'
                  });
                }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Clear All Filters
                    </button>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};