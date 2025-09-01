import React, { useMemo } from 'react';
type Day = {
  date: Date;
  dayOfMonth: number;
  dayOfWeek: number;
  isToday: boolean;
  eventCount: number;
  density: string;
  categories: string[];
  weather: string;
};
type CalendarGridProps = {
  days: Day[];
  viewMode: string;
  getWeatherIcon: (condition: string) => React.ReactNode;
};
export const CalendarGrid = ({
  days,
  viewMode,
  getWeatherIcon
}: CalendarGridProps) => {
  // Filter days based on viewMode
  const filteredDays = useMemo(() => {
    const today = new Date();
    if (viewMode === 'today') {
      return days.filter(day => day.isToday);
    } else if (viewMode === '7days') {
      // Get the next 7 days starting from today
      const todayIndex = days.findIndex(day => day.isToday);
      if (todayIndex === -1) return days.slice(0, 7);
      return days.slice(todayIndex, todayIndex + 7);
    } else if (viewMode === 'list') {
      // For list view, just return all days
      return days;
    }
    // Default to full month
    return days;
  }, [days, viewMode]);
  // Get day name abbreviations
  const getDayName = (dayOfWeek: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayOfWeek];
  };
  return <div className="grid grid-cols-7 divide-x divide-gray-200">
      {/* Day headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => <div key={i} className="px-2 py-3 text-center text-sm font-medium text-gray-700">
          {day}
        </div>)}
      {/* Calendar days */}
      {filteredDays.map((day, index) => <div key={index} className={`px-2 py-3 ${day.isToday ? 'bg-indigo-50' : 'bg-white'} min-h-[100px] relative`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${day.isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
                {day.dayOfMonth}
              </div>
            </div>
            <div className="text-right">{getWeatherIcon(day.weather)}</div>
          </div>
          <div className="mb-2">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${day.density === 'high' ? 'bg-yellow-100 text-yellow-800' : day.density === 'medium' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {day.eventCount} events
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {day.categories.slice(0, 3).map((category, i) => <span key={i} className={`block w-2 h-2 rounded-full ${category === 'Music' ? 'bg-indigo-500' : category === 'Food & Drink' ? 'bg-orange-500' : category === 'Sports' ? 'bg-green-500' : category === 'Arts & Culture' ? 'bg-purple-500' : category === 'Family' ? 'bg-blue-500' : 'bg-gray-500'}`} />)}
          </div>
        </div>)}
    </div>;
};