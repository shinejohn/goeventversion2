import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigationContext } from '../../../context/NavigationContext';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { EventViewToggle } from '../../../components/hub/events/EventViewToggle';
import { EventFilters } from '../../../components/hub/events/EventFilters';
import { CalendarView } from '../../../components/hub/events/CalendarView';
import { ListView } from '../../../components/hub/events/ListView';
import { MapView } from '../../../components/hub/events/MapView';
import { CalendarIcon, PlusIcon, ArrowLeftIcon, FilterIcon, SearchIcon } from 'lucide-react';
export const HubEventsPage = () => {
  const {
    slug
  } = useParams();
  const {
    navigateTo
  } = useNavigationContext();
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'map'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [hubData, setHubData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    date: null,
    subcategory: [],
    location: '',
    price: null,
    memberRecommended: false,
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  // Fetch hub data and events
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
      // Mock events data
      const mockEvents = generateMockEvents(mockHubData);
      setHubData(mockHubData);
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, [slug]);
  // Filter events based on selected filters
  useEffect(() => {
    if (!events.length) return;
    const filtered = events.filter(event => {
      // Filter by search query
      const matchesSearch = !filters.searchQuery || event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || event.venue.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) || event.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      // Filter by date
      const matchesDate = !filters.date || new Date(event.date).toDateString() === new Date(filters.date).toDateString();
      // Filter by subcategory
      const matchesSubcategory = !filters.subcategory.length || filters.subcategory.some(sc => event.subcategories.includes(sc));
      // Filter by location
      const matchesLocation = !filters.location || event.venue.city === filters.location;
      // Filter by price
      const matchesPrice = !filters.price || filters.price === 'free' && event.price.isFree || filters.price === 'paid' && !event.price.isFree || filters.price === 'under25' && !event.price.isFree && event.price.min < 25 || filters.price === 'under50' && !event.price.isFree && event.price.min < 50;
      // Filter by member recommended
      const matchesRecommended = !filters.memberRecommended || event.memberRecommendations > 5;
      return matchesSearch && matchesDate && matchesSubcategory && matchesLocation && matchesPrice && matchesRecommended;
    });
    setFilteredEvents(filtered);
  }, [filters, events]);
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
      date: null,
      subcategory: [],
      location: '',
      price: null,
      memberRecommended: false,
      searchQuery: ''
    });
  };
  // Submit event handler
  const handleSubmitEvent = () => {
    navigateTo(`/hub/${slug}/submit-event`);
  };
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
                <h1 className="text-3xl font-bold">{hubData.name}</h1>
                <p className="mt-2 text-white/80 max-w-2xl">
                  {hubData.description}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button onClick={handleSubmitEvent} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Submit Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* View Toggle */}
              <EventViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              {/* Search Bar */}
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" placeholder="Search events..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={filters.searchQuery} onChange={e => handleFilterChange('searchQuery', e.target.value)} />
              </div>
              {/* Filter Toggle Button */}
              <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center px-3 py-2 border rounded-md ${showFilters ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                <FilterIcon className="h-4 w-4 mr-2" />
                <span>Filters</span>
                {Object.values(filters).some(val => Array.isArray(val) ? val.length > 0 : Boolean(val)) && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Active
                  </span>}
              </button>
            </div>
            {/* Filters */}
            {showFilters && <div className="mt-4 pt-4 border-t border-gray-200">
                <EventFilters hubData={hubData} filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
              </div>}
          </div>

          {/* Events Count */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredEvents.length} Event
              {filteredEvents.length !== 1 ? 's' : ''}
            </h2>
            {filteredEvents.length !== events.length && <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800">
                Clear all filters
              </button>}
          </div>

          {/* Event Views */}
          {filteredEvents.length === 0 ? <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No events found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or search criteria.
              </p>
              <div className="mt-6">
                <button onClick={clearFilters} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Clear all filters
                </button>
              </div>
            </div> : <>
              {viewMode === 'calendar' && <CalendarView events={filteredEvents} />}
              {viewMode === 'list' && <ListView events={filteredEvents} hubData={hubData} />}
              {viewMode === 'map' && <MapView events={filteredEvents} />}
            </>}
        </div>
      </div>
      <Footer />
    </>;
};
// Helper function to generate mock events
function generateMockEvents(hubData: any) {
  const events = [];
  const today = new Date();
  const eventTypes = hubData.id === 'jazz-lovers' ? [{
    title: 'Jazz Night at Blue Note',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    venue: {
      name: 'Blue Note Jazz Club',
      city: 'New York, NY'
    },
    badges: ['Featured', 'Jazz Legend'],
    subcategories: ['Bebop', 'Contemporary']
  }, {
    title: 'Summer Jazz Festival',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    venue: {
      name: 'Central Park',
      city: 'New York, NY'
    },
    badges: ['Featured', 'Community Pick'],
    subcategories: ['Jazz Fusion', 'Latin Jazz', 'Vocal Jazz']
  }, {
    title: 'Jazz Workshop for Beginners',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    venue: {
      name: 'Community Music Center',
      city: 'Chicago, IL'
    },
    badges: ['Educational', 'Rising Star'],
    subcategories: ['Contemporary', 'Big Band']
  }, {
    title: 'Late Night Jazz Session',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    venue: {
      name: 'The Jazz Gallery',
      city: 'New Orleans, LA'
    },
    badges: ['Jam Session', 'Community Pick'],
    subcategories: ['Smooth Jazz', 'Bebop']
  }, {
    title: 'Jazz History Lecture',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    venue: {
      name: 'Public Library',
      city: 'Chicago, IL'
    },
    badges: ['Educational', 'Jazz History'],
    subcategories: ['Big Band', 'Bebop']
  }] : [{
    title: 'Urban Gardening Workshop',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    venue: {
      name: 'Community Garden',
      city: 'New York, NY'
    },
    badges: ['Workshop', 'Featured'],
    subcategories: ['Container Gardening', 'Urban Farming']
  }, {
    title: 'Seed Swap Meetup',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    venue: {
      name: 'Green Thumb Garden',
      city: 'Chicago, IL'
    },
    badges: ['Community Event', 'Featured'],
    subcategories: ['Vegetables', 'Herbs']
  }, {
    title: 'Vertical Gardening Demonstration',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    venue: {
      name: 'Urban Farm Collective',
      city: 'San Francisco, CA'
    },
    badges: ['Educational', 'Expert Pick'],
    subcategories: ['Indoor Plants', 'Urban Farming']
  }, {
    title: 'Composting Basics',
    image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    venue: {
      name: 'Green Living Center',
      city: 'Austin, TX'
    },
    badges: ['Workshop', 'Beginner Friendly'],
    subcategories: ['Urban Farming', 'Community Gardens']
  }, {
    title: 'Herb Garden Planning',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    venue: {
      name: 'Botanical Garden',
      city: 'Chicago, IL'
    },
    badges: ['Educational', 'Expert Pick'],
    subcategories: ['Herbs', 'Container Gardening']
  }];
  // Generate 15 events with different dates
  for (let i = 0; i < 15; i++) {
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + Math.floor(Math.random() * 30) - 10); // Events from 10 days ago to 20 days in future
    const eventTemplate = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const isFree = Math.random() > 0.6;
    events.push({
      id: `event-${i}`,
      title: eventTemplate.title,
      image: eventTemplate.image,
      date: eventDate,
      time: `${Math.floor(Math.random() * 12) + 1}:${Math.random() > 0.5 ? '30' : '00'} ${Math.random() > 0.5 ? 'PM' : 'AM'}`,
      venue: eventTemplate.venue,
      description: `Join us for this amazing ${hubData.id === 'jazz-lovers' ? 'jazz' : 'gardening'} event! This is an opportunity you don't want to miss.`,
      badges: eventTemplate.badges,
      subcategories: eventTemplate.subcategories,
      price: {
        isFree,
        min: isFree ? 0 : Math.floor(Math.random() * 50) + 10,
        max: isFree ? 0 : Math.floor(Math.random() * 100) + 60
      },
      communityRating: (Math.random() * 2 + 3).toFixed(1),
      memberAttendance: Math.floor(Math.random() * 50) + 5,
      memberRecommendations: Math.floor(Math.random() * 20),
      discussionThreadId: `thread-${i}`,
      curatorNotes: Math.random() > 0.7 ? `This is a must-attend event for all ${hubData.id === 'jazz-lovers' ? 'jazz enthusiasts' : 'urban gardeners'}. The ${hubData.id === 'jazz-lovers' ? 'musicians' : 'speakers'} are top-notch and the venue is excellent.` : null,
      location: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1
      }
    });
  }
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}