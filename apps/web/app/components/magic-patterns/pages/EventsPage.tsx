import React, { useState } from 'react';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon,
  StarIcon,
  MusicIcon,
  UtensilsIcon,
  PaletteIcon,
  UserIcon,
  GlassWaterIcon,
  SunIcon,
  HeartIcon,
  SearchIcon,
  ArrowRightIcon,
  ShareIcon,
  CheckIcon
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { LocationSelector } from '../components/ui/LocationSelector';
import { SharePopup } from '../components/ui/SharePopup';

interface EventsPageProps {
  events?: any[];
}

export const EventsPage = ({ events = [] }: EventsPageProps) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventToShare, setEventToShare] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [calendarSuccess, setCalendarSuccess] = useState<string | null>(null);
  
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
  
  // Use events directly from props (already transformed by route loader)
  const featuredEvents = events.slice(0, 4);
  const communityEvents = events;
  
  // Filter events based on selected category
  const filteredEvents = selectedCategory && selectedCategory !== 'All' 
    ? communityEvents.filter(event => 
        event.category === selectedCategory || 
        (selectedCategory === 'Free' && event.price === 'Free')
      ) 
    : communityEvents;
    
  // Group events by date for the daily report
  const groupEventsByDate = (events: any[]) => {
    const grouped = events.reduce((acc, event) => {
      const dateKey = event.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {});
    
    // Convert to array and sort by date
    return Object.entries(grouped).map(([date, events]: [string, any]) => {
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
  const handleShareEvent = (event: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to event detail
    setShareSuccess(event.id);
    // Open share popup for this event
    const eventToShare = event.id;
    setEventToShare(eventToShare);
  };
  
  // Handle add to calendar
  const handleAddToCalendar = (event: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to event detail
    // Create calendar event data
    const eventDate = event.rawDate;
    const eventEndDate = new Date(eventDate);
    eventEndDate.setHours(eventEndDate.getHours() + 3); // Assume 3 hour duration if not specified
    
    // Format for iCal
    const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = eventEndDate.toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `LOCATION:${event.venue}`,
      `DESCRIPTION:${event.title} at ${event.venue}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    // Create download link
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    setCalendarSuccess(event.id);
    setTimeout(() => setCalendarSuccess(null), 2000);
  };
  
  // Get event to share details
  const getEventDetails = (eventId: string) => {
    const event = communityEvents.find(e => e.id === eventId);
    if (!event) return null;
    return {
      title: event.title,
      description: `${event.title} at ${event.venue} on ${event.date}`,
      url: `${window.location.origin}/events/${event.id}`,
      image: event.image
    };
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header with Search and Location */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-64">
              <form onSubmit={(e) => { e.preventDefault(); }} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="Search events..." 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
                </div>
              </form>
            </div>
            <div className="w-full sm:w-auto">
              <LocationSelector currentLocation="Clearwater, FL" eventCount={120} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Discover Events in Clearwater
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
              Find the best things to do in your city, from concerts to festivals
              and everything in between
            </p>
            <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
              <div className="rounded-md shadow">
                <button onClick={() => navigate('/calendar')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Browse Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Categories Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center flex-wrap gap-3">
          {categories.map(category => (
            <button 
              key={category.name} 
              onClick={() => handleCategorySelect(category.name)} 
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
                selectedCategory === category.name 
                  ? category.activeColor 
                  : category.color
              } hover:shadow-lg hover:-translate-y-0.5`}
            >
              <div className="mb-1">{category.icon}</div>
              <span className="text-xs font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Featured Events Grid */}
      {featuredEvents.length > 0 && (
        <div className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
              <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium" onClick={() => navigate('/calendar')}>
                View calendar
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
                  <div className="h-48 overflow-hidden relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-black/30 backdrop-blur-sm text-white text-xs rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      {event.date}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        {event.venue}
                      </div>
                      <span className="text-sm font-medium">{event.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Events by Day - Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory && selectedCategory !== 'All' 
              ? `${selectedCategory} Events` 
              : 'All Upcoming Events'}
          </h2>
          <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium" onClick={() => navigate('/events/create')}>
            Submit Event
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </button>
        </div>
        
        {eventsByDay.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found for the selected criteria.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {eventsByDay.map((day, dayIndex) => (
              <div key={dayIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  {day.dayOfWeek}, {day.date}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {day.events.map((event: any) => (
                    <div 
                      key={event.id} 
                      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" 
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-black/30 backdrop-blur-sm text-white text-xs rounded-full">
                            {event.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          {event.venue}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{event.price}</span>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={(e) => handleShareEvent(event, e)} 
                              className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100" 
                              title="Share Event"
                            >
                              {shareSuccess === event.id ? (
                                <CheckIcon className="h-4 w-4 text-green-500" />
                              ) : (
                                <ShareIcon className="h-4 w-4" />
                              )}
                            </button>
                            <button 
                              onClick={(e) => handleAddToCalendar(event, e)} 
                              className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100" 
                              title="Add to Calendar"
                            >
                              {calendarSuccess === event.id ? (
                                <CheckIcon className="h-4 w-4 text-green-500" />
                              ) : (
                                <CalendarIcon className="h-4 w-4" />
                              )}
                            </button>
                            <button 
                              className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-200" 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/events/${event.id}`);
                              }}
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* CTA Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Have an Event to Promote?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            List your event on When's The Fun and reach thousands of locals
            looking for great things to do
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm" 
              onClick={() => navigate('/events/create')}
            >
              Submit Your Event
            </button>
            <button 
              className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-md shadow-sm border border-gray-300" 
              onClick={() => navigate('/advertise')}
            >
              Advertising Options
            </button>
          </div>
        </div>
      </div>
      
      {/* Share Popup */}
      {eventToShare && getEventDetails(eventToShare) && (
        <SharePopup 
          isOpen={!!eventToShare} 
          onClose={() => setEventToShare(null)} 
          {...getEventDetails(eventToShare)!} 
        />
      )}
    </div>
  );
};