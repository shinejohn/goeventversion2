import React, { useState } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, MapPinIcon, TagIcon } from 'lucide-react';
// Mock events for the calendar
const mockEvents = [{
  id: 'event-1',
  title: 'Clearwater Jazz Holiday',
  date: new Date(2024, 8, 15),
  startTime: '17:00',
  endTime: '22:00',
  location: 'Coachman Park',
  category: 'Music',
  color: 'bg-blue-100 border-blue-300',
  textColor: 'text-blue-800'
}, {
  id: 'event-2',
  title: 'Farmers Market on Cleveland',
  date: new Date(2024, 8, 18),
  startTime: '09:00',
  endTime: '14:00',
  location: 'Downtown Clearwater',
  category: 'Food & Drink',
  color: 'bg-green-100 border-green-300',
  textColor: 'text-green-800'
}, {
  id: 'event-3',
  title: 'Art Walk',
  date: new Date(2024, 8, 22),
  startTime: '18:00',
  endTime: '21:00',
  location: 'Downtown Arts District',
  category: 'Arts',
  color: 'bg-purple-100 border-purple-300',
  textColor: 'text-purple-800'
}, {
  id: 'event-4',
  title: 'Comedy Night at Capitol Theatre',
  date: new Date(2024, 8, 25),
  startTime: '20:00',
  endTime: '22:30',
  location: 'Capitol Theatre',
  category: 'Entertainment',
  color: 'bg-yellow-100 border-yellow-300',
  textColor: 'text-yellow-800'
}, {
  id: 'event-5',
  title: 'Beach Cleanup Volunteer Day',
  date: new Date(2024, 8, 28),
  startTime: '08:00',
  endTime: '11:00',
  location: 'Clearwater Beach',
  category: 'Community',
  color: 'bg-teal-100 border-teal-300',
  textColor: 'text-teal-800'
}];
type PublicCalendarProps = {
  userId: string;
};
export const PublicCalendar = ({
  userId
}: PublicCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  // Functions to navigate between months
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  // Function to format the month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };
  // Function to get all days in the current month view (including days from prev/next months)
  const getDaysInMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    // Calculate days from next month to show (to fill a 6-row grid)
    const totalDaysToShow = 42; // 6 rows of 7 days
    const daysFromNextMonth = totalDaysToShow - (daysFromPrevMonth + lastDay.getDate());
    // Create array of all days to display
    const allDays = [];
    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
      allDays.push({
        date: new Date(year, month - 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    // Add days from current month
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      allDays.push({
        date,
        isCurrentMonth: true,
        isToday: date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
      });
    }
    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      allDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    return allDays;
  };
  // Function to get events for a specific day
  const getEventsForDay = (date: Date) => {
    return mockEvents.filter(event => event.date.getDate() === date.getDate() && event.date.getMonth() === date.getMonth() && event.date.getFullYear() === date.getFullYear());
  };
  // Get the selected event details
  const getSelectedEventDetails = () => {
    return mockEvents.find(event => event.id === selectedEvent);
  };
  return <div>
      {/* Calendar Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <h2 className="text-lg font-semibold text-gray-900 mr-4">
            {formatMonthYear(currentDate)}
          </h2>
          <div className="flex space-x-2">
            <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button onClick={goToToday} className="ml-2 px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
              Today
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex">
            <button onClick={() => setViewMode('month')} className={`px-3 py-1 text-sm rounded-l-md ${viewMode === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Month
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm rounded-r-md ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              List
            </button>
          </div>
        </div>
      </div>
      {/* Month View */}
      {viewMode === 'month' && <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => <div key={index} className="py-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>)}
          </div>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 grid-rows-6 h-[32rem]">
            {getDaysInMonthView().map((day, index) => {
          const events = getEventsForDay(day.date);
          return <div key={index} className={`border-b border-r border-gray-200 p-1 ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${day.isToday ? 'bg-blue-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${day.isToday ? 'bg-indigo-600 text-white h-6 w-6 rounded-full flex items-center justify-center' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                      {day.date.getDate()}
                    </span>
                    {events.length > 0 && <span className="text-xs bg-gray-100 text-gray-700 px-1 rounded">
                        {events.length}
                      </span>}
                  </div>
                  {/* Events for this day */}
                  <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                    {events.map(event => <button key={event.id} className={`w-full text-left px-2 py-1 rounded text-xs ${event.color} ${event.textColor} truncate border-l-2`} onClick={() => setSelectedEvent(event.id)}>
                        {event.startTime} {event.title}
                      </button>)}
                  </div>
                </div>;
        })}
          </div>
        </div>}
      {/* List View */}
      {viewMode === 'list' && <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {mockEvents.length === 0 ? <div className="py-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No events
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This user has no public events.
                </p>
              </div> : mockEvents.map(event => <div key={event.id} className={`px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer ${selectedEvent === event.id ? 'bg-gray-50' : ''}`} onClick={() => setSelectedEvent(event.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-12 rounded-full ${event.color.replace('bg', 'bg')}`}></div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {event.title}
                        </h3>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>
                            {event.date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                          </span>
                          <span className="mx-2">•</span>
                          <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${event.color} ${event.textColor}`}>
                      {event.category}
                    </span>
                  </div>
                </div>)}
          </div>
        </div>}
      {/* Event Details Modal */}
      {selectedEvent && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {getSelectedEventDetails()?.title}
              </h2>
              <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">
                  {getSelectedEventDetails()?.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
                </span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">
                  {getSelectedEventDetails()?.startTime} -{' '}
                  {getSelectedEventDetails()?.endTime}
                </span>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <div className="text-gray-700">
                    {getSelectedEventDetails()?.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className={`px-2 py-1 text-xs rounded-full ${getSelectedEventDetails()?.color} ${getSelectedEventDetails()?.textColor}`}>
                  {getSelectedEventDetails()?.category}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" onClick={() => setSelectedEvent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>}
    </div>;
};