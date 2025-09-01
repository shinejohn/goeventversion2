import React, { useState, createElement } from 'react';
import { useNavigationContext } from '../../../context/NavigationContext';
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, MessageSquareIcon, StarIcon, ThumbsUpIcon, InfoIcon, ShareIcon, PlusIcon, ExternalLinkIcon, CheckIcon } from 'lucide-react';
type EnhancedEventCardProps = {
  event: any;
  hubData: any;
};
export const EnhancedEventCard = ({
  event,
  hubData
}: EnhancedEventCardProps) => {
  const {
    navigateTo
  } = useNavigationContext();
  const [isAttending, setIsAttending] = useState(false);
  const [showCuratorNotes, setShowCuratorNotes] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  const formatPrice = (price: {
    isFree: boolean;
    min?: number;
    max?: number;
  }) => {
    if (price.isFree) return 'Free';
    if (price.min === price.max) return `$${price.min}`;
    return `$${price.min} - $${price.max}`;
  };
  const handleAttendClick = () => {
    setIsAttending(!isAttending);
  };
  const handleAddToCalendar = () => {
    // Create calendar event data
    const eventDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    const isPM = event.time.includes('PM');
    eventDate.setHours(isPM ? parseInt(hours) === 12 ? 12 : parseInt(hours) + 12 : parseInt(hours) === 12 ? 0 : parseInt(hours), parseInt(minutes.split(' ')[0]));
    const eventEndDate = new Date(eventDate);
    eventEndDate.setHours(eventEndDate.getHours() + 3); // Assume 3 hour duration
    // Format for iCal
    const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = eventEndDate.toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `SUMMARY:${event.title}`, `DTSTART:${startDate}`, `DTEND:${endDate}`, `LOCATION:${event.venue.name}, ${event.venue.city}`, `DESCRIPTION:${event.description}`, 'END:VEVENT', 'END:VCALENDAR'].join('\n');
    // Create download link
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 2000);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {event.badges.map((badge: string, index: number) => <span key={index} className="px-2 py-1 rounded-full text-xs font-medium bg-black/30 backdrop-blur-sm text-white">
              {badge}
            </span>)}
        </div>
        {/* Date */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center w-16">
            <div className="text-xs font-medium text-gray-500">
              {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short'
            })}
            </div>
            <div className="text-xl font-bold text-gray-900">
              {new Date(event.date).getDate()}
            </div>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={() => navigateTo(`/event/${event.id}`)}>
            {event.title}
          </h3>
          {/* Community Rating */}
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium text-yellow-700">
              {event.communityRating}
            </span>
          </div>
        </div>
        {/* Event Details */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
            <span className="mx-2">•</span>
            <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {event.venue.name}, {event.venue.city}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{formatPrice(event.price)}</span>
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-1 text-indigo-500" />
              <span className="text-indigo-600 font-medium">
                {event.memberAttendance} attending
              </span>
            </div>
          </div>
        </div>
        {/* Subcategories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {event.subcategories.map((subcategory: string, index: number) => <span key={index} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
              {subcategory}
            </span>)}
        </div>
        {/* Member Recommendations */}
        {event.memberRecommendations > 0 && <div className="flex items-center text-sm text-green-600 mb-3">
            <ThumbsUpIcon className="h-4 w-4 mr-1" />
            <span>Recommended by {event.memberRecommendations} members</span>
          </div>}
        {/* Curator Notes (collapsible) */}
        {event.curatorNotes && <div className="mb-3">
            <button onClick={() => setShowCuratorNotes(!showCuratorNotes)} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800">
              <InfoIcon className="h-4 w-4 mr-1" />
              <span>{showCuratorNotes ? 'Hide' : 'Show'} curator notes</span>
            </button>
            {showCuratorNotes && <div className="mt-2 p-3 bg-indigo-50 rounded-md text-sm text-gray-700 italic border-l-2 border-indigo-300">
                "{event.curatorNotes}"
              </div>}
          </div>}
        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex space-x-2">
            <button onClick={handleAddToCalendar} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full" title="Add to Calendar">
              {calendarAdded ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CalendarIcon className="h-5 w-5" />}
            </button>
            <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full" title="Share Event">
              <ShareIcon className="h-5 w-5" />
            </button>
            <button onClick={() => navigateTo(`/hub/${hubData.id}/discussion/${event.discussionThreadId}`)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full" title="View Discussion">
              <MessageSquareIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => navigateTo(`/event/${event.id}`)} className="px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-md flex items-center">
              <ExternalLinkIcon className="h-3.5 w-3.5 mr-1" />
              Details
            </button>
            <button onClick={handleAttendClick} className={`px-3 py-1.5 text-xs rounded-md flex items-center ${isAttending ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
              {isAttending ? <>
                  <CheckIcon className="h-3.5 w-3.5 mr-1" />
                  Attending
                </> : <>
                  <PlusIcon className="h-3.5 w-3.5 mr-1" />
                  Attend
                </>}
            </button>
          </div>
        </div>
      </div>
    </div>;
};