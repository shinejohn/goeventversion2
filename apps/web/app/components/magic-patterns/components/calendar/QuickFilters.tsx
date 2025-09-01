import React from 'react';
import { SlidersIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
type QuickFiltersProps = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  toggleAdvancedFilters: () => void;
};
export const QuickFilters = ({
  selectedCategory,
  setSelectedCategory,
  toggleAdvancedFilters
}: QuickFiltersProps) => {
  const {
    navigateTo
  } = useNavigationContext();
  const timeFilters = ['Now', 'Today', 'Tomorrow', 'This Weekend', 'Custom Date'];
  const categoryFilters = ['All', 'Music', 'Food & Drink', 'Sports', 'Arts & Culture', 'Family', 'Nightlife'];
  const handleTimeFilterClick = (filter: string) => {
    // Navigate to appropriate calendar view based on filter
    switch (filter) {
      case 'Now':
        navigateTo('/calendar?time=now');
        break;
      case 'Today':
        navigateTo('/calendar?time=today');
        break;
      case 'Tomorrow':
        navigateTo('/calendar?time=tomorrow');
        break;
      case 'This Weekend':
        navigateTo('/calendar?time=weekend');
        break;
      case 'Custom Date':
        // Open date picker or navigate to custom date page
        navigateTo('/calendar?custom=true');
        break;
      default:
        navigateTo('/calendar');
    }
  };
  return <div className="space-y-4">
      {/* Time Filters */}
      <div className="flex flex-wrap gap-2">
        {timeFilters.map(filter => <button key={filter} className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50" onClick={() => handleTimeFilterClick(filter)}>
            {filter}
          </button>)}
      </div>
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {categoryFilters.map(category => <button key={category} className={`px-3 py-1.5 text-sm rounded-full ${selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`} onClick={() => setSelectedCategory(category)}>
            {category}
          </button>)}
        <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50" onClick={() => navigateTo('/calendar?show=all-categories')}>
          More...
        </button>
        <button onClick={toggleAdvancedFilters} className="ml-2 p-1.5 rounded-full bg-white border border-gray-300 hover:bg-gray-50">
          <SlidersIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>;
};