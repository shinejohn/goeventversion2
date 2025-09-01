import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react';
type CalendarHeaderProps = {
  selectedDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  location: string;
  eventCount: number;
};
export const CalendarHeader = ({
  selectedDate,
  onPrevMonth,
  onNextMonth,
  location,
  eventCount
}: CalendarHeaderProps) => {
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };
  return <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Event Calendar</h1>
        <div className="flex items-center mt-1 text-gray-600">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{location}</span>
          <span className="mx-2">•</span>
          <span>{eventCount} events today</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Previous month">
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-medium text-gray-900 min-w-32 text-center">
          {formatMonthYear(selectedDate)}
        </h2>
        <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Next month">
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>;
};