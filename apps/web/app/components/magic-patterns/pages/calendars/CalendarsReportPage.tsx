import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PlusIcon, SearchIcon, FilterIcon, GridIcon, ListIcon, CalendarIcon, UsersIcon, EyeIcon, StarIcon, TrendingUpIcon, ClockIcon, HeartIcon, ShareIcon } from 'lucide-react';
import { CalendarCard } from '../../components/calendar/CalendarCard';
import { CalendarCard as EnhancedCalendarCard } from '../../components/ui/EnhancedCard';

interface Calendar {
  id: string;
  name: string;
  description: string;
  slug: string;
  creator: {
    name: string;
    avatar_url?: string;
  };
  event_count: number;
  subscriber_count: number;
  view_count: number;
  is_public: boolean;
  color: string;
  image_url?: string;
  created_at: string;
  categories?: string[];
  is_featured?: boolean;
  is_verified?: boolean;
}

export const CalendarsReportPage = () => {
  const navigate = useNavigate();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [filteredCalendars, setFilteredCalendars] = useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending' | 'events'>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Load calendars data
  useEffect(() => {
    const loadCalendars = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API call
        // For now, using sample data
        const sampleCalendars: Calendar[] = [
          {
            id: '1',
            name: 'Jazz Nights Tampa',
            description: 'The best jazz events in Tampa Bay area. Curated by local jazz enthusiasts.',
            slug: 'jazz-nights-tampa',
            creator: {
              name: 'Sarah Johnson',
              avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
            },
            event_count: 24,
            subscriber_count: 156,
            view_count: 892,
            is_public: true,
            color: '#8B5CF6',
            image_url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            created_at: '2024-01-15T10:00:00Z',
            categories: ['Music', 'Jazz', 'Live Events'],
            is_featured: true,
            is_verified: true
          },
          {
            id: '2',
            name: 'Foodie Adventures',
            description: 'Discover the best food events, tastings, and culinary experiences in the city.',
            slug: 'foodie-adventures',
            creator: {
              name: 'Mike Chen',
              avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
            },
            event_count: 18,
            subscriber_count: 234,
            view_count: 1205,
            is_public: true,
            color: '#F59E0B',
            image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            created_at: '2024-02-03T14:30:00Z',
            categories: ['Food', 'Culinary', 'Tastings'],
            is_featured: false,
            is_verified: true
          },
          {
            id: '3',
            name: 'Tech Meetups Tampa',
            description: 'Stay updated with the latest tech events, meetups, and conferences in Tampa Bay.',
            slug: 'tech-meetups-tampa',
            creator: {
              name: 'Alex Rodriguez',
              avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
            },
            event_count: 31,
            subscriber_count: 189,
            view_count: 756,
            is_public: true,
            color: '#3B82F6',
            image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            created_at: '2024-01-28T09:15:00Z',
            categories: ['Technology', 'Networking', 'Conferences'],
            is_featured: true,
            is_verified: false
          },
          {
            id: '4',
            name: 'Art Gallery Openings',
            description: 'Exclusive access to art gallery openings, exhibitions, and cultural events.',
            slug: 'art-gallery-openings',
            creator: {
              name: 'Emma Wilson',
              avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
            },
            event_count: 12,
            subscriber_count: 98,
            view_count: 423,
            is_public: true,
            color: '#EC4899',
            image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            created_at: '2024-02-10T16:45:00Z',
            categories: ['Art', 'Culture', 'Exhibitions'],
            is_featured: false,
            is_verified: true
          },
          {
            id: '5',
            name: 'Fitness & Wellness',
            description: 'Join our community for fitness classes, wellness workshops, and health events.',
            slug: 'fitness-wellness',
            creator: {
              name: 'David Kim',
              avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
            },
            event_count: 45,
            subscriber_count: 312,
            view_count: 1456,
            is_public: true,
            color: '#10B981',
            image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            created_at: '2024-01-05T08:00:00Z',
            categories: ['Fitness', 'Wellness', 'Health'],
            is_featured: true,
            is_verified: true
          },
          {
            id: '6',
            name: 'Local Business Events',
            description: 'Networking events, business workshops, and entrepreneurial meetups.',
            slug: 'local-business-events',
            creator: {
              name: 'Lisa Martinez',
              avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
            },
            event_count: 22,
            subscriber_count: 167,
            view_count: 634,
            is_public: true,
            color: '#F97316',
            image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            created_at: '2024-02-01T11:20:00Z',
            categories: ['Business', 'Networking', 'Entrepreneurship'],
            is_featured: false,
            is_verified: false
          }
        ];

        setCalendars(sampleCalendars);
        setFilteredCalendars(sampleCalendars);
      } catch (error) {
        console.error('Error loading calendars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalendars();
  }, []);

  // Filter and sort calendars
  useEffect(() => {
    let filtered = [...calendars];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(calendar =>
        calendar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calendar.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calendar.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(calendar =>
        calendar.categories?.includes(filterCategory)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'popular':
          return b.subscriber_count - a.subscriber_count;
        case 'trending':
          return b.view_count - a.view_count;
        case 'events':
          return b.event_count - a.event_count;
        default:
          return 0;
      }
    });

    setFilteredCalendars(filtered);
  }, [calendars, searchQuery, sortBy, filterCategory]);

  const handleViewCalendar = (slug: string) => {
    navigate(`/calendars/${slug}`);
  };

  const handleFollowCalendar = (id: string) => {
    // TODO: Implement follow functionality
    console.log('Follow calendar:', id);
  };

  const handleShareCalendar = (slug: string) => {
    // TODO: Implement share functionality
    console.log('Share calendar:', slug);
  };

  const categories = ['all', 'Music', 'Food', 'Technology', 'Art', 'Fitness', 'Business'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shared Calendars</h1>
              <p className="mt-2 text-gray-600">
                Discover calendars created by influencers and community members
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate('/calendars/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search calendars..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View Toggle */}
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <GridIcon className="h-5 w-5 mr-2" />
                Grid
              </button>
              <button
                type="button"
                className={`relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('list')}
              >
                <ListIcon className="h-5 w-5 mr-2" />
                List
              </button>
            </div>

            {/* Sort and Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
                <option value="events">Most Events</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-3 py-2 border rounded-md ${
                  showFilters
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filterCategory === category
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {filteredCalendars.length} Calendar{filteredCalendars.length !== 1 ? 's' : ''}
          </h2>
          {(searchQuery || filterCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Calendars Grid/List */}
        {filteredCalendars.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No calendars found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find any calendars matching your criteria. Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {filteredCalendars.map((calendar) => (
              <CalendarCard
                key={calendar.id}
                calendar={calendar}
                onView={handleViewCalendar}
                onFollow={handleFollowCalendar}
                onShare={handleShareCalendar}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
