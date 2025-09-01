import React from 'react';
import { CalendarIcon, ListIcon, SunIcon, Clock7Icon } from 'lucide-react';
type ViewToggleProps = {
  viewMode: 'month' | 'today' | '7days' | 'list';
  setViewMode: (mode: 'month' | 'today' | '7days' | 'list') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};
export const ViewToggle = ({
  viewMode,
  setViewMode,
  selectedCategory,
  setSelectedCategory
}: ViewToggleProps) => {
  const categories = [{
    id: 'all',
    label: 'All'
  }, {
    id: 'music',
    label: 'Music'
  }, {
    id: 'food',
    label: 'Food & Drink'
  }, {
    id: 'sports',
    label: 'Sports'
  }, {
    id: 'arts',
    label: 'Arts & Culture'
  }, {
    id: 'family',
    label: 'Family'
  }, {
    id: 'nightlife',
    label: 'Nightlife'
  }];
  return <div className="flex flex-col space-y-4">
      {/* View Mode Buttons - Now on top */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button onClick={() => setViewMode('today')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${viewMode === 'today' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
          <SunIcon className="h-4 w-4 mr-1.5" />
          Today
        </button>
        <button onClick={() => setViewMode('7days')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${viewMode === '7days' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
          <Clock7Icon className="h-4 w-4 mr-1.5" />7 Days
        </button>
        <button onClick={() => setViewMode('month')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${viewMode === 'month' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
          <CalendarIcon className="h-4 w-4 mr-1.5" />
          Month
        </button>
        <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
          <ListIcon className="h-4 w-4 mr-1.5" />
          List
        </button>
      </div>
      {/* Category Filters - Now below view mode buttons */}
      <div className="flex overflow-x-auto border-t border-gray-200 pt-3">
        {categories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-3 py-1.5 text-sm whitespace-nowrap ${selectedCategory === category.id ? 'text-indigo-700 font-medium border-b-2 border-indigo-500' : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'}`}>
            {category.label}
          </button>)}
      </div>
    </div>;
};