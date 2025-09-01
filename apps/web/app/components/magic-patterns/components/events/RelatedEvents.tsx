import React from 'react';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
export const RelatedEvents = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const relatedEvents = [{
    id: 'event-1',
    title: 'Tampa Bay Blues Festival',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'Oct 22-24',
    venue: 'Vinoy Park',
    category: 'Music',
    distance: '12 miles'
  }, {
    id: 'event-2',
    title: 'St. Pete Jazz Festival',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'Nov 5-6',
    venue: 'Williams Park',
    category: 'Music',
    distance: '8 miles'
  }, {
    id: 'event-3',
    title: 'Dunedin Craft Beer Festival',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'Oct 29',
    venue: 'Dunedin Brewery',
    category: 'Food & Drink',
    distance: '5 miles'
  }];
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedEvents.map(event => <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200" onClick={() => navigateTo('/event')}>
          <div className="h-48 overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {event.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {event.date}
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {event.venue}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                {event.category}
              </span>
              <span className="text-xs text-gray-500">{event.distance}</span>
            </div>
          </div>
        </div>)}
    </div>;
};