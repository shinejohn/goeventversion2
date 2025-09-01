import React from 'react';
import { CalendarIcon, ListIcon, MapIcon } from 'lucide-react';
type EventViewToggleProps = {
  viewMode: 'calendar' | 'list' | 'map';
  setViewMode: (mode: 'calendar' | 'list' | 'map') => void;
};
export const EventViewToggle = ({
  viewMode,
  setViewMode
}: EventViewToggleProps) => {
  return <div className="inline-flex rounded-md shadow-sm">
      <button type="button" className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${viewMode === 'list' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => setViewMode('list')}>
        <ListIcon className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">List</span>
      </button>
      <button type="button" className={`relative -ml-px inline-flex items-center px-4 py-2 border ${viewMode === 'calendar' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => setViewMode('calendar')}>
        <CalendarIcon className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Calendar</span>
      </button>
      <button type="button" className={`relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border ${viewMode === 'map' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => setViewMode('map')}>
        <MapIcon className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Map</span>
      </button>
    </div>;
};