import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from 'lucide-react';
type AvailabilityCalendarProps = {
  id: string;
  availabilityByDate: Record<string, string>;
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
};
export const AvailabilityCalendar = ({
  id,
  availabilityByDate,
  selectedDate,
  onSelectDate
}: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  // Format date string for checking availability
  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  // Get availability status for a date
  const getAvailabilityStatus = (date: Date) => {
    const dateString = formatDateString(date);
    return availabilityByDate[dateString] || 'unknown';
  };
  // Get CSS class based on availability status
  const getDateClass = (date: Date) => {
    const isSelected = selectedDate && date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
    const status = getAvailabilityStatus(date);
    let baseClass = 'h-10 w-10 rounded-full flex items-center justify-center text-sm';
    if (isSelected) {
      return `${baseClass} bg-indigo-100 text-indigo-800 font-medium ring-2 ring-indigo-600`;
    }
    switch (status) {
      case 'fully-available':
        return `${baseClass} bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer`;
      case 'partially-available':
        return `${baseClass} bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer`;
      case 'unavailable':
        return `${baseClass} bg-red-100 text-red-800 cursor-not-allowed opacity-60`;
      default:
        return `${baseClass} bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer`;
    }
  };
  // Handle date selection
  const handleDateClick = (date: Date) => {
    const status = getAvailabilityStatus(date);
    if (status !== 'unavailable') {
      onSelectDate(date);
    }
  };
  // Generate calendar grid
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(<div key={day} className="h-10 flex items-center justify-center">
          <button type="button" onClick={() => handleDateClick(date)} className={getDateClass(date)} disabled={getAvailabilityStatus(date) === 'unavailable'}>
            {day}
          </button>
        </div>);
    }
    return days;
  };
  // Format month and year for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };
  return <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Availability Calendar
      </h2>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button type="button" onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-medium text-gray-900">
            {formatMonthYear(currentMonth)}
          </h3>
          <button type="button" onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>)}
          </div>
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-green-100 mr-2"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-yellow-100 mr-2"></div>
              <span className="text-sm text-gray-600">Partially Available</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-red-100 mr-2"></div>
              <span className="text-sm text-gray-600">Unavailable</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-indigo-100 ring-2 ring-indigo-600 mr-2"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
          </div>
        </div>
        {/* Time Slots Section */}
        {selectedDate && <div className="p-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
              Available Time Slots for{' '}
              {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {['9:00 AM - 1:00 PM', '1:00 PM - 5:00 PM', '5:00 PM - 9:00 PM', '9:00 PM - 1:00 AM'].map((slot, index) => {
            const isAvailable = Math.random() > 0.3; // Randomly determine availability for demo
            return <div key={index} className={`py-2 px-3 rounded-md text-center text-sm ${isAvailable ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-500 line-through'}`}>
                    {slot}
                  </div>;
          })}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Contact the venue directly for custom time slots or special
              arrangements.
            </p>
          </div>}
      </div>
    </section>;
};