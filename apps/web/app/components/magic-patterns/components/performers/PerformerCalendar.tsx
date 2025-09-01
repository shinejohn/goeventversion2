import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, CheckCircleIcon, TicketIcon } from 'lucide-react';
type PerformerCalendarProps = {
  performers: any[];
  onPerformerClick: (performerId: string) => void;
};
export const PerformerCalendar = ({
  performers,
  onPerformerClick
}: PerformerCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        day: null,
        date: null,
        shows: []
      });
    }
    // Add days of month with shows
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      // Find shows on this date
      const showsOnDate = performers.flatMap(performer => performer.upcomingShows.filter((show: any) => show.date.startsWith(dateString)).map((show: any) => ({
        ...show,
        performer: {
          id: performer.id,
          name: performer.name,
          image: performer.profileImage,
          isVerified: performer.isVerified,
          genres: performer.genres
        }
      })));
      days.push({
        day,
        date,
        shows: showsOnDate
      });
    }
    return days;
  };
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  // Format month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };
  // Get today's date for highlighting
  const today = new Date();
  const isToday = (day: number | null) => {
    if (!day) return false;
    return today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();
  };
  // Generate calendar days
  const calendarDays = generateCalendarDays();
  // Get genre color
  const getGenreColor = (genre: string) => {
    const genreColors: Record<string, string> = {
      'Rock/Alternative': 'bg-red-100 border-red-200',
      'Pop/Top 40': 'bg-pink-100 border-pink-200',
      'Hip-Hop/Rap': 'bg-purple-100 border-purple-200',
      'Country/Folk': 'bg-yellow-100 border-yellow-200',
      'Jazz/Blues': 'bg-blue-100 border-blue-200',
      'Electronic/DJ': 'bg-indigo-100 border-indigo-200',
      'Classical/Orchestra': 'bg-green-100 border-green-200',
      Comedy: 'bg-orange-100 border-orange-200',
      'Cover Bands': 'bg-teal-100 border-teal-200',
      'Kids/Family': 'bg-cyan-100 border-cyan-200'
    };
    return genreColors[genre] || 'bg-gray-100 border-gray-200';
  };
  return <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <button onClick={goToPreviousMonth} className="p-1 rounded-full hover:bg-indigo-500">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            {formatMonthYear(currentMonth)}
          </h2>
          <button onClick={goToNextMonth} className="p-1 rounded-full hover:bg-indigo-500">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="p-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => <div key={index} className="p-2 text-center text-sm font-medium text-gray-700">
                {day}
              </div>)}
        </div>
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayData, index) => <div key={index} className={`min-h-[100px] border rounded-md ${dayData.day ? isToday(dayData.day) ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200' : 'border-transparent'} relative`}>
              {dayData.day && <>
                  {/* Day number */}
                  <div className="p-1 text-right">
                    <span className={`text-sm ${isToday(dayData.day) ? 'font-bold text-indigo-700' : 'text-gray-700'}`}>
                      {dayData.day}
                    </span>
                  </div>
                  {/* Shows */}
                  <div className="px-1 pb-1 space-y-1 max-h-[80px] overflow-y-auto">
                    {dayData.shows.map((show: any, showIndex: number) => <div key={showIndex} className={`p-1 rounded text-xs border ${getGenreColor(show.performer.genres[0])} cursor-pointer`} onClick={() => onPerformerClick(show.performer.id)}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full overflow-hidden mr-1 flex-shrink-0">
                            <img src={show.performer.image} alt={show.performer.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="truncate flex items-center">
                            <span className="truncate">
                              {show.performer.name}
                            </span>
                            {show.performer.isVerified && <CheckCircleIcon className="h-3 w-3 text-blue-500 ml-0.5 flex-shrink-0" />}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="truncate text-[10px] text-gray-600">
                            {show.venue}
                          </span>
                          {show.ticketsAvailable && <TicketIcon className="h-3 w-3 text-indigo-600 flex-shrink-0" />}
                        </div>
                      </div>)}
                  </div>
                  {/* Show count badge */}
                  {dayData.shows.length > 2 && <div className="absolute bottom-1 right-1 bg-indigo-100 text-indigo-800 text-[10px] px-1 rounded-full">
                      {dayData.shows.length} shows
                    </div>}
                </>}
            </div>)}
        </div>
      </div>
      {/* Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Genre Color Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.keys(performers.reduce((acc: Record<string, boolean>, performer) => {
          performer.genres.forEach((genre: string) => {
            acc[genre] = true;
          });
          return acc;
        }, {})).slice(0, 10).map((genre, index) => <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded ${getGenreColor(genre)} mr-1`}></div>
                <span className="text-xs text-gray-600 truncate">{genre}</span>
              </div>)}
        </div>
      </div>
    </div>;
};