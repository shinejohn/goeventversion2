import React, { useEffect, useState } from 'react';
import { useNavigationContext } from '../../../context/NavigationContext';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
type CalendarViewProps = {
  events: any[];
};
export const CalendarView = ({
  events
}: CalendarViewProps) => {
  const {
    navigateTo
  } = useNavigationContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<any[]>([]);
  // Generate calendar days for the current month
  useEffect(() => {
    const days = generateCalendarDays(currentMonth, events);
    setCalendarDays(days);
  }, [currentMonth, events]);
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() - 1);
      return newMonth;
    });
  };
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + 1);
      return newMonth;
    });
  };
  // Format month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 flex items-center justify-between bg-gray-50 border-b border-gray-200">
        <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {formatMonthYear(currentMonth)}
        </h2>
        <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
            {day}
          </div>)}
      </div>
      <div className="grid grid-cols-7 auto-rows-fr">
        {calendarDays.map((day, index) => <div key={index} className={`min-h-[100px] p-1 border-r border-b border-gray-200 last:border-r-0 ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} ${day.isToday ? 'bg-indigo-50' : ''}`}>
            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium ${day.isToday ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                {day.day}
              </span>
              {day.events.length > 0 && <span className="text-xs bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full">
                  {day.events.length}
                </span>}
            </div>
            <div className="mt-1 space-y-1">
              {day.events.slice(0, 3).map((event: any) => <div key={event.id} onClick={() => navigateTo(`/event/${event.id}`)} className="text-xs p-1 rounded truncate cursor-pointer bg-indigo-100 text-indigo-800 hover:bg-indigo-200" title={event.title}>
                  {event.time.split(' ')[0]} {event.title}
                </div>)}
              {day.events.length > 3 && <div className="text-xs text-gray-500 pl-1">
                  + {day.events.length - 3} more
                </div>}
            </div>
          </div>)}
      </div>
    </div>;
};
// Helper function to generate calendar days
function generateCalendarDays(date: Date, events: any[]) {
  const year = date.getFullYear();
  const month = date.getMonth();
  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  // Last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  // Days from previous month
  const daysFromPrevMonth = startingDayOfWeek;
  // Calculate days needed from next month to complete the grid
  const totalDaysToShow = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7;
  const daysFromNextMonth = totalDaysToShow - (daysFromPrevMonth + daysInMonth);
  const calendarDays = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Add days from previous month
  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();
  for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
    const dayDate = new Date(year, month - 1, i);
    calendarDays.push({
      day: i,
      date: dayDate,
      isCurrentMonth: false,
      isToday: dayDate.getTime() === today.getTime(),
      events: events.filter(event => new Date(event.date).toDateString() === dayDate.toDateString())
    });
  }
  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(year, month, i);
    calendarDays.push({
      day: i,
      date: dayDate,
      isCurrentMonth: true,
      isToday: dayDate.getTime() === today.getTime(),
      events: events.filter(event => new Date(event.date).toDateString() === dayDate.toDateString())
    });
  }
  // Add days from next month
  for (let i = 1; i <= daysFromNextMonth; i++) {
    const dayDate = new Date(year, month + 1, i);
    calendarDays.push({
      day: i,
      date: dayDate,
      isCurrentMonth: false,
      isToday: dayDate.getTime() === today.getTime(),
      events: events.filter(event => new Date(event.date).toDateString() === dayDate.toDateString())
    });
  }
  return calendarDays;
}