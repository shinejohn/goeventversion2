import React from 'react';
import { StarIcon, TrendingUpIcon } from 'lucide-react';
import { CalendarCard } from './CalendarCard';
type FeaturedCalendarsProps = {
  calendars: any[];
};
export const FeaturedCalendars = ({
  calendars
}: FeaturedCalendarsProps) => {
  if (!calendars || calendars.length === 0) return null;
  return <div className="mb-12">
      <div className="flex items-center mb-6">
        <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">
          Featured Calendars
        </h2>
        <span className="ml-2 text-sm text-gray-500">
          Staff picks and promoted calendars
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calendars.map(calendar => <CalendarCard key={calendar.id} calendar={calendar} />)}
      </div>
    </div>;
};