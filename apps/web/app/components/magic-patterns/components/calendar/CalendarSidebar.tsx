import React from 'react';
import { CalendarIcon, UsersIcon, StarIcon, TrendingUpIcon, PlusIcon, CheckIcon, ExternalLinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
type CalendarSidebarProps = {
  calendarData: any;
  isAddedToMyCalendars: boolean;
  onAddToMyCalendars: () => void;
};
export const CalendarSidebar = ({
  calendarData,
  isAddedToMyCalendars,
  onAddToMyCalendars
}: CalendarSidebarProps) => {
  const navigate = useNavigate();
  return <div className="w-full lg:w-80 space-y-6">
      {/* Add to My Calendars */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <button onClick={onAddToMyCalendars} className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${isAddedToMyCalendars ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
          {isAddedToMyCalendars ? <>
              <CheckIcon className="h-4 w-4 mr-1.5" />
              Added to My Calendars
            </> : <>
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Add to My Calendars
            </>}
        </button>
      </div>
      {/* Upcoming Highlights */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-3">Upcoming Highlights</h3>
        <div className="space-y-3">
          {calendarData.events.slice(0, 3).map((event: any) => <div key={event.id} className="flex items-start p-2 hover:bg-gray-50 rounded-md cursor-pointer" onClick={() => navigate(`/event/${event.id}`)}>
              <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden mr-3">
                <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                  {event.title}
                </h4>
                <p className="text-gray-500 text-xs">
                  {event.date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
                </p>
              </div>
            </div>)}
        </div>
        <button onClick={() => navigate(`/calendar/${calendarData.id}/events`)} className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 mt-3">
          View all events
        </button>
      </div>
      {/* Calendar Stats */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-3">Calendar Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>Total Events</span>
            </div>
            <span className="font-medium">{calendarData.stats.events}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <UsersIcon className="h-4 w-4 mr-2" />
              <span>Followers</span>
            </div>
            <span className="font-medium">{calendarData.stats.followers}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <UsersIcon className="h-4 w-4 mr-2" />
              <span>Active Members</span>
            </div>
            <span className="font-medium">
              {calendarData.stats.activeMembers}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <TrendingUpIcon className="h-4 w-4 mr-2" />
              <span>Growth Rate</span>
            </div>
            <span className="font-medium text-green-600">
              +{calendarData.stats.growthRate}%
            </span>
          </div>
        </div>
      </div>
      {/* Top Contributors */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-3">Top Contributors</h3>
        <div className="space-y-3">
          {calendarData.contributors.map((contributor: any) => <div key={contributor.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={contributor.avatar} alt={contributor.name} className="h-8 w-8 rounded-full mr-2" />
                <span className="text-gray-700">{contributor.name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {contributor.contributionCount} contributions
              </span>
            </div>)}
        </div>
      </div>
      {/* Related Calendars */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-3">Related Calendars</h3>
        <div className="space-y-3">
          {calendarData.relatedCalendars.map((calendar: any) => <div key={calendar.id} className="flex items-start p-2 hover:bg-gray-50 rounded-md cursor-pointer" onClick={() => navigate(`/calendar/${calendar.id}`)}>
              <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden mr-3">
                <img src={calendar.image} alt={calendar.title} className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                  {calendar.title}
                </h4>
                <p className="text-gray-500 text-xs">
                  {calendar.followers.toLocaleString()} followers •{' '}
                  {calendar.eventCount} events
                </p>
              </div>
            </div>)}
        </div>
      </div>
      {/* Sponsors Section (if applicable) */}
      {calendarData.sponsors && calendarData.sponsors.length > 0 && <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-medium text-gray-900 mb-3">Sponsors</h3>
          <div className="space-y-4">
            {calendarData.sponsors.map((sponsor: any) => <a key={sponsor.id} href={sponsor.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                      <img src={sponsor.logo} alt={sponsor.name} className="h-full w-full object-contain" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {sponsor.name}
                    </span>
                  </div>
                  <ExternalLinkIcon className="h-4 w-4 text-gray-400" />
                </div>
              </a>)}
          </div>
        </div>}
    </div>;
};