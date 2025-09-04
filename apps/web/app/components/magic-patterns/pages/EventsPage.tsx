import React, { useState, createElement } from 'react';
import { ArrowRightIcon, CalendarIcon, MapPinIcon, MusicIcon, UtensilsIcon, PaletteIcon, UserIcon, HeartIcon, GlassWaterIcon, SunIcon, StarIcon, ClockIcon, ChevronRightIcon, ShareIcon, CheckIcon, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { LocationSelector } from '../components/ui/LocationSelector';
import { SharePopup } from '../components/ui/SharePopup';
interface EventsPageProps {
  events?: any[];
}

export const EventsPage = ({ events }: EventsPageProps) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [calendarSuccess, setCalendarSuccess] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [eventToShare, setEventToShare] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Event categories for filtering
  const categories = [{
    name: 'All',
    icon: <StarIcon className="h-6 w-6" />,
    color: 'bg-gray-100 text-gray-800',
    activeColor: 'bg-gray-700 text-white'
  }, {
    name: 'Music',
    icon: <MusicIcon className="h-6 w-6" />,
    color: 'bg-purple-100 text-purple-800',
    activeColor: 'bg-purple-600 text-white'
  }, {
    name: 'Food & Drink',
    icon: <UtensilsIcon className="h-6 w-6" />,
    color: 'bg-orange-100 text-orange-800',
    activeColor: 'bg-orange-600 text-white'
  }, {
    name: 'Arts',
    icon: <PaletteIcon className="h-6 w-6" />,
    color: 'bg-pink-100 text-pink-800',
    activeColor: 'bg-pink-600 text-white'
  }, {
    name: 'Family',
    icon: <UserIcon className="h-6 w-6" />,
    color: 'bg-green-100 text-green-800',
    activeColor: 'bg-green-600 text-white'
  }, {
    name: 'Nightlife',
    icon: <GlassWaterIcon className="h-6 w-6" />,
    color: 'bg-indigo-100 text-indigo-800',
    activeColor: 'bg-indigo-600 text-white'
  }, {
    name: 'Outdoor',
    icon: <SunIcon className="h-6 w-6" />,
    color: 'bg-blue-100 text-blue-800',
    activeColor: 'bg-blue-600 text-white'
  }, {
    name: 'Free',
    icon: <HeartIcon className="h-6 w-6" />,
    color: 'bg-red-100 text-red-800',
    activeColor: 'bg-red-600 text-white'
  }];
  // Featured events (reduced to 4 for 2x2 grid)
  const featuredEvents = [{
    id: 'event-1',
    title: 'Clearwater Jazz Holiday',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'Oct 15-18',
    venue: 'Coachman Park',
    category: 'Music'
  }, {
    id: 'event-2',
    title: 'Farmers Market on Cleveland',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'Every Saturday',
    venue: 'Cleveland Street District',
    category: 'Food & Drink'
  }, {
    id: 'event-3',
    title: 'Sunset Cinema: Summer Series',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'Fridays in June',
    venue: 'Pier 60',
    category: 'Entertainment'
  }, {
    id: 'event-4',
    title: 'Downtown Art Walk',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'First Friday Monthly',
    venue: 'Downtown Arts District',
    category: 'Arts'
  }];
  // Community events with dates for grouping by day
  const communityEvents = [{
    id: 'event-5',
    title: 'Craft Beer Festival',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'August 12-14',
    rawDate: new Date(2023, 7, 12),
    venue: 'Waterfront Park',
    category: 'Food & Drink',
    price: '$15',
    time: '12:00 PM - 8:00 PM',
    description: 'Sample over 100 craft beers from local and regional breweries.'
  }, {
    id: 'event-6',
    title: 'Community Yoga Day',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'June 11',
    rawDate: new Date(2023, 5, 11),
    venue: 'Clearwater Beach',
    category: 'Sports',
    price: 'Free',
    time: '7:30 AM - 9:00 AM',
    description: 'Join us for a relaxing morning of yoga by the beach.'
  }, {
    id: 'event-7',
    title: 'Local Band Showcase',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'June 11',
    rawDate: new Date(2023, 5, 11),
    venue: 'The District Lounge',
    category: 'Music',
    price: '$10',
    time: '8:00 PM - 11:00 PM',
    description: 'Featuring the best local bands in Clearwater.'
  }, {
    id: 'event-8',
    title: 'Kids Story Time',
    image: 'https://images.unsplash.com/photo-1500362650726-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'June 13',
    rawDate: new Date(2023, 5, 13),
    venue: 'Public Library',
    category: 'Family',
    price: 'Free',
    time: '10:30 AM - 11:30 AM',
    description: 'Interactive storytelling for children ages 3-8.'
  }, {
    id: 'event-9',
    title: 'Summer Night Market',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'June 15',
    rawDate: new Date(2023, 5, 15),
    venue: 'Downtown Plaza',
    category: 'Food & Drink',
    price: 'Free Entry',
    time: '6:00 PM - 10:00 PM',
    description: 'Local vendors, food trucks, and live music.'
  }, {
    id: 'event-10',
    title: 'Comedy Night',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'June 16',
    rawDate: new Date(2023, 5, 16),
    venue: 'Laugh Factory',
    category: 'Nightlife',
    price: '$20',
    time: '9:00 PM - 11:00 PM',
    description: 'Featuring top comedians from around the country.'
  }, {
    id: 'event-11',
    title: 'Beach Cleanup Day',
    image: 'https://images.unsplash.com/photo-1618477462146-aa50c5d09468?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'June 17',
    rawDate: new Date(2023, 5, 17),
    venue: 'Clearwater Beach',
    category: 'Outdoor',
    price: 'Free',
    time: '8:00 AM - 12:00 PM',
    description: 'Help keep our beaches beautiful. Supplies provided.'
  }, {
    id: 'event-12',
    title: 'Wine Tasting Tour',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2a8dad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'June 17',
    rawDate: new Date(2023, 5, 17),
    venue: 'Local Vineyards',
    category: 'Food & Drink',
    price: '$45',
    time: '1:00 PM - 5:00 PM',
    description: 'Tour of three local wineries with tastings included.'
  }, {
    id: 'event-13',
    title: 'Farmers Market',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'June 18',
    rawDate: new Date(2023, 5, 18),
    venue: 'Cleveland Street',
    category: 'Food & Drink',
    price: 'Free',
    time: '9:00 AM - 2:00 PM',
    description: 'Fresh local produce, crafts, and food vendors.'
  }, {
    id: 'event-14',
    title: 'Outdoor Movie Night',
    image: 'https://images.unsplash.com/photo-1585647347384-2dec3d2a8dad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'June 18',
    rawDate: new Date(2023, 5, 18),
    venue: 'Coachman Park',
    category: 'Family',
    price: '$5',
    time: '8:00 PM - 10:30 PM',
    description: 'Family-friendly movie under the stars. Bring blankets and chairs.'
  }];
  // Filter events based on selected category
  const filteredEvents = selectedCategory && selectedCategory !== 'All' ? communityEvents.filter(event => event.category === selectedCategory || selectedCategory === 'Free' && event.price === 'Free') : communityEvents;
  // Group events by date for the daily report
  const groupEventsByDate = events => {
    const grouped = events.reduce((acc, event) => {
      const dateKey = event.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {});
    // Convert to array and sort by date
    return Object.entries(grouped).map(([date, events]) => {
      // Get the first event's rawDate to determine the day of the week
      const firstEvent = events[0];
      const eventDate = firstEvent.rawDate;
      const dayOfWeek = eventDate.toLocaleDateString('en-US', {
        weekday: 'long'
      });
      return {
        date,
        dayOfWeek,
        events,
        rawDate: eventDate
      };
    }).sort((a, b) => a.rawDate - b.rawDate);
  };
  const eventsByDay = groupEventsByDate(filteredEvents);
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };
  // Handle share event
  const handleShareEvent = (event, e) => {
    e.stopPropagation(); // Prevent navigating to event detail
    setShareSuccess(event.id);
    // Open share popup for this event
    const eventToShare = event.id;
    setEventToShare(eventToShare);
  };
  // Handle add to calendar
  const handleAddToCalendar = (event, e) => {
    e.stopPropagation(); // Prevent navigating to event detail
    // Create calendar event data
    const eventDate = event.rawDate;
    const eventEndDate = new Date(eventDate);
    eventEndDate.setHours(eventEndDate.getHours() + 3); // Assume 3 hour duration if not specified
    // Format for iCal
    const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = eventEndDate.toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `SUMMARY:${event.title}`, `DTSTART:${startDate}`, `DTEND:${endDate}`, `LOCATION:${event.venue}`, `DESCRIPTION:${event.description || 'No description available'}`, 'END:VEVENT', 'END:VCALENDAR'].join('\n');
    // Create download link
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = typeof document !== "undefined" && document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Show success message
    setCalendarSuccess(event.id);
    setTimeout(() => setCalendarSuccess(null), 2000);
  };
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };
  return <div className="min-h-screen bg-white">
      {/* Page Header with Search and Location - Combined row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-64">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Search events..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
              </form>
            </div>
            <div className="w-full sm:w-auto">
              <LocationSelector currentLocation="Clearwater, FL" eventCount={filteredEvents.length} />
            </div>
          </div>
        </div>
      </div>
      {/* Category Filters - Reduced padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
        <div className="mb-2">
          <h2 className="text-base font-semibold text-gray-900 mb-2 text-center">
            Filter Events
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => <button key={category.name} onClick={() => handleCategorySelect(category.name)} className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${selectedCategory === category.name ? category.activeColor : category.color} hover:shadow-md`}>
                <div className="mb-0.5">{category.icon}</div>
                <span className="text-xs font-medium">{category.name}</span>
              </button>)}
          </div>
        </div>
      </div>
      {/* Featured Events - Reduced padding */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">Featured Events</h2>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium text-sm" onClick={() => navigate('/calendar')}>
              View calendar
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredEvents.map(event => <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/events/' + event.id)}>
                <div className="h-48 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {event.venue}
                  </div>
                  <button onClick={e => {
                e.stopPropagation();
                navigate('/events/' + event.id);
              }} className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md flex items-center justify-center">
                    See Details
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Daily Events Report */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory && selectedCategory !== 'All' ? `${selectedCategory} Events by Day` : 'Community Events by Day'}
          </h2>
          <div className="text-sm text-gray-500">
            {filteredEvents.length} events found
          </div>
        </div>
        {/* Success Messages */}
        {calendarSuccess && <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center">
            <CheckIcon className="h-5 w-5 mr-2" />
            Event added to calendar!
          </div>}
        {shareSuccess && <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center">
            <CheckIcon className="h-5 w-5 mr-2" />
            Event details copied to clipboard!
          </div>}
        {eventsByDay.length > 0 ? <div className="space-y-6">
            {eventsByDay.map((day, dayIndex) => <div key={dayIndex} className="border-b border-gray-200 pb-5 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  <span className="font-bold text-indigo-600 mr-2">
                    {day.dayOfWeek}
                  </span>
                  {day.date}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {day.events.map(event => <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="h-36 overflow-hidden relative">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 bg-black/30 backdrop-blur-sm text-white text-xs rounded-full">
                            {event.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-gray-900 mb-1 truncate">
                          {event.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          {event.venue}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {event.price}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button onClick={e => handleShareEvent(event, e)} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100" title="Share Event">
                              {shareSuccess === event.id ? <CheckIcon className="h-4 w-4 text-green-500" /> : <ShareIcon className="h-4 w-4" />}
                            </button>
                            <button onClick={e => handleAddToCalendar(event, e)} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100" title="Add to Calendar">
                              {calendarSuccess === event.id ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CalendarIcon className="h-4 w-4" />}
                            </button>
                            <button onClick={() => navigate('/events/' + event.id)} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 flex items-center">
                              See Details
                              <ChevronRightIcon className="h-3 w-3 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>)}
          </div> : <div className="text-center py-10">
            <p className="text-gray-500">
              No events found matching your filter.
            </p>
            <button onClick={() => setSelectedCategory(null)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Clear Filter
            </button>
          </div>}
      </div>
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 mt-1">
              Browse our complete calendar or submit your own event
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm" onClick={() => navigate('/calendar')}>
              View Calendar
            </button>
            <button className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-md shadow-sm border border-gray-300" onClick={() => navigate('/events/submit')}>
              Submit Event
            </button>
          </div>
        </div>
      </div>
      {/* Share Popup */}
      {eventToShare && (
        <SharePopup 
          isOpen={true} 
          onClose={() => setEventToShare(null)} 
          title="Event" 
          description={`Event details`} 
          url={`${window.location.origin}/event/${eventToShare}`} 
          image="" 
        />
      )}
    </div>;
};