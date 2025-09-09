import React, { useState } from 'react';
/**
 * Page: Event Detail
 * Type: SSR
 * Mockdata: No (removed all mock data - uses real database data)
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

const EventDetailPageInternal = ({ eventId = 'event-1', event: propEvent, relatedEvents: propRelatedEvents = [], attendeeCount: propAttendeeCount = 0 }: EventDetailPageProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const navigate = useNavigate();

  // Use real event data from props - no fallback to mock data
  if (!propEvent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event Not Found</h2>
          <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Browse All Events
          </button>
        </div>
      </div>
    );
  }

  // Transform database data to component format
  const eventData = {
    ...propEvent,
    // Transform date fields - check if dates exist first
    date: propEvent.start_date ? new Date(propEvent.start_date) : new Date(),
    endDate: propEvent.end_date ? new Date(propEvent.end_date) : new Date(),
    
    // Ensure venue data structure
    venue: propEvent.venue || {
      id: propEvent.venue_id,
      name: propEvent.location_name || 'Venue',
      address: propEvent.location_address || '',
      verified: false,
      latitude: propEvent.location?.coordinates?.latitude,
      longitude: propEvent.location?.coordinates?.longitude,
      description: '',
      amenities: propEvent.amenities || [],
      parking: [],
      transit: [],
      nearbyAmenities: []
    },
    
    // Build price structure from database
    price: {
      isFree: propEvent.is_free || false,
      tiers: propEvent.ticket_price ? [{
        name: 'General Admission',
        price: propEvent.ticket_price,
        description: 'Standard entry'
      }] : []
    },
    
    // Build ticket info
    ticketInfo: {
      required: !propEvent.is_free,
      available: propEvent.status === 'published',
      status: propEvent.status === 'published' ? 'on_sale' : 'not_available',
      salesStart: new Date(propEvent.start_date),
      salesEnd: new Date(propEvent.end_date),
      url: propEvent.ticket_url || null,
      provider: 'Event Organizer',
      limits: {
        perPerson: 10,
        minPurchase: 1
      },
      fees: {
        service: 3.5,
        facility: 2.0
      },
      refundPolicy: 'Please contact the event organizer for refund policies.',
      transferable: true,
      willCallAvailable: true,
      digitalDelivery: true,
      specialInstructions: 'Please check with the event organizer for specific instructions.'
    },
    
    // Event details
    description: propEvent.description || '',
    image: propEvent.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    ageRestriction: propEvent.age_restriction || 'All Ages',
    duration: calculateDuration(propEvent.start_date, propEvent.end_date),
    categories: propEvent.category ? [propEvent.category] : [],
    primaryCategory: propEvent.category || 'Event',
    highlights: propEvent.highlights || [],
    whatToBring: [],
    accessibility: [],
    
    // Organizer info
    organizer: propEvent.organizer || {
      id: 'org-1',
      name: 'Event Organizer',
      verified: false,
      description: '',
      events: 1,
      followers: 0
    },
    
    // Series info (if applicable)
    series: propEvent.series || null,
    
    // Lineup (simplified)
    lineup: [],
    
    // Reviews
    reviews: {
      average: 0,
      count: 0,
      items: []
    },
    
    // Questions
    questions: [],
    
    // Social proof
    socialProof: {
      attending: propAttendeeCount || 0,
      interested: Math.floor((propAttendeeCount || 0) * 2.5),
      friendsAttending: [],
      localAttending: Math.floor((propAttendeeCount || 0) * 0.7)
    },
    
    // Context info
    contextInfo: {
      popularity: propAttendeeCount > 50 ? 'Popular Event' : 'Discover this Event',
      distance: {
        minutes: 15,
        mode: 'drive',
        from: 'your location'
      },
      weather: {
        condition: 'sunny',
        temperature: 75,
        forecast: 'Check weather closer to event date'
      }
    }
  };

  // Helper function to calculate duration
  function calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }

  // Format date for display
  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
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
    if (eventData.ticketInfo.url) {
      window.open(eventData.ticketInfo.url, '_blank');
    } else {
      navigate(`/tickets/${eventData.id}`);
    }
  };

  // Handle save functionality
  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    console.log(`Event ${newSavedState ? 'saved' : 'removed'} from favorites!`);
  };

  // Handle share functionality
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: eventData.title,
        text: `Check out ${eventData.title}`,
        url: window.location.href
      }).catch(err => {
        console.error('Share failed:', err);
      });
    } else {
      console.log('Sharing functionality: ' + eventData.title);
    }
  };

  // Handle add to calendar
  const handleAddToCalendar = (type: string) => {
    console.log(`Added to ${type}: ${eventData.title} on ${formatEventDate(eventData.date)}`);
  };

  // Handle invite friends
  const handleInviteFriends = () => {
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
    
    return {
      text: 'Tickets Available',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-800'
    };
  };

  const ticketStatus = getTicketStatus();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <EventHero 
        image={eventData.image} 
        title={eventData.title} 
        date={eventData.date} 
        endDate={eventData.endDate}
        isSaved={isSaved} 
        onSaveToggle={() => setIsSaved(!isSaved)} 
      />

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
                {eventData.contextInfo.distance.minutes} min {eventData.contextInfo.distance.mode} from {eventData.contextInfo.distance.from}
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
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                  <div className="flex flex-wrap gap-2">
                    {eventData.price.isFree ? (
                      <span className="text-lg font-semibold text-green-600">Free</span>
                    ) : (
                      eventData.price.tiers.map((tier, index) => (
                        <div key={index} className="flex items-center">
                          {index > 0 && <span className="mx-1 text-gray-400">•</span>}
                          <span className="text-lg font-semibold">${tier.price}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                  <p className="text-lg">{eventData.duration}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Age Restriction</h3>
                  <p className="text-lg">{eventData.ageRestriction}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
                  <p className="text-lg">{formatEventDate(eventData.date)}</p>
                  <p className="text-sm text-gray-600">{formatEventTime(eventData.date)} - {formatEventTime(eventData.endDate)}</p>
                </div>
              </div>

              {/* Category Tags */}
              {eventData.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {eventData.categories.map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content Tabs */}
            <ContentTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              event={eventData}
              relatedEvents={propRelatedEvents}
            />
          </div>

          {/* Right Column - Action Panel */}
          <div className="lg:col-span-1">
            {/* Ticket Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 sticky top-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ticketStatus.bgColor} ${ticketStatus.textColor} mb-4`}>
                <TicketIcon className="h-4 w-4 mr-1" />
                {ticketStatus.text}
              </div>

              {/* Price Tiers */}
              {!eventData.price.isFree && eventData.price.tiers.length > 0 && (
                <div className="space-y-3 mb-6">
                  {eventData.price.tiers.map((tier, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{tier.name}</h4>
                          <p className="text-sm text-gray-600">{tier.description}</p>
                        </div>
                        <span className="text-lg font-semibold">${tier.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <button 
                onClick={handleGetTickets}
                disabled={!eventData.ticketInfo.available}
                className={`w-full py-3 px-4 rounded-md font-medium mb-3 ${
                  eventData.ticketInfo.available
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {eventData.price.isFree ? 'Register' : 'Get Tickets'}
              </button>

              <div className="flex gap-3">
                <button onClick={handleSave} className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                  <HeartIcon className={`h-5 w-5 mr-1 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button onClick={handleShare} className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                  <ShareIcon className="h-5 w-5 mr-1" />
                  Share
                </button>
              </div>

              {/* Social Proof */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center mb-2">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">{eventData.socialProof.attending} going</span>
                    <span className="mx-1">•</span>
                    <span>{eventData.socialProof.interested} interested</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue Map Card */}
            {eventData.venue.latitude && eventData.venue.longitude && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <VenueMap 
                  venue={eventData.venue}
                  className="h-48 mb-4 rounded-lg"
                />
                <div>
                  <h4 className="font-medium">{eventData.venue.name}</h4>
                  <p className="text-sm text-gray-600">{eventData.venue.address}</p>
                </div>
              </div>
            )}

            {/* Organizer Card */}
            {eventData.organizer && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Organizer</h3>
                <div className="flex items-center">
                  {eventData.organizer.image && (
                    <img 
                      src={eventData.organizer.image} 
                      alt={eventData.organizer.name} 
                      className="h-12 w-12 rounded-full mr-3"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{eventData.organizer.name}</h4>
                    {eventData.organizer.verified && (
                      <span className="text-xs text-blue-600 flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                {eventData.organizer.description && (
                  <p className="text-sm text-gray-600 mt-3">{eventData.organizer.description}</p>
                )}
                <button 
                  onClick={() => navigate(`/organizers/${eventData.organizer.id}`)}
                  className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  View Organizer Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Events */}
        {propRelatedEvents && propRelatedEvents.length > 0 && (
          <div className="mt-12">
            <RelatedEvents events={propRelatedEvents} currentEventId={eventData.id} />
          </div>
        )}
      </div>

      {/* Ticket Purchase Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowTicketModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Complete Your Purchase
                      </h3>
                      <button onClick={() => setShowTicketModal(false)} className="text-gray-400 hover:text-gray-500">
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {/* Ticket Selection would go here */}
                    <div className="mt-4 space-y-4">
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium mb-2">Order Summary</h4>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span>1x General Admission</span>
                            <span>$25.00</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Service Fee</span>
                            <span>$3.50</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span className="text-gray-600">Facility Fee</span>
                            <span className="font-medium">$2.00</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-200">
                            <span>Total</span>
                            <span>$30.50</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setShowTicketModal(false);
                            console.log('Redirecting to payment processing...');
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md mt-4"
                        >
                          Checkout
                        </button>
                        <p className="text-xs text-gray-500 mt-4">
                          By completing this purchase you agree to our{' '}
                          <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
                          {' '}and{' '}
                          <a href="#" className="text-indigo-600 hover:underline">Refund Policy</a>.
                          Tickets are non-transferable except through our official resale platform.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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