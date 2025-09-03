import React, { useState, createElement } from 'react';
import { MapPinIcon, ClockIcon, HeartIcon, ShareIcon, TicketIcon, TagIcon, AlertCircleIcon, CalendarIcon, CheckIcon } from 'lucide-react';
import { SharePopup } from '../ui/SharePopup';
type Event = {
  id: string;
  title: string;
  image: string;
  date: Date;
  venue: {
    name: string;
    neighborhood: string;
    id: string;
    slug: string;
  };
  distance: {
    miles: number;
    minutes: number;
    mode: string;
  };
  price: {
    isFree: boolean;
    min?: number;
    max?: number;
  };
  categories: string[];
  friendsAttending: {
    id: string;
    name: string;
    avatar: string;
  }[];
  isOutdoor?: boolean;
  weather?: string;
  ticketInfo?: {
    required: boolean;
    available: boolean;
    status?: 'on_sale' | 'selling_fast' | 'almost_sold_out' | 'sold_out' | 'free';
    url?: string;
  };
};
type EventCardProps = {
  event: Event;
};
export const EventCard = ({
  event
}: EventCardProps) => {
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [calendarSuccess, setCalendarSuccess] = useState<boolean>(false);
  const [showSharePopup, setShowSharePopup] = useState<boolean>(false);
  // Format date to display
  const formatEventDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  // Format price to display
  const formatPrice = (price: {
    isFree: boolean;
    min?: number;
    max?: number;
  }) => {
    if (price.isFree) return 'Free';
    if (price.min === price.max) return `$${price.min}`;
    return `$${price.min} - $${price.max}`;
  };
  // Handle ticket button click
  const handleTicketClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event card click from triggering
    if (event.ticketInfo?.url) {
      typeof window !== "undefined" && window.open(event.ticketInfo.url, '_blank');
    } else {
      alert(`Purchasing tickets for: ${event.title}`);
    }
  };
  // Handle share event
  const handleShareEvent = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event card click from triggering
    setShowSharePopup(true);
  };
  // Handle add to calendar
  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event card click from triggering
    // Create calendar event data
    const eventDate = event.date;
    const eventEndDate = new Date(eventDate);
    eventEndDate.setHours(eventEndDate.getHours() + 3); // Assume 3 hour duration if not specified
    // Format for iCal
    const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = eventEndDate.toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `SUMMARY:${event.title}`, `DTSTART:${startDate}`, `DTEND:${endDate}`, `LOCATION:${event.venue.name}, ${event.venue.neighborhood}`, `DESCRIPTION:${event.title} at ${event.venue.name}`, 'END:VEVENT', 'END:VCALENDAR'].join('\n');
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
    setCalendarSuccess(true);
    setTimeout(() => setCalendarSuccess(false), 2000);
  };
  // Get ticket status badge
  const getTicketStatusBadge = () => {
    if (!event.ticketInfo || !event.ticketInfo.required) return null;
    const status = event.ticketInfo.status;
    if (status === 'free') {
      return <span className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Free Entry
        </span>;
    } else if (status === 'sold_out') {
      return <span className="absolute top-3 right-3 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center">
          <AlertCircleIcon className="h-3 w-3 mr-1" />
          Sold Out
        </span>;
    } else if (status === 'almost_sold_out') {
      return <span className="absolute top-3 right-3 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
          Few Tickets Left
        </span>;
    } else if (status === 'selling_fast') {
      return <span className="absolute top-3 right-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          Selling Fast
        </span>;
    } else if (status === 'on_sale') {
      return <span className="absolute top-3 right-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          Tickets Available
        </span>;
    }
    return null;
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Event Image */}
      <div className="relative h-48">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {/* Categories */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {event.categories.slice(0, 3).map((category, index) => <span key={index} className="px-2 py-1 bg-black/30 backdrop-blur-sm text-white text-xs rounded-full">
              {category}
            </span>)}
        </div>
        {/* Ticket Status Badge */}
        {getTicketStatusBadge()}
      </div>
      {/* Event Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-2 mb-4">
          {/* Date & Time */}
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          {/* Venue */}
          <div className="flex items-center text-sm">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-600" />
            <div>
              <a href={`/venues/${event.venue.id}/${event.venue.slug}`} className="text-indigo-600 hover:text-indigo-800">
                {event.venue.name}
              </a>
              <span className="text-gray-500 text-xs ml-2">
                {event.venue.neighborhood}
              </span>
            </div>
          </div>
          {/* Distance & Price */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              {event.distance.miles} miles • {event.distance.minutes} min{' '}
              {event.distance.mode}
            </span>
            <span className="font-medium">{formatPrice(event.price)}</span>
          </div>
        </div>
        {/* Friends Attending */}
        {event.friendsAttending.length > 0 && <div className="flex items-center mb-4">
            <div className="flex -space-x-2 mr-2">
              {event.friendsAttending.slice(0, 3).map((friend, index) => <img key={index} src={friend.avatar} alt={friend.name} className="w-6 h-6 rounded-full border border-white" />)}
            </div>
            <span className="text-xs text-gray-600">
              {event.friendsAttending.length}{' '}
              {event.friendsAttending.length === 1 ? 'friend' : 'friends'}{' '}
              attending
            </span>
          </div>}
        {/* Action Buttons */}
        <div className="flex justify-between pt-3 border-t border-gray-100">
          <button className="text-gray-500 hover:text-indigo-600">
            <HeartIcon className="h-5 w-5" />
          </button>
          <button onClick={handleShareEvent} className="text-gray-500 hover:text-indigo-600" title="Share Event">
            {shareSuccess ? <CheckIcon className="h-5 w-5 text-green-500" /> : <ShareIcon className="h-5 w-5" />}
          </button>
          <button onClick={handleAddToCalendar} className="text-gray-500 hover:text-indigo-600" title="Add to Calendar">
            {calendarSuccess ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CalendarIcon className="h-5 w-5" />}
          </button>
          {event.ticketInfo?.required && <button onClick={handleTicketClick} className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${event.ticketInfo?.available ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`} disabled={!event.ticketInfo?.available}>
              <TicketIcon className="h-4 w-4 mr-1" />
              {event.ticketInfo?.status === 'free' ? 'Free Entry' : event.ticketInfo?.status === 'sold_out' ? 'Sold Out' : 'Get Tickets'}
            </button>}
          {!event.ticketInfo?.required && <button className="px-3 py-1 rounded-full text-sm font-medium flex items-center bg-green-100 text-green-700">
              <TagIcon className="h-4 w-4 mr-1" />
              No Ticket Required
            </button>}
        </div>
      </div>
      {/* Share Popup */}
      {showSharePopup && <SharePopup isOpen={showSharePopup} onClose={() => setShowSharePopup(false)} title={event.title} description={`${event.title} at ${event.venue.name} on ${formatEventDate(event.date)}`} url={`${window.location.origin}/event/${event.id}`} image={event.image} />}
    </div>;
};