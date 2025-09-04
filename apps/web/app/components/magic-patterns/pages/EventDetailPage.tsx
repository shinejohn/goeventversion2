import React, { useState, Component } from 'react';
/**
 * Page: Event Detail
 * Type: SSR
 * Mockdata: Yes
 * Description: Comprehensive event information page showcasing full details, ticketing options, venue information, and social engagement features
 * Components: EventHero, ContentTabs, VenueMap
 */
import { ArrowLeftIcon, ShareIcon, HeartIcon, FlameIcon, MapPinIcon, UsersIcon, SunIcon, CloudIcon, CloudRainIcon, ClockIcon, CalendarIcon, TagIcon, UserIcon, TicketIcon, ArrowRightIcon, InfoIcon, MusicIcon, UtensilsIcon, StarIcon, CheckCircleIcon, CarIcon, BusIcon, BikeIcon, ChevronDownIcon, AlertCircleIcon, XIcon } from 'lucide-react';
import { ClientOnly } from '@kit/ui/client-only';
// Import components
import { EventHero } from '../components/events/EventHero';
import { ContentTabs } from '../components/events/ContentTabs';
import { VenueMap } from '../components/events/VenueMap';
import { RelatedEvents } from '../components/events/RelatedEvents';
import { useNavigate } from 'react-router';
import { mockEvents } from '../mockdata/events';

// Default event data (fallback)
const defaultEventData = {
  id: 'event-1',
  slug: 'clearwater-jazz-holiday-2024',
  title: 'Clearwater Jazz Holiday',
  description: `<p>The Clearwater Jazz Holiday is a premier music festival celebrating its 45th anniversary in 2024. Join us for four days of exceptional jazz, funk, blues, and more at the beautiful waterfront Coachman Park in downtown Clearwater.</p>
  <p>This year's lineup features an impressive roster of Grammy-winning artists, emerging talents, and local favorites across three stages. Enjoy delicious food from local vendors, craft beverages, and a vibrant atmosphere that celebrates the rich cultural heritage of jazz music.</p>
  <p>The festival is more than just music - it's a community celebration that supports music education through the Clearwater Jazz Holiday Foundation. A portion of all ticket sales goes directly to funding music programs in local schools.</p>`,
  image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
  date: new Date(2024, 9, 15, 17, 0),
  endDate: new Date(2024, 9, 18, 23, 0),
  venue: {
    id: 'venue-1',
    name: 'Coachman Park',
    verified: true,
    address: '301 Drew St, Clearwater, FL 33755',
    neighborhood: 'Downtown',
    latitude: 27.9659,
    longitude: -82.8001,
    description: 'Newly renovated waterfront park with amphitheater and green spaces',
    amenities: ['Restrooms', 'Food vendors', 'Water stations', 'First aid'],
    parking: [{
      name: 'Main Parking Garage',
      address: '28 N Garden Ave',
      price: 15,
      walkingTime: 5
    }, {
      name: 'City Hall Lot',
      address: '112 S Osceola Ave',
      price: 10,
      walkingTime: 8
    }, {
      name: 'Street Parking',
      address: 'Various locations',
      price: 5,
      walkingTime: 'Varies'
    }],
    transit: [{
      type: 'Bus',
      routes: ['60', '61'],
      stop: 'Drew St & Osceola Ave',
      distance: '0.1 miles'
    }, {
      type: 'Trolley',
      routes: ['Jolley Trolley'],
      stop: 'Coachman Park',
      distance: '0 miles'
    }],
    nearbyAmenities: [{
      type: 'restaurant',
      name: 'Clear Sky on Cleveland',
      distance: '0.3 miles'
    }, {
      type: 'bar',
      name: 'The District Lounge',
      distance: '0.2 miles'
    }, {
      type: 'hotel',
      name: 'Marriott Residence Inn',
      distance: '0.4 miles'
    }]
  },
  organizer: {
    id: 'org-1',
    name: 'Clearwater Jazz Holiday Foundation',
    verified: true,
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    description: 'Non-profit organization supporting music education',
    events: 45,
    followers: 2800
  },
  series: {
    id: 'series-1',
    name: 'Clearwater Jazz Holiday',
    recurring: 'Annual',
    years: 45
  },
  price: {
    isFree: false,
    tiers: [{
      name: 'General Admission',
      price: 25,
      description: 'Lawn seating, bring your own chair or blanket'
    }, {
      name: 'Reserved Seating',
      price: 75,
      description: 'Assigned seat in covered area'
    }, {
      name: 'VIP Package',
      price: 150,
      description: 'Premium seating, exclusive lounge access, complimentary food & drink'
    }]
  },
  ticketInfo: {
    required: true,
    available: true,
    status: 'on_sale',
    salesStart: new Date(2024, 5, 1, 10, 0),
    salesEnd: new Date(2024, 9, 15, 17, 0),
    url: 'https://example.com/tickets/clearwater-jazz-holiday',
    provider: 'TicketMaster',
    limits: {
      perPerson: 8,
      minPurchase: 1
    },
    fees: {
      service: 3.5,
      facility: 2.0
    },
    refundPolicy: 'Full refunds available up to 7 days before the event. No refunds after that date.',
    transferable: true,
    willCallAvailable: true,
    digitalDelivery: true,
    specialInstructions: 'Tickets will be emailed 48 hours before the event. Please bring a printed copy or show on your mobile device.'
  },
  ageRestriction: 'All Ages',
  duration: '4 days',
  categories: ['Music', 'Jazz', 'Festival', 'Live Entertainment', 'Outdoor'],
  primaryCategory: 'Music',
  highlights: ['45th anniversary celebration', '30+ artists across 3 stages', 'Waterfront views', 'Local food vendors', 'Craft beer garden', 'Family-friendly activities'],
  whatToBring: ['Lawn chairs or blankets (for general admission)', 'Sunscreen', 'Hat and sunglasses', 'Cash for vendors', 'Refillable water bottle'],
  accessibility: [{
    type: 'wheelchair',
    available: true,
    details: 'ADA seating areas and ramps throughout venue'
  }, {
    type: 'hearing',
    available: true,
    details: 'Assistive listening devices available at info booth'
  }, {
    type: 'parking',
    available: true,
    details: 'Designated ADA parking spaces in all lots'
  }],
  lineup: [{
    day: 'Thursday, October 15',
    acts: [{
      name: 'Local Jazz Ensemble',
      startTime: '5:00 PM',
      endTime: '6:30 PM',
      stage: 'Main Stage',
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }, {
      name: 'Smooth Jazz Quartet',
      startTime: '7:00 PM',
      endTime: '8:30 PM',
      stage: 'Main Stage',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }, {
      name: 'Grammy Winner Headliner',
      startTime: '9:00 PM',
      endTime: '11:00 PM',
      stage: 'Main Stage',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }]
  }, {
    day: 'Friday, October 16',
    acts: [{
      name: 'Student Jazz Band',
      startTime: '4:00 PM',
      endTime: '5:00 PM',
      stage: 'Bayview Stage',
      image: 'https://images.unsplash.com/photo-1461784180009-27c1303a64b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }, {
      name: 'Blues Legends',
      startTime: '5:30 PM',
      endTime: '7:00 PM',
      stage: 'Main Stage',
      image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }, {
      name: 'Funk Fusion Group',
      startTime: '7:30 PM',
      endTime: '9:00 PM',
      stage: 'Main Stage',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }, {
      name: 'International Jazz Star',
      startTime: '9:30 PM',
      endTime: '11:00 PM',
      stage: 'Main Stage',
      image: 'https://images.unsplash.com/photo-1549761505-a64e09bff326?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }]
  }],
  reviews: {
    average: 4.7,
    count: 156,
    items: [{
      user: {
        name: 'Sarah Johnson',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
      },
      rating: 5,
      date: new Date(2023, 9, 20),
      text: 'Amazing festival! Great music, beautiful setting, and well organized. Will definitely be back next year!'
    }, {
      user: {
        name: 'Michael Chen',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
      },
      rating: 4,
      date: new Date(2023, 9, 19),
      text: 'Fantastic lineup this year. Only complaint was the long lines for food vendors, but the music more than made up for it.'
    }, {
      user: {
        name: 'Emily Rodriguez',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
      },
      rating: 5,
      date: new Date(2023, 9, 18),
      text: 'The VIP package was worth every penny! Great views, comfortable seating, and the complimentary food was delicious.'
    }]
  },
  questions: [{
    question: 'Is outside food and drink allowed?',
    answer: 'Outside food is permitted, but outside alcohol is prohibited. There will be various food vendors and beverage stations throughout the venue.',
    answeredBy: 'Organizer',
    date: new Date(2024, 8, 5)
  }, {
    question: 'Are pets allowed at the festival?',
    answer: 'Only service animals are permitted within the festival grounds.',
    answeredBy: 'Organizer',
    date: new Date(2024, 7, 28)
  }],
  socialProof: {
    attending: 1250,
    interested: 3500,
    friendsAttending: [{
      id: 'user-1',
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
    }, {
      id: 'user-2',
      name: 'Michael Chen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
    }, {
      id: 'user-3',
      name: 'Emily Rodriguez',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
    }, {
      id: 'user-4',
      name: 'David Wilson',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
    }, {
      id: 'user-5',
      name: 'Jessica Patel',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
    }],
    localAttending: 850
  },
  contextInfo: {
    popularity: 'Popular in Clearwater',
    distance: {
      minutes: 5,
      mode: 'drive',
      from: 'downtown'
    },
    weather: {
      condition: 'sunny',
      temperature: 82,
      forecast: 'Clear skies expected'
    }
  }
};

const EventDetailPageInternal = ({ eventId = 'event-1', event: propEvent, relatedEvents: propRelatedEvents, attendeeCount: propAttendeeCount }: EventDetailPageProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const navigate = useNavigate();

  // Use prop event data if provided, otherwise fallback to mock data
  const eventData = propEvent ? {
    ...propEvent,
    // Transform database date to JavaScript Date object
    date: new Date(propEvent.start_date),
    endDate: new Date(propEvent.end_date),
    // Add missing properties that the component expects with fallbacks
    lineup: [{
      day: 'Performance Day',
      acts: [{
        name: propEvent.title || 'Featured Performance',
        startTime: new Date(propEvent.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        endTime: new Date(propEvent.end_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        stage: 'Main Stage',
        image: propEvent.image_url || propEvent.image
      }]
    }],
    amenities: propEvent.amenities ? Object.keys(propEvent.amenities).filter(key => propEvent.amenities[key]) : ['Food vendors', 'Restrooms', 'Parking'],
    parking: [{
      name: 'Main Parking',
      address: 'Near venue',
      price: 10,
      walkingTime: 5
    }],
    weather: {
      temperature: 75,
      condition: 'Clear',
      forecast: 'Perfect weather expected'
    }
  } : (mockEvents.find(event => event.id === eventId) || defaultEventData);
  // Format date for display
  const formatEventDate = date => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const formatEventTime = date => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  // Get weather icon based on condition
  const getWeatherIcon = condition => {
    switch (condition) {
      case 'sunny':
        return <SunIcon className="h-5 w-5 text-yellow-500" />;
      case 'cloudy':
        return <CloudIcon className="h-5 w-5 text-gray-400" />;
      case 'rainy':
        return <CloudRainIcon className="h-5 w-5 text-blue-400" />;
      default:
        return <SunIcon className="h-5 w-5 text-yellow-500" />;
    }
  };
  // Handle ticket purchase
  const handleGetTickets = () => {
    // Navigate to ticket purchase page for this specific event
    navigate(`/tickets/${eventData.id}`);
  };
  // Handle save functionality
  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    // Here we would typically call an API to save/unsave the event
    // For now, we'll just show a toast message
    if (newSavedState) {
      // alert(`Event saved to your favorites!`);
      console.log(`Event saved to your favorites!`);
    } else {
      // alert(`Event removed from your favorites.`);
      console.log(`Event removed from your favorites.`);
    }
  };
  // Handle share functionality
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      typeof navigator !== "undefined" && navigator.share({
        title: eventData.title,
        text: `Check out ${eventData.title}`,
        url: window.location.href
      }).catch(err => {
        // alert('Sharing functionality: ' + eventData.title);
        console.error('Share failed:', error);
      });
    } else {
      // alert('Sharing functionality: ' + eventData.title);
      console.log('Sharing functionality: ' + eventData.title);
    }
  };
  // Handle add to calendar with specific calendar type
  const handleAddToCalendar = type => {
    // alert(`Added to ${type}: ${eventData.title} on ${formatEventDate(eventData.date)}`);
    console.log(`Added to ${type}: ${eventData.title} on ${formatEventDate(eventData.date)}`);
  };
  // Handle invite friends
  const handleInviteFriends = () => {
    // alert('Opening friend selection dialog to invite friends to this event');
    console.log('Opening friend selection dialog to invite friends to this event');
  };
  // Get ticket status text and color
  const getTicketStatus = () => {
    if (!eventData.ticketInfo?.required) {
      return {
        text: 'No Ticket Required',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      };
    }
    if (!eventData.ticketInfo?.available) {
      return {
        text: 'Sold Out',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      };
    }
    const now = new Date();
    const salesStart = eventData.ticketInfo.salesStart;
    const salesEnd = eventData.ticketInfo.salesEnd;
    if (now < salesStart) {
      return {
        text: `On Sale ${formatEventDate(salesStart)}`,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      };
    }
    if (now > salesEnd) {
      return {
        text: 'Sales Ended',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800'
      };
    }
    switch (eventData.ticketInfo.status) {
      case 'selling_fast':
        return {
          text: 'Selling Fast',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800'
        };
      case 'almost_sold_out':
        return {
          text: 'Almost Sold Out',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
      default:
        return {
          text: 'Tickets Available',
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-800'
        };
    }
  };
  const ticketStatus = getTicketStatus();
  return <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <EventHero image={eventData.image} title={eventData.title} date={eventData.date} endDate={eventData.endDate} isSaved={isSaved} onSaveToggle={() => setIsSaved(!isSaved)} />
      {/* Community Context Bar */}
      <div className="bg-indigo-50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-y-2">
            <div className="flex items-center text-sm">
              <FlameIcon className="h-4 w-4 text-orange-500 mr-1" />
              <span className="font-medium text-gray-800">
                {eventData.contextInfo.popularity}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-gray-700">
                {eventData.contextInfo.distance.minutes} min{' '}
                {eventData.contextInfo.distance.mode} from{' '}
                {eventData.contextInfo.distance.from}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <UsersIcon className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-gray-700">
                {eventData.socialProof.localAttending} neighbors interested
              </span>
            </div>
            <div className="flex items-center text-sm">
              {getWeatherIcon(eventData.contextInfo.weather.condition)}
              <span className="ml-1 text-gray-700">
                {eventData.contextInfo.weather.temperature}°F expected
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Primary Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Price
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {eventData.price.isFree ? <span className="text-lg font-semibold text-green-600">
                        Free
                      </span> : eventData.price.tiers.map((tier, index) => <div key={index} className="flex items-center">
                          {index > 0 && <span className="mx-1 text-gray-400">•</span>}
                          <span className="text-base font-medium">
                            ${tier.price}{' '}
                            <span className="text-sm font-normal text-gray-500">
                              {tier.name}
                            </span>
                          </span>
                        </div>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Age Restriction
                  </h3>
                  <p className="text-base font-medium">
                    {eventData.ageRestriction}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Duration
                  </h3>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-base font-medium">
                      {eventData.duration}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {eventData.categories.slice(0, 3).map((category, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 cursor-pointer hover:bg-indigo-200" onClick={() => console.log(`Showing all ${category} events`)}>
                        {category}
                      </span>)}
                    {eventData.categories.length > 3 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200" onClick={() => console.log('Showing all categories for this event')}>
                        +{eventData.categories.length - 3} more
                      </span>}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between border-t border-gray-200 pt-6">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img src={eventData.organizer.image} alt={eventData.organizer.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Organized by
                    </p>
                    <a href="#" onClick={e => {
                    e.preventDefault();
                    console.log(`Viewing organizer: ${eventData.organizer.name}`);
                  }} className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      {eventData.organizer.name}
                      {eventData.organizer.verified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
                    </a>
                  </div>
                </div>
                {eventData.series && <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Part of a series
                      </p>
                      <a href="#" onClick={e => {
                    e.preventDefault();
                    console.log(`Viewing series: ${eventData.series.name}`);
                  }} className="text-indigo-600 hover:text-indigo-800 font-medium">
                        {eventData.series.name} • {eventData.series.years} years
                      </a>
                    </div>
                  </div>}
              </div>
            </div>
            {/* Ticket Status Section (if tickets required) */}
            {eventData.ticketInfo?.required && <div className={`${ticketStatus.bgColor} rounded-lg border border-gray-200 p-4 mb-6`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <TicketIcon className={`h-5 w-5 ${ticketStatus.textColor} mr-2`} />
                    <div>
                      <h3 className={`font-medium ${ticketStatus.textColor}`}>
                        {ticketStatus.text}
                      </h3>
                      {eventData.ticketInfo.available && <p className="text-sm text-gray-700 mt-1">
                          {eventData.price.isFree ? 'This is a free event, but registration is required.' : `Prices from $${Math.min(...eventData.price.tiers.map(tier => tier.price))}`}
                        </p>}
                    </div>
                  </div>
                  {eventData.ticketInfo.available && <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        via {eventData.ticketInfo.provider}
                      </span>
                      <button onClick={handleGetTickets} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                        {eventData.price.isFree ? 'Register' : 'Get Tickets'}
                      </button>
                    </div>}
                </div>
              </div>}
            {/* Action Buttons */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-wrap gap-3">
                <button onClick={handleGetTickets} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center">
                  <TicketIcon className="h-5 w-5 mr-2" />
                  Get Tickets
                </button>
                <button onClick={handleSave} className={`px-6 py-3 rounded-md font-medium flex items-center justify-center ${isSaved ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <HeartIcon className={`h-5 w-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  Saved ({eventData.socialProof.interested})
                </button>
                <button onClick={handleShare} className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-medium flex items-center justify-center">
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Share
                </button>
                <div className="relative group">
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-medium flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Add to Calendar
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <a href="#" onClick={e => {
                    e.preventDefault();
                    handleAddToCalendar('Google Calendar');
                  }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Google Calendar
                    </a>
                    <a href="#" onClick={e => {
                    e.preventDefault();
                    handleAddToCalendar('Apple Calendar');
                  }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Apple Calendar
                    </a>
                    <a href="#" onClick={e => {
                    e.preventDefault();
                    handleAddToCalendar('Outlook');
                  }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Outlook
                    </a>
                    <a href="#" onClick={e => {
                    e.preventDefault();
                    handleAddToCalendar('iCal');
                  }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Download .ics
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Content Tabs */}
            <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} eventData={eventData} />
          </div>
          {/* Right Column - Sidebar */}
          <div>
            {/* Ticket Information (if tickets required) */}
            {eventData.ticketInfo?.required && eventData.ticketInfo.available && <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <TicketIcon className="h-5 w-5 text-indigo-500 mr-2" />
                      Ticket Information
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {eventData.price.tiers.map((tier, index) => <div key={index} className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {tier.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {tier.description}
                            </p>
                          </div>
                          <span className="font-bold text-gray-900">
                            ${tier.price}
                          </span>
                        </div>)}
                      {(eventData.ticketInfo.fees?.service || eventData.ticketInfo.fees?.facility) && <div className="pt-3 mt-3 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Additional Fees
                          </h4>
                          {eventData.ticketInfo.fees.service > 0 && <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Service Fee</span>
                              <span>
                                ${eventData.ticketInfo.fees.service.toFixed(2)}
                              </span>
                            </div>}
                          {eventData.ticketInfo.fees.facility > 0 && <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Facility Fee
                              </span>
                              <span>
                                ${eventData.ticketInfo.fees.facility.toFixed(2)}
                              </span>
                            </div>}
                        </div>}
                      <div className="pt-3 mt-3 border-t border-gray-100 text-sm text-gray-600">
                        {eventData.ticketInfo.limits && <div className="mb-2">
                            <span className="font-medium">Limits:</span>{' '}
                            {eventData.ticketInfo.limits.minPurchase} min,{' '}
                            {eventData.ticketInfo.limits.perPerson} max per
                            person
                          </div>}
                        {eventData.ticketInfo.salesEnd && <div className="mb-2">
                            <span className="font-medium">Sales end:</span>{' '}
                            {formatEventDate(eventData.ticketInfo.salesEnd)}
                          </div>}
                        {eventData.ticketInfo.refundPolicy && <div className="mb-2">
                            <span className="font-medium">Refund policy:</span>{' '}
                            {eventData.ticketInfo.refundPolicy}
                          </div>}
                      </div>
                      <button onClick={handleGetTickets} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                        {eventData.price.isFree ? 'Register Now' : 'Get Tickets'}
                      </button>
                    </div>
                  </div>
                </div>}
            {/* Venue Map Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                  Venue Location
                </h3>
              </div>
              <div className="h-48 bg-gray-200">
                <VenueMap latitude={eventData.venue.latitude} longitude={eventData.venue.longitude} venueName={eventData.venue.name} />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center">
                      {eventData.venue.name}
                      {eventData.venue.verified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {eventData.venue.address}
                    </p>
                  </div>
                  <a href={`https://maps.google.com/?q=${eventData.venue.latitude},${eventData.venue.longitude}`} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800">
                    Get Directions
                  </a>
                </div>
                <div className="mt-4 flex flex-col space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Parking Options:
                  </h4>
                  {eventData.venue.parking.slice(0, 2).map((option, index) => <div key={index} className="flex justify-between text-sm">
                      <span>{option.name}</span>
                      <span className="text-gray-500">
                        ${option.price} • {option.walkingTime} min walk
                      </span>
                    </div>)}
                  {eventData.venue.parking.length > 2 && <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800" onClick={e => {
                  e.preventDefault();
                  setActiveTab('venue');
                }}>
                      View all parking options
                    </a>}
                </div>
              </div>
            </div>
            {/* Social Proof Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Who's Going</h3>
              <div className="flex items-center mb-4">
                <div className="flex -space-x-2 mr-3">
                  {eventData.socialProof.friendsAttending.slice(0, 5).map((friend, index) => <img key={index} src={friend.image} alt={friend.name} className="h-8 w-8 rounded-full border-2 border-white cursor-pointer" title={friend.name} onClick={() => console.log(`Viewing ${friend.name}'s profile`)} />)}
                </div>
                {eventData.socialProof.friendsAttending.length > 0 ? <p className="text-sm text-gray-600">
                    <span className="font-medium">
                      {eventData.socialProof.friendsAttending.length}
                    </span>{' '}
                    friends are going
                  </p> : <p className="text-sm text-gray-600">
                    Be the first of your friends to attend
                  </p>}
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <div className="flex items-center">
                  <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span>
                    {eventData.socialProof.attending} people attending
                  </span>
                </div>
                <div className="flex items-center">
                  <HeartIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{eventData.socialProof.interested} interested</span>
                </div>
              </div>
              <div className="mt-4">
                <button onClick={handleInviteFriends} className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md">
                  Invite Friends
                </button>
              </div>
            </div>
            {/* Similar Events Teaser */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Similar Events</h3>
                <a href="#" onClick={e => {
                e.preventDefault();
                console.log('Viewing all similar events');
              }} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                  View all
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </a>
              </div>
              <div className="space-y-4">
                {[1, 2].map(item => <a key={item} href="#" onClick={e => {
                e.preventDefault();
                console.log(`Viewing event: ${item === 1 ? 'Tampa Bay Blues Festival' : 'St. Pete Jazz Festival'}`);
              }} className="flex items-start hover:bg-gray-50 p-2 -mx-2 rounded-md">
                    <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                      <img src={`https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80&random=${item}`} alt="Event" className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item === 1 ? 'Tampa Bay Blues Festival' : 'St. Pete Jazz Festival'}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {item === 1 ? 'Oct 22-24 • Vinoy Park' : 'Nov 5-6 • Williams Park'}
                      </p>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                          Music
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {item === 1 ? '12' : '8'} miles away
                        </span>
                      </div>
                    </div>
                  </a>)}
              </div>
            </div>
          </div>
        </div>
        {/* Related Events Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              More Events You Might Like
            </h2>
            <a href="#" onClick={e => {
            e.preventDefault();
            console.log('Viewing all recommended events');
          }} className="text-indigo-600 hover:text-indigo-800 flex items-center">
              View all
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </a>
          </div>
          <RelatedEvents />
        </div>
      </div>
      {/* Ticket Purchase Modal */}
      {showTicketModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowTicketModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <XIcon className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Purchase Tickets
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mb-6">
              {eventData.title}
            </h3>
            <div className="space-y-4 mb-6">
              {eventData.price.tiers.map((tier, index) => <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{tier.name}</h4>
                      <p className="text-sm text-gray-600">
                        {tier.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        ${tier.price}
                      </span>
                      <div className="mt-2">
                        <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                          {[0, 1, 2, 3, 4].map(num => <option key={num} value={num}>
                              {num}
                            </option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">$25.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium">$3.50</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Facility Fee</span>
                <span className="font-medium">$2.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>$30.50</span>
              </div>
            </div>
            <button onClick={() => {
          setShowTicketModal(false);
          console.log('Redirecting to payment processing...');
        }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md">
              Checkout
            </button>
            <p className="text-xs text-gray-500 mt-4">
              By completing this purchase you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Refund Policy
              </a>
              . Tickets are non-transferable except through our official resale
              platform.
            </p>
          </div>
        </div>}
    </div>;
};

interface EventDetailPageProps {
  eventId?: string;
  event?: any;
  relatedEvents?: any[];
  attendeeCount?: number;
}

export const EventDetailPage = ({ eventId, event, relatedEvents, attendeeCount }: EventDetailPageProps) => {
  return (
    <ClientOnly>
      <EventDetailPageInternal 
        eventId={eventId}
        event={event}
        relatedEvents={relatedEvents}
        attendeeCount={attendeeCount}
      />
    </ClientOnly>
  );
};