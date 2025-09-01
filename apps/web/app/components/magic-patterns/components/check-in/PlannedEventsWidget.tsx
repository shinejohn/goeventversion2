import React, { useState } from 'react';
import { CalendarIcon, MapPinIcon, ClockIcon, TicketIcon, EyeIcon, EyeOffIcon, XIcon, ChevronRightIcon } from 'lucide-react';
import { useCheckIn, PlannedEvent } from '../../context/CheckInContext';
import { useNavigationContext } from '../../context/NavigationContext';
interface PlannedEventsWidgetProps {
  limit?: number;
  showControls?: boolean;
  className?: string;
}
export const PlannedEventsWidget: React.FC<PlannedEventsWidgetProps> = ({
  limit = 3,
  showControls = true,
  className = ''
}) => {
  const {
    plannedEvents,
    togglePlannedEventSharing,
    removePlannedEvent
  } = useCheckIn();
  const {
    navigateTo
  } = useNavigationContext();
  const [showAll, setShowAll] = useState(false);
  const displayEvents = showAll ? plannedEvents : plannedEvents.slice(0, limit);
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  const handleEventClick = (eventId: string, venueId: string) => {
    navigateTo(`/venues/${venueId}/events/${eventId}`);
  };
  const handleVenueClick = (venueId: string) => {
    navigateTo(`/venues/${venueId}/${venueId.replace('venue-', '')}`);
  };
  const handleToggleSharing = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlannedEventSharing(eventId);
  };
  const handleRemoveEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removePlannedEvent(eventId);
  };
  const handleViewAll = () => {
    if (plannedEvents.length > limit) {
      setShowAll(!showAll);
    } else {
      navigateTo('/my/calendar');
    }
  };
  if (plannedEvents.length === 0) {
    return <div className={`bg-white rounded-lg shadow-sm p-6 text-center ${className}`}>
        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No planned events
        </h3>
        <p className="text-gray-500">
          Events you add to your calendar or tickets you purchase will appear
          here.
        </p>
      </div>;
  }
  return <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Upcoming Events</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {displayEvents.map(event => <div key={event.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleEventClick(event.eventId, event.venueId)}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {event.eventName}
                </p>
                <p className="mt-1 text-xs text-gray-500 flex items-center">
                  <MapPinIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <button className="hover:text-indigo-600 truncate" onClick={e => {
                e.stopPropagation();
                handleVenueClick(event.venueId);
              }}>
                    {event.venueName}
                  </button>
                </p>
                <div className="mt-1 flex items-center space-x-3">
                  <span className="text-xs text-gray-500 flex items-center">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                    {formatDate(event.date)}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                    {event.time}
                  </span>
                </div>
              </div>
              {showControls && <div className="ml-3 flex-shrink-0 flex items-center space-x-1">
                  <button onClick={e => handleToggleSharing(event.eventId, e)} className="p-1 rounded-full hover:bg-gray-200 text-gray-500" title={event.shared ? 'Make private' : 'Share with friends'}>
                    {event.shared ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                  </button>
                  <button onClick={e => handleRemoveEvent(event.eventId, e)} className="p-1 rounded-full hover:bg-gray-200 text-gray-500" title="Remove event">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>}
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${event.source === 'ticket' ? 'bg-green-100 text-green-800' : event.source === 'calendar' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {event.source === 'ticket' ? <>
                    <TicketIcon className="h-3.5 w-3.5 mr-1" />
                    Ticket Purchased
                  </> : event.source === 'calendar' ? <>
                    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                    In Calendar
                  </> : 'Added Manually'}
              </span>
            </div>
          </div>)}
      </div>
      {plannedEvents.length > 0 && <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <button onClick={handleViewAll} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center w-full">
            {plannedEvents.length > limit ? showAll ? 'Show Less' : `View All (${plannedEvents.length})` : <>
                View Calendar
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </>}
          </button>
        </div>}
    </div>;
};