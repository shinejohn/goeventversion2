import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, ClockIcon, StarIcon, UsersIcon, HeartIcon, ShareIcon, CheckCircleIcon, ArrowLeftIcon, ExternalLinkIcon, MessageCircleIcon, CheckIcon, XIcon, InfoIcon, MusicIcon, DollarSignIcon, WifiIcon, CameraIcon, LayoutIcon, PhoneIcon, GlobeIcon, TicketIcon, UserIcon, CalendarDaysIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
import { mockVenues } from '../../mockdata/venues';
export const VenueDetailPage = () => {
  const {
    id
  } = useParams();
  const {
    navigateTo
  } = useNavigationContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  // Find venue by ID from the URL parameter
  const venue = mockVenues.find(v => v.id === id) || mockVenues[0];
  // Mock upcoming events at this venue
  const upcomingEvents = [{
    id: 'event-1',
    name: 'Summer Jazz Festival',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '7:00 PM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ticketPrice: '$25-45',
    ticketStatus: 'Available'
  }, {
    id: 'event-2',
    name: 'Local Craft Beer Tasting',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: '6:00 PM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ticketPrice: '$35',
    ticketStatus: 'Selling Fast'
  }, {
    id: 'event-3',
    name: 'Comedy Night Showcase',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '8:00 PM - 10:30 PM',
    image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ticketPrice: '$20',
    ticketStatus: 'Limited'
  }, {
    id: 'event-4',
    name: 'Art Exhibition Opening',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: '6:30 PM - 8:30 PM',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ticketPrice: 'Free',
    ticketStatus: 'RSVP Required'
  }, {
    id: 'event-5',
    name: 'Live Band: The Melodics',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    time: '9:00 PM - 12:00 AM',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ticketPrice: '$15',
    ticketStatus: 'Available'
  }];
  // Handle back navigation
  const handleBack = () => {
    navigateTo('/venues');
  };
  // Handle save to favorites
  const handleSave = () => {
    setIsSaved(!isSaved);
  };
  // Handle follow venue
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  // Handle share functionality
  const handleShare = () => {
    alert(`Share ${venue.name}`);
  };
  // Handle navigation to event detail
  const handleViewEvent = eventId => {
    navigateTo(`/events/${eventId}`);
  };
  // Handle message
  const handleContact = () => {
    setShowContactForm(true);
  };
  // Handle ticket purchase
  const handleBuyTickets = eventId => {
    navigateTo(`/events/${eventId}/tickets`);
  };
  if (!venue) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Venue not found</h2>
          <p className="mt-2 text-gray-600">
            The venue you're looking for doesn't exist.
          </p>
          <button onClick={() => navigateTo('/venues')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Return to Venues
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96">
        <div className="absolute inset-0">
          <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <button onClick={handleBack} className="mb-4 inline-flex items-center text-white hover:text-gray-200">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Venues
            </button>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center">
                  {venue.name}
                  {venue.verified && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                      Verified
                    </span>}
                </h1>
                <div className="flex items-center mt-2 text-white/90">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  <span>{venue.location.address}</span>
                </div>
                <div className="flex items-center mt-2 text-white/90">
                  <UsersIcon className="h-5 w-5 mr-1" />
                  <span>Capacity: {venue.capacity}</span>
                  <span className="mx-3">|</span>
                  <StarIcon className="h-5 w-5 mr-1 text-yellow-400" />
                  <span>
                    {venue.rating} ({venue.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button onClick={handleSave} className={`p-2 rounded-full ${isSaved ? 'bg-pink-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                  <HeartIcon className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button onClick={handleFollow} className={`p-2 rounded-full ${isFollowing ? 'bg-blue-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                  <CalendarDaysIcon className="h-5 w-5" />
                </button>
                <button onClick={handleShare} className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[{
            id: 'overview',
            label: 'Overview'
          }, {
            id: 'events',
            label: 'Upcoming Events'
          }, {
            id: 'specs',
            label: 'Specifications'
          }, {
            id: 'amenities',
            label: 'Amenities'
          }, {
            id: 'photos',
            label: 'Photos'
          }, {
            id: 'reviews',
            label: 'Reviews'
          }, {
            id: 'location',
            label: 'Location'
          }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {tab.label}
              </button>)}
          </nav>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && <div>
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About This Venue
                  </h2>
                  <p className="text-gray-700 mb-6">{venue.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Venue Type
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {venue.venueType}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Best For
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {['Concerts', 'Corporate Events', 'Private Parties', 'Weddings'].map((type, index) => <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            {type}
                          </span>)}
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Key Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {venue.amenities.slice(0, 8).map((amenity, index) => <div key={index} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>)}
                  </div>
                </section>
                <section className="mb-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Upcoming Events
                    </h2>
                    <button onClick={() => setActiveTab('events')} className="text-indigo-600 font-medium flex items-center hover:text-indigo-800">
                      View all events
                      <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 3).map(event => <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-40 h-32 md:h-auto overflow-hidden bg-gray-200 flex-shrink-0">
                            <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>
                                {event.date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                              </span>
                              <span className="mx-2">•</span>
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <span>{event.time}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900">
                              {event.name}
                            </h3>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-sm">
                                <span className="font-medium text-gray-900">
                                  {event.ticketPrice}
                                </span>
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                  {event.ticketStatus}
                                </span>
                              </div>
                              <button onClick={() => handleBuyTickets(event.id)} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 flex items-center">
                                <TicketIcon className="h-3 w-3 mr-1" />
                                Get Tickets
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Photo Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {venue.images.slice(0, 6).map((image, index) => <div key={index} className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                        <img src={image} alt={`${venue.name} - Image ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>)}
                  </div>
                  <button className="mt-4 text-indigo-600 font-medium flex items-center hover:text-indigo-800" onClick={() => setActiveTab('photos')}>
                    View all photos
                    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </section>
              </div>}
            {activeTab === 'events' && <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Upcoming Events at {venue.name}
                </h2>
                <div className="space-y-6">
                  {upcomingEvents.map(event => <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-48 md:h-auto bg-gray-200">
                          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>
                              {event.date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                            </span>
                            <span className="mx-2">•</span>
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>{event.time}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {event.name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Join us at {venue.name} for an unforgettable
                            experience featuring live entertainment, great
                            atmosphere, and more.
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-gray-900 font-medium">
                                {event.ticketPrice}
                              </div>
                              <div className="text-sm text-gray-500">
                                {event.ticketStatus}
                              </div>
                            </div>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center" onClick={() => handleBuyTickets(event.id)}>
                              <TicketIcon className="h-4 w-4 mr-1" />
                              Get Tickets
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>}
            {activeTab === 'specs' && <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Venue Specifications
                </h2>
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Capacity
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <UsersIcon className="h-6 w-6 mx-auto text-indigo-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {venue.capacity}
                      </div>
                      <div className="text-sm text-gray-500">Standing</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <UsersIcon className="h-6 w-6 mx-auto text-indigo-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.floor(venue.capacity * 0.7)}
                      </div>
                      <div className="text-sm text-gray-500">Seated</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <LayoutIcon className="h-6 w-6 mx-auto text-indigo-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.floor(venue.capacity * 0.8)}
                      </div>
                      <div className="text-sm text-gray-500">Theater Style</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <LayoutIcon className="h-6 w-6 mx-auto text-indigo-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.floor(venue.capacity * 0.6)}
                      </div>
                      <div className="text-sm text-gray-500">Banquet Style</div>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Physical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">
                        Total Square Footage
                      </span>
                      <span className="font-medium text-gray-900">
                        5,200 sq ft
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Ceiling Height</span>
                      <span className="font-medium text-gray-900">18 ft</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Stage Size</span>
                      <span className="font-medium text-gray-900">
                        20 ft x 15 ft
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Dance Floor Size</span>
                      <span className="font-medium text-gray-900">
                        30 ft x 30 ft
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Loading Access</span>
                      <span className="font-medium text-gray-900">
                        Rear loading dock
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Elevator Access</span>
                      <span className="font-medium text-gray-900">
                        Yes, freight elevator
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Restrooms</span>
                      <span className="font-medium text-gray-900">
                        4 (2 per gender)
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">
                        Accessible Facilities
                      </span>
                      <span className="font-medium text-gray-900">
                        Yes, ADA compliant
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Sound System</span>
                      <span className="font-medium text-gray-900">
                        Professional PA system
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Lighting</span>
                      <span className="font-medium text-gray-900">
                        Programmable LED system
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Internet</span>
                      <span className="font-medium text-gray-900">
                        1 Gbps fiber
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Power</span>
                      <span className="font-medium text-gray-900">
                        200A, 3-phase
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Projector/Screens</span>
                      <span className="font-medium text-gray-900">
                        4K projector, 2 screens
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Microphones</span>
                      <span className="font-medium text-gray-900">
                        8 wireless, 12 wired
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Sound Limitations</span>
                      <span className="font-medium text-gray-900">
                        85dB after 10PM
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Climate Control</span>
                      <span className="font-medium text-gray-900">
                        Zoned HVAC system
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Floor Plan
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1532094349884-543019a69b2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Floor Plan" className="w-full h-auto" />
                  </div>
                </div>
              </div>}
            {activeTab === 'amenities' && <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Amenities & Services
                </h2>
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Included Amenities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {venue.amenities.map((amenity, index) => <div key={index} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>)}
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Services & Facilities
                  </h3>
                  <div className="space-y-4">
                    {[{
                  name: 'Food & Drink',
                  description: 'Full-service bar with craft cocktails and local beer selection',
                  icon: <div className="h-6 w-6 text-indigo-600" />
                }, {
                  name: 'Seating Options',
                  description: 'Mix of standing room, bar seating, and table service areas',
                  icon: <div className="h-6 w-6 text-indigo-600" />
                }, {
                  name: 'Accessibility',
                  description: 'ADA compliant with wheelchair access and accessible restrooms',
                  icon: <div className="h-6 w-6 text-indigo-600" />
                }, {
                  name: 'Coat Check',
                  description: 'Available during events for a small fee',
                  icon: <div className="h-6 w-6 text-indigo-600" />
                }, {
                  name: 'VIP Areas',
                  description: 'Private sections available for reservation',
                  icon: <div className="h-6 w-6 text-indigo-600" />
                }, {
                  name: 'Smoking Area',
                  description: 'Designated outdoor smoking section',
                  icon: <div className="h-6 w-6 text-indigo-600" />
                }].map((service, index) => <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            {service.icon}
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="font-medium text-gray-900">
                              {service.name}
                            </h4>
                            <p className="mt-1 text-gray-600">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>}
            {activeTab === 'photos' && <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Photo Gallery
                </h2>
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Interior
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {venue.images.slice(0, 6).map((image, index) => <div key={index} className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                        <img src={image} alt={`${venue.name} Interior - Image ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>)}
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Past Events
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => <div key={index} className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                        <img src={`https://images.unsplash.com/photo-${1520000000000 + index * 10000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} alt={`${venue.name} Event - Image ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Virtual Tour
                  </h3>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <CameraIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">
                          Virtual tour would be embedded here
                        </p>
                        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                          Launch Virtual Tour
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            {activeTab === 'reviews' && <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Reviews & Ratings
                  </h2>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Write a Review
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="text-center md:text-left md:mr-10">
                      <div className="text-5xl font-bold text-gray-900">
                        {venue.rating}
                      </div>
                      <div className="flex items-center justify-center md:justify-start mt-2">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-5 w-5 ${i < Math.floor(venue.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                      </div>
                      <div className="mt-1 text-gray-600">
                        {venue.reviewCount} reviews
                      </div>
                    </div>
                    <div className="mt-6 md:mt-0 flex-1">
                      <div className="space-y-3">
                        {[{
                      label: 'Sound Quality',
                      rating: 4.7
                    }, {
                      label: 'Staff',
                      rating: 4.8
                    }, {
                      label: 'Location',
                      rating: 4.5
                    }, {
                      label: 'Value',
                      rating: 4.3
                    }, {
                      label: 'Amenities',
                      rating: 4.6
                    }].map((item, index) => <div key={index} className="flex items-center">
                            <span className="w-32 text-sm text-gray-600">
                              {item.label}
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3">
                              <div className="h-2 bg-indigo-600 rounded-full" style={{
                          width: `${item.rating / 5 * 100}%`
                        }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {item.rating}
                            </span>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  {[...Array(5)].map((_, index) => <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                            <img src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${index + 1}.jpg`} alt="Reviewer" className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium text-gray-900">
                              {['Sarah L.', 'Michael R.', 'Jennifer K.', 'David B.', 'Emma S.'][index]}
                            </h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < 5 - index % 2 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                              <span className="ml-2 text-sm text-gray-600">
                                {['June 15, 2023', 'May 22, 2023', 'April 10, 2023', 'March 5, 2023', 'February 20, 2023'][index]}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {['Concert Attendee', 'Regular Patron', 'First-time Visitor', 'VIP Guest', 'Local Resident'][index]}
                        </div>
                      </div>
                      <div className="mt-4 text-gray-700">
                        {['This venue is absolutely amazing! The sound quality was perfect for the concert, and the staff was incredibly helpful throughout the night. Would definitely come back for future events.', 'I', 'First time visiting and I was impressed with the layout and vibe. It', 'The VIP section is well worth the extra cost. Great view of the stage, dedicated server, and comfortable seating. This is my go-to venue for special occasions.', 'As someone who lives nearby, I appreciate having such a high-quality venue in the neighborhood. They'][index]}
                      </div>
                      {index === 0 && <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-indigo-600 font-medium">
                                V
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">
                                Venue Response
                              </div>
                              <div className="mt-1 text-gray-700">
                                Thank you for your kind words, Sarah! We're so
                                glad you enjoyed your experience with us and
                                hope to see you at future events.
                              </div>
                            </div>
                          </div>
                        </div>}
                    </div>)}
                </div>
              </div>}
            {activeTab === 'location' && <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Location & Access
                </h2>
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden mb-8">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MapPinIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">
                        Map would be embedded here
                      </p>
                      <a href={`https://maps.google.com/?q=${venue.location.coordinates.lat},${venue.location.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center">
                        Open in Google Maps
                        <ExternalLinkIcon className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Parking Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-gray-700 mb-4">
                        200 spaces available in attached garage. $10 per vehicle
                        for event parking.
                      </p>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Additional Parking Options:
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">
                            Public parking garage 1 block away ($15)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">
                            Street parking available (metered until 8pm)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">
                            Valet parking available for special events
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Public Transportation
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Bus
                          </h4>
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium mr-2">
                              B
                            </div>
                            <span className="text-gray-700">
                              Routes 52, 60 (0.2 miles)
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Train
                          </h4>
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-medium mr-2">
                              T
                            </div>
                            <span className="text-gray-700">
                              Blue Line (0.5 miles)
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Ride Share
                          </h4>
                          <p className="text-gray-700">
                            Dedicated pickup/dropoff area at main entrance
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Neighborhood
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Located in the heart of downtown, surrounded by hotels,
                    restaurants, and nightlife. Walking distance to the
                    waterfront and cultural attractions.
                  </p>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Nearby Amenities:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="h-6 w-6 text-indigo-600 mr-2" />
                      <div>
                        <span className="font-medium text-gray-900">
                          Hotels
                        </span>
                        <p className="text-sm text-gray-600">
                          3 hotels within 2 blocks
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-6 w-6 text-indigo-600 mr-2" />
                      <div>
                        <span className="font-medium text-gray-900">
                          Restaurants
                        </span>
                        <p className="text-sm text-gray-600">
                          15+ restaurants within walking distance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-6 w-6 text-indigo-600 mr-2" />
                      <div>
                        <span className="font-medium text-gray-900">
                          Bars & Nightlife
                        </span>
                        <p className="text-sm text-gray-600">
                          10+ bars within walking distance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-6 w-6 text-indigo-600 mr-2" />
                      <div>
                        <span className="font-medium text-gray-900">
                          Attractions
                        </span>
                        <p className="text-sm text-gray-600">
                          Art museum, waterfront park, theater
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
          </div>
          {/* Sidebar Column */}
          <div>
            <div className="sticky top-8">
              {/* Venue Info Widget */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Venue Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <span className="block text-gray-900">Hours</span>
                        <span className="block text-gray-600">
                          Mon-Thu: 5PM-12AM
                          <br />
                          Fri-Sat: 5PM-2AM
                          <br />
                          Sun: 6PM-11PM
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <span className="block text-gray-900">Contact</span>
                        <span className="block text-gray-600">
                          (555) 123-4567
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <GlobeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <span className="block text-gray-900">Website</span>
                        <a href="#" className="block text-indigo-600 hover:text-indigo-800">
                          www.{venue.name.toLowerCase().replace(/\s+/g, '')}.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MusicIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <span className="block text-gray-900">Venue Type</span>
                        <span className="block text-gray-600">
                          {venue.venueType}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <UsersIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <span className="block text-gray-900">Capacity</span>
                        <span className="block text-gray-600">
                          Up to {venue.capacity} guests
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSignIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <span className="block text-gray-900">Price Range</span>
                        <span className="block text-gray-600">
                          {'$'.repeat(venue.priceRange || 2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button onClick={handleContact} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 flex items-center justify-center">
                      <MessageCircleIcon className="h-4 w-4 mr-2" />
                      Contact Venue
                    </button>
                    <button onClick={handleFollow} className={`w-full mt-3 py-2 px-4 rounded-md font-medium flex items-center justify-center ${isFollowing ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'}`}>
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {isFollowing ? 'Following' : 'Follow for Updates'}
                    </button>
                  </div>
                </div>
              </div>
              {/* Upcoming Events Widget */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium text-gray-900">Upcoming Events</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 3).map(event => <div key={event.id} className="flex items-start">
                        <div className="flex-shrink-0 w-12 text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {event.date.getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.date.toLocaleDateString('en-US', {
                          month: 'short'
                        })}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {event.name}
                          </h4>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                        </div>
                        <button onClick={() => handleBuyTickets(event.id)} className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700">
                          Tickets
                        </button>
                      </div>)}
                  </div>
                  <button onClick={() => setActiveTab('events')} className="mt-4 w-full text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center justify-center">
                    View all events
                    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Similar Venues */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium text-gray-900">Similar Venues</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockVenues.filter(v => v.id !== venue.id && v.venueType === venue.venueType).slice(0, 3).map(similarVenue => <div key={similarVenue.id} className="flex items-start">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                            <img src={similarVenue.images[0]} alt={similarVenue.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {similarVenue.name}
                            </h4>
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <StarIcon className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                              {similarVenue.rating} ({similarVenue.reviewCount}{' '}
                              reviews)
                            </div>
                          </div>
                          <button onClick={() => navigateTo(`/venues/${similarVenue.id}`)} className="ml-2 text-xs text-indigo-600 font-medium hover:text-indigo-800">
                            View
                          </button>
                        </div>)}
                  </div>
                  <button onClick={() => navigateTo('/venues')} className="mt-4 w-full text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center justify-center">
                    Explore more venues
                    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form Popup */}
      {showContactForm && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Contact {venue.name}
              </h3>
              <button onClick={() => setShowContactForm(false)} className="text-gray-400 hover:text-gray-500">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input type="text" placeholder="Enter your name" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input type="email" placeholder="Enter your email" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input type="tel" placeholder="Enter your phone number" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="event">Event Information</option>
                    <option value="reservation">Reservation</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea rows={4} placeholder="What would you like to know about this venue?" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                </div>
                <div className="flex items-start">
                  <input id="subscribe" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
                  <label htmlFor="subscribe" className="ml-2 block text-sm text-gray-700">
                    Subscribe to receive updates about events at this venue
                  </label>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <button onClick={() => setShowContactForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => {
              setShowContactForm(false);
              alert('Your message has been sent! The venue will respond shortly.');
            }} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};