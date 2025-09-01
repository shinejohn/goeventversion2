import React, { useEffect, useState } from 'react';
import { SunIcon, CloudIcon, CloudRainIcon, CalendarIcon } from 'lucide-react';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { ViewToggle } from '../components/calendar/ViewToggle';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { EventList } from '../components/calendar/EventList';
export const CalendarPage = () => {
  const [viewMode, setViewMode] = useState<'month' | 'today' | '7days' | 'list'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [calendarDays, setCalendarDays] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Fetch calendar data
  useEffect(() => {
    const fetchCalendarData = async () => {
      setIsLoading(true);
      try {
        // API call would go here
        await new Promise(resolve => setTimeout(resolve, 500));
        // Empty calendar days array instead of mock data
        setCalendarDays([]);
        // Empty events array instead of mock data
        setEvents([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setIsLoading(false);
      }
    };
    fetchCalendarData();
  }, [selectedDate]);
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