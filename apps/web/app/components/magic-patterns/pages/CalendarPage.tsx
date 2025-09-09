import React, { useEffect, useState } from 'react';
import { SunIcon, CloudIcon, CloudRainIcon, CalendarIcon } from 'lucide-react';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { ViewToggle } from '../components/calendar/ViewToggle';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { EventList } from '../components/calendar/EventList';

interface CalendarPageProps {
  calendarItems?: any[];
  dateRange?: {
    start: string;
    end: string;
    current: string;
  };
  filters?: any;
  metrics?: any;
  user?: any;
  error?: string;
}

export const CalendarPage = ({ 
  calendarItems = [], 
  dateRange, 
  filters, 
  metrics, 
  user, 
  error 
}: CalendarPageProps) => {
  const [viewMode, setViewMode] = useState<'month' | 'today' | '7days' | 'list'>(filters?.view || 'list');
  const [selectedDate, setSelectedDate] = useState(
    dateRange?.current ? new Date(dateRange.current) : new Date()
  );
  const [selectedCategory, setSelectedCategory] = useState(filters?.category || 'all');
  const [calendarDays, setCalendarDays] = useState([]);
  const [events, setEvents] = useState(calendarItems);
  const [isLoading, setIsLoading] = useState(false);

  // Update events when props change
  useEffect(() => {
    setEvents(calendarItems);
  }, [calendarItems]);

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Unable to load calendar</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  // Helper function to get weather icon
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
  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };
  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };
  return <div className="min-h-screen bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarHeader selectedDate={selectedDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} location="Clearwater, FL" eventCount={0} />
        <div className="mt-6 mb-8">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
        {isLoading ? <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-7 gap-2">
                {Array(7).fill(0).map((_, i) => <div key={i} className="h-6 bg-gray-200 rounded"></div>)}
              </div>
              {Array(5).fill(0).map((_, i) => <div key={i} className="grid grid-cols-7 gap-2">
                    {Array(7).fill(0).map((_, j) => <div key={j} className="h-24 bg-gray-200 rounded"></div>)}
                  </div>)}
            </div>
          </div> : <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {viewMode === 'list' ? <EventList events={events} /> : <CalendarGrid days={calendarDays} viewMode={viewMode} getWeatherIcon={getWeatherIcon} />}
          </div>}
      </div>
    </div>;
};