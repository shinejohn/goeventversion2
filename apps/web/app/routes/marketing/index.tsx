import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CalendarIcon, MapPinIcon, SearchIcon, ArrowRightIcon, ClockIcon, StarIcon, MicIcon, BuildingIcon, TagIcon, MusicIcon, UtensilsIcon, PaletteIcon, UserIcon, HeartIcon, GlassWaterIcon, SunIcon, CheckIcon, ShareIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, CopyIcon, FacebookIcon, TwitterIcon, LinkedinIcon, MailIcon } from 'lucide-react';

// Inline mockdata
const mockVenues = [{
  id: 'venue-1',
  name: 'The Grand Hall',
  description: 'A spectacular venue perfect for large events and performances',
  capacity: 500,
  pricePerHour: 300,
  location: {
    address: '123 Main Street, Clearwater, FL 33755',
    coordinates: { lat: 27.965853, lng: -82.800102 }
  },
  rating: 4.8,
  reviewCount: 156,
  verified: true,
  responseTimeHours: 4,
  images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  amenities: ['Professional sound system', 'Stage lighting', 'Green room'],
  venueType: 'Performance Hall'
}];

const mockPerformers = [{
  id: 'performer-1',
  name: 'The Sunset Vibes',
  profileImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Rock/Alternative', 'Indie', 'Pop/Top 40'],
  rating: 4.8,
  reviewCount: 42,
  homeCity: 'Clearwater, FL',
  upcomingShows: [{ date: '2024-06-15', venue: 'Capitol Theatre', ticketsAvailable: true }]
}];

// Inline DateSelector
const DateSelector = ({ onDateChange, currentView, setCurrentView }: any) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    onDateChange(selectedDate);
  }, [selectedDate, onDateChange]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <button className="flex items-center text-lg font-semibold text-gray-900 hover:text-indigo-600">
            <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
            {isToday(selectedDate) ? 'Today' : formatDate(selectedDate)}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className={`px-3 py-1.5 text-sm rounded-md ${currentView === 'daily' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
            Daily
          </button>
          <button className={`px-3 py-1.5 text-sm rounded-md ${currentView === 'weekly' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
            Next 7 Days
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline SharePopup
const SharePopup = ({ isOpen, onClose, title, description, url, image }: any) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Share Event</h3>
          <button onClick={onClose}>
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="mb-4">
          <div className="relative">
            <input type="text" value={url} readOnly className="w-full pr-10 py-2 pl-3 border border-gray-300 rounded-md text-sm" />
            <button onClick={handleCopyLink} className="absolute inset-y-0 right-0 px-3 flex items-center">
              {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CopyIcon className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Index() {
  const navigate = useNavigate();
  const navigateTo = (path: string) => navigate(path);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [sharePopupState, setSharePopupState] = useState({
    isOpen: false, title: '', description: '', url: '', image: ''
  });
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [calendarSuccess, setCalendarSuccess] = useState<string | null>(null);

  // Event categories
  const categories = [
    { name: 'All', icon: <StarIcon className="h-6 w-6" />, color: 'bg-gray-100 text-gray-800' },
    { name: 'Music', icon: <MusicIcon className="h-6 w-6" />, color: 'bg-purple-100 text-purple-800' },
    { name: 'Food & Drink', icon: <UtensilsIcon className="h-6 w-6" />, color: 'bg-orange-100 text-orange-800' },
    { name: 'Arts', icon: <PaletteIcon className="h-6 w-6" />, color: 'bg-pink-100 text-pink-800' },
    { name: 'Family', icon: <UserIcon className="h-6 w-6" />, color: 'bg-green-100 text-green-800' },
    { name: 'Nightlife', icon: <GlassWaterIcon className="h-6 w-6" />, color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Outdoor', icon: <SunIcon className="h-6 w-6" />, color: 'bg-blue-100 text-blue-800' },
    { name: 'Free', icon: <HeartIcon className="h-6 w-6" />, color: 'bg-red-100 text-red-800' }
  ];

  // Featured events
  const featuredEvents = [
    {
      id: 'event-1', title: 'Clearwater Jazz Holiday',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: 'Oct 15-18', venue: 'Coachman Park', category: 'Music', price: '$45+'
    },
    {
      id: 'event-2', title: 'Farmers Market on Cleveland',
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: 'Every Saturday', venue: 'Cleveland Street District', category: 'Food & Drink', price: 'Free'
    }
  ];

  const featuredVenues = mockVenues.slice(0, 4).map(venue => ({
    id: venue.id, name: venue.name, image: venue.images[0],
    location: venue.location.address.split(',')[0],
    rating: venue.rating, reviewCount: venue.reviewCount,
    capacity: venue.capacity, venueType: venue.venueType
  }));

  const featuredPerformers = mockPerformers.slice(0, 4).map(performer => ({
    id: performer.id, name: performer.name, image: performer.profileImage,
    genres: performer.genres.slice(0, 2), rating: performer.rating,
    reviewCount: performer.reviewCount, homeCity: performer.homeCity,
    upcomingShow: performer.upcomingShows[0]
  }));

  const handleShareEvent = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    setSharePopupState({
      isOpen: true, title: event.title,
      description: `${event.title} at ${event.venue} on ${event.date}`,
      url: `${window.location.origin}/event/${event.id}`, image: event.image
    });
  };

  const closeSharePopup = () => {
    setSharePopupState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
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
              <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md font-medium">
                Find
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Categories */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2">
        <div className="flex justify-center flex-wrap gap-2">
          {categories.map(category => (
            <button key={category.name} className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${category.color} hover:shadow-md`}>
              <div className="mb-0.5">{category.icon}</div>
              <span className="text-xs font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date Selector */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4">
        <DateSelector onDateChange={setSelectedDate} currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      {/* Featured Events */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">Featured Events</h2>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium text-sm">
              View all events <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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
                    <button onClick={e => handleShareEvent(e, event)} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100">
                      <ShareIcon className="h-4 w-4" />
                    </button>
                    <button className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to discover more events?
        </h2>
        <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Join thousands of locals finding the best things to do in Clearwater every day
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm">
            Explore All Events
          </button>
          <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-md shadow-sm border border-gray-300">
            Sign Up
          </button>
        </div>
      </div>

      <SharePopup isOpen={sharePopupState.isOpen} onClose={closeSharePopup} title={sharePopupState.title} description={sharePopupState.description} url={sharePopupState.url} image={sharePopupState.image} />
    </div>
  );
}
