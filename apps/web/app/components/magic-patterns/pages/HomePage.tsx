import React, { useState, createElement } from 'react';
import { CalendarIcon, MapPinIcon, SearchIcon, ArrowRightIcon, ClockIcon, StarIcon, MicIcon, BuildingIcon, TagIcon, MusicIcon, UtensilsIcon, PaletteIcon, UserIcon, HeartIcon, GlassWaterIcon, SunIcon, CheckIcon, ShareIcon } from 'lucide-react';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useNavigate } from 'react-router';
// Mock data imports removed - using real data now
import { DateSelector } from '../components/home/DateSelector';
import { SharePopup } from '../components/ui/SharePopup';

interface HomePageProps {
  events?: any[];
  venues?: any[];
  performers?: any[];
}

export const HomePage = ({ events = [], venues = [], performers = [] }: HomePageProps) => {
  const navigate = useNavigate();
  const navigateTo = (path: string) => navigate(path);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  // State for share popup
  const [sharePopupState, setSharePopupState] = useState({
    isOpen: false,
    title: '',
    description: '',
    url: '',
    image: ''
  });
  // States for success indicators
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [calendarSuccess, setCalendarSuccess] = useState<string | null>(null);
  // Event categories for filtering - using the same structure as EventsPage
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
  // Featured events (using REAL data from props)
  const featuredEvents = events.slice(0, 4).map(event => ({
    id: event.id,
    title: event.title,
    image: event.image || event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: new Date(event.start_datetime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    venue: event.location_name || event.venue || 'TBA',
    category: event.category || 'Event',
    price: event.price || (event.price_min ? `$${event.price_min}+` : 'Free')
  }));
  // Featured venues (using data from props)
  const featuredVenues = venues.slice(0, 4).map(venue => ({
    id: venue.id,
    name: venue.name,
    image: venue.images?.[0] || venue.image_url || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
    location: venue.city || venue.address?.split(',')[0] || '',
    rating: venue.rating || 0,
    reviewCount: venue.reviewCount || 0,
    capacity: venue.capacity || 0,
    venueType: venue.venueType || 'Venue'
  }))
  // Featured performers (using data from props)
  const featuredPerformers = performers.slice(0, 4).map(performer => ({
    id: performer.id,
    name: performer.name,
    image: performer.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
    genres: performer.genres?.slice(0, 2) || [],
    rating: performer.rating || 0,
    reviewCount: performer.reviews || 0,
    homeCity: performer.home_city || performer.location || '',
    upcomingShow: { date: new Date().toISOString() } // Mock for now
  }))
  // Generate REAL upcoming events from props data
  const generateUpcomingEvents = () => {
    const today = new Date();
    const upcomingEvents = events
      .filter(event => new Date(event.start_datetime) >= today)
      .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
      .slice(0, 21); // Take next 21 events to fill ~7 days

    // Group events by date
    const eventsByDate = new Map();
    
    upcomingEvents.forEach(event => {
      const eventDate = new Date(event.start_datetime);
      const daysDiff = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      let dateString;
      if (daysDiff === 0) dateString = 'Today';
      else if (daysDiff === 1) dateString = 'Tomorrow';
      else dateString = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });

      if (!eventsByDate.has(dateString)) {
        eventsByDate.set(dateString, {
          date: dateString,
          rawDate: eventDate,
          events: []
        });
      }

      eventsByDate.get(dateString).events.push({
        id: event.id,
        title: event.title,
        image: event.image || event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        venue: event.location_name || event.venue || 'TBA',
        category: event.category || 'Event',
        price: event.price || (event.price_min ? `$${event.price_min}+` : 'Free'),
        time: new Date(event.start_datetime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        }),
        rawDate: eventDate
      });
    });

    return Array.from(eventsByDate.values()).slice(0, 7); // Max 7 days
  };
  const upcomingEventsByDay = generateUpcomingEvents();
  // Handle category selection - navigate to events page with filter
  const handleCategorySelect = (category: string) => {
    navigate('/events');
  };
  // Handle date change
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // Here you would typically fetch events for the selected date
  };
  // Handle share event
  const handleShareEvent = (e: React.MouseEvent, event: any, dayDate?: string) => {
    e.stopPropagation(); // Prevent navigating to event detail
    let description = `${event.title} at ${event.venue}`;
    if (dayDate) {
      description += ` on ${dayDate} at ${event.time}`;
    } else {
      description += ` on ${event.date}`;
    }
    setSharePopupState({
      isOpen: true,
      title: event.title,
      description,
      url: `${window.location.origin}/event/${event.id}`,
      image: event.image
    });
  };
  // Handle add to calendar
  const handleAddToCalendar = (e: React.MouseEvent, event: any, eventId: string) => {
    e.stopPropagation(); // Prevent navigating to event detail
    // Create calendar event data
    const eventDate = event.rawDate || new Date();
    const eventEndDate = new Date(eventDate);
    eventEndDate.setHours(eventEndDate.getHours() + 3); // Assume 3 hour duration
    // Format for iCal
    const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = eventEndDate.toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `SUMMARY:${event.title}`, `DTSTART:${startDate}`, `DTEND:${endDate}`, `LOCATION:${event.venue}`, `DESCRIPTION:${event.title} at ${event.venue}`, 'END:VEVENT', 'END:VCALENDAR'].join('\n');
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
    setCalendarSuccess(eventId);
    setTimeout(() => setCalendarSuccess(null), 2000);
  };
  // Close share popup
  const closeSharePopup = () => {
    setSharePopupState(prev => ({
      ...prev,
      isOpen: false
    }));
  };
  return <div className="min-h-screen bg-white">
      {/* Simplified Search Bar */}
      <div className="bg-gray-50 py-2">
        <div className="max-w-xl mx-auto px-3 sm:px-4">
          <div className="bg-white rounded-lg shadow-sm p-2">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Search events..." />
              </div>
              <div className="relative w-full sm:w-1/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                </div>
                <select className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Clearwater, FL</option>
                  <option>Tampa, FL</option>
                  <option>St. Petersburg, FL</option>
                </select>
              </div>
              <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md font-medium" onClick={() => navigate('/calendar')}>
                Find
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Categories Filter - Similar to EventsPage */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2">
        <div className="flex justify-center flex-wrap gap-2">
          {categories.map(category => <button key={category.name} onClick={() => handleCategorySelect(category.name)} className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${category.color} hover:shadow-md`}>
              <div className="mb-0.5">{category.icon}</div>
              <span className="text-xs font-medium">{category.name}</span>
            </button>)}
        </div>
      </div>

      {/* Date Selector */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4">
        <DateSelector onDateChange={handleDateChange} currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      {/* Featured Events Section */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Featured Events
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center">
                <TagIcon className="h-3 w-3 mr-1" />
                Sponsored listings
              </p>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium text-sm" onClick={() => navigate('/events')}>
              View all events
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredEvents.map(event => <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
                <div className="h-48 overflow-hidden relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-black/30 backdrop-blur-sm text-white text-xs rounded-full">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {event.date}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {event.venue}
                    </div>
                    <span className="text-sm font-medium">{event.price}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <button onClick={e => handleShareEvent(e, event)} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100" title="Share Event">
                      {shareSuccess === event.id ? <CheckIcon className="h-4 w-4 text-green-500" /> : <ShareIcon className="h-4 w-4" />}
                    </button>
                    <button onClick={e => handleAddToCalendar(e, event, event.id)} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100" title="Add to Calendar">
                      {calendarSuccess === event.id ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CalendarIcon className="h-4 w-4" />}
                    </button>
                    <button onClick={e => {
                  e.stopPropagation();
                  navigate(`/events/${event.id}`);
                }} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200">
                      Details
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
          <div className="mt-4 text-center">
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium" onClick={() => navigate('/advertise/event-promotion')}>
              Promote your event here
            </button>
          </div>
        </div>
      </div>

      {/* Featured Venues Section */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Venues
              </h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <TagIcon className="h-4 w-4 mr-1" />
                Sponsored listings
              </p>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium" onClick={() => navigate('/venues')}>
              View all venues
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredVenues.map(venue => <div key={venue.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/venues/' + venue.id)}>
                <div className="h-48 overflow-hidden relative">
                  <img src={venue.image} alt={venue.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-black/30 backdrop-blur-sm text-white text-xs rounded-full">
                      {venue.venueType}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {venue.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {venue.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <BuildingIcon className="h-4 w-4 mr-1" />
                      Capacity: {venue.capacity}
                    </div>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">
                        {venue.rating}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({venue.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
          <div className="mt-4 text-center">
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium" onClick={() => navigate('/advertise/featured-listings')}>
              Promote your venue here
            </button>
          </div>
        </div>
      </div>

      {/* Featured Performers Section */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Performers
              </h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <TagIcon className="h-4 w-4 mr-1" />
                Sponsored listings
              </p>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium" onClick={() => navigate('/performers')}>
              View all performers
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredPerformers.map(performer => <div key={performer.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/performers/' + performer.id)}>
                <div className="h-48 overflow-hidden relative">
                  <img src={performer.image} alt={performer.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 className="font-bold text-lg text-white">
                      {performer.name}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {performer.genres.map((genre, idx) => <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {genre}
                      </span>)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MicIcon className="h-4 w-4 mr-1" />
                    {performer.homeCity}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Next show: {performer.upcomingShow.date.split('-')[2]}/
                      {performer.upcomingShow.date.split('-')[1]}
                    </div>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">
                        {performer.rating}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({performer.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
          <div className="mt-4 text-center">
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium" onClick={() => navigate('/advertise/featured-listings')}>
              Promote your performances here
            </button>
          </div>
        </div>
      </div>

      {/* Events by Day Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium" onClick={() => navigate('/calendar')}>
            View full calendar
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </button>
        </div>
        <div className="space-y-8">
          {upcomingEventsByDay.map((day, dayIndex) => <div key={dayIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                {day.date}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {day.events.map(event => <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
                    <div className="h-40 overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-black/30 backdrop-blur-sm text-white text-xs rounded-full">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 mb-1">
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
                          <button onClick={e => handleShareEvent(e, event, day.date)} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100" title="Share Event">
                            {shareSuccess === event.id ? <CheckIcon className="h-4 w-4 text-green-500" /> : <ShareIcon className="h-4 w-4" />}
                          </button>
                          <button onClick={e => handleAddToCalendar(e, event, event.id)} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100" title="Add to Calendar">
                            {calendarSuccess === event.id ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CalendarIcon className="h-4 w-4" />}
                          </button>
                          <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-200" onClick={e => {
                      e.stopPropagation();
                      navigate(`/events/${event.id}`);
                    }}>
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>)}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to discover more events?
        </h2>
        <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Join thousands of locals finding the best things to do in Clearwater
          every day
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm" onClick={() => navigate('/calendar')}>
            Explore All Events
          </button>
          <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-md shadow-sm border border-gray-300" onClick={() => navigate('/login')}>
            Sign Up
          </button>
        </div>
      </div>
      {/* Share Popup - Single instance controlled by state */}
      <SharePopup isOpen={sharePopupState.isOpen} onClose={closeSharePopup} title={sharePopupState.title} description={sharePopupState.description} url={sharePopupState.url} image={sharePopupState.image} />
    </div>;
};