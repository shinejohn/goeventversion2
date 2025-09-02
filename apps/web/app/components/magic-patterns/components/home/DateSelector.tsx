import React, { useEffect, useState } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon } from 'lucide-react';

type DateSelectorProps = {
  onDateChange: (date: Date) => void;
  currentView: 'daily' | 'weekly' | 'monthly';
  setCurrentView: (view: 'daily' | 'weekly' | 'monthly') => void;
};
export const DateSelector = ({
  onDateChange,
  currentView,
  setCurrentView
}: DateSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  useEffect(() => {
    onDateChange(selectedDate);
  }, [selectedDate, onDateChange]);
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prevDay);
  };
  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDay);
  };
  const handleViewChange = (view: 'daily' | 'weekly' | 'monthly') => {
    setCurrentView(view);
    // You might want to adjust the selected date based on view
    // For example, if switching to weekly, you might want to set to the start of the week
  };
  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(new Date(e.target.value));
      setShowDatePicker(false);
    }
  };
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };
  return <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="relative">
            <button onClick={() => setShowDatePicker(!showDatePicker)} className="flex items-center text-lg font-semibold text-gray-900 hover:text-indigo-600">
              <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
              {isToday(selectedDate) ? 'Today' : formatDate(selectedDate)}
            </button>
            {showDatePicker && <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
                <input type="date" className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={selectedDate.toISOString().split('T')[0]} onChange={handleDateSelect} />
              </div>}
          </div>
          {currentView === 'daily' && <div className="flex items-center ml-4">
              <button onClick={handlePreviousDay} className="p-1 rounded-full hover:bg-gray-100" aria-label="Previous day">
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <button onClick={handleNextDay} className="p-1 rounded-full hover:bg-gray-100 ml-2" aria-label="Next day">
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>}
        </div>
        <div className="flex items-center space-x-2">
          <button className={`px-3 py-1.5 text-sm rounded-md ${currentView === 'daily' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => handleViewChange('daily')}>
            Daily
          </button>
          <button className={`px-3 py-1.5 text-sm rounded-md ${currentView === 'weekly' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => handleViewChange('weekly')}>
            Next 7 Days
          </button>
          <button className={`px-3 py-1.5 text-sm rounded-md ${currentView === 'monthly' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => handleViewChange('monthly')}>
            This Month
          </button>
        </div>
      </div>
      {currentView === 'daily' && <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
          <button onClick={handlePreviousDay} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800">
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Yesterday
          </button>
          <button onClick={() => {
        setSelectedDate(new Date());
      }} className="flex items-center text-sm text-gray-700 hover:text-gray-900">
            <ClockIcon className="h-4 w-4 mr-1" />
            Today
          </button>
          <button onClick={handleNextDay} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800">
            Tomorrow
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>}
    </div>;
};