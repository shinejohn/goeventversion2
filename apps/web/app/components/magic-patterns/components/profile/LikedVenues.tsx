import React from 'react';
import { MapPinIcon, StarIcon, CalendarIcon, ChevronRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
// Mock data for liked venues
const mockLikedVenues = [{
  id: 'venue-1',
  name: 'Capitol Theatre',
  image: 'https://images.unsplash.com/photo-1518079304793-f5ea5f8a41be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  address: '405 Cleveland St, Clearwater, FL 33755',
  category: 'Theater',
  rating: 4.8,
  reviewCount: 156,
  upcomingEvents: 12,
  nextEvent: 'Comedy Night - Aug 25'
}, {
  id: 'venue-2',
  name: 'Coachman Park',
  image: 'https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  address: '301 Drew St, Clearwater, FL 33755',
  category: 'Outdoor',
  rating: 4.6,
  reviewCount: 89,
  upcomingEvents: 8,
  nextEvent: 'Jazz Holiday - Oct 15'
}, {
  id: 'venue-3',
  name: 'The District Lounge',
  image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  address: '627 Cleveland St, Clearwater, FL 33755',
  category: 'Bar',
  rating: 4.5,
  reviewCount: 72,
  upcomingEvents: 15,
  nextEvent: 'DJ Coastal - Aug 20'
}, {
  id: 'venue-4',
  name: 'Ruth Eckerd Hall',
  image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  address: '1111 McMullen Booth Rd, Clearwater, FL 33759',
  category: 'Concert Hall',
  rating: 4.9,
  reviewCount: 203,
  upcomingEvents: 24,
  nextEvent: 'Symphony Orchestra - Sep 10'
}, {
  id: 'venue-5',
  name: 'Clear Sky on Cleveland',
  image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  address: '418 Cleveland St, Clearwater, FL 33755',
  category: 'Restaurant',
  rating: 4.7,
  reviewCount: 128,
  upcomingEvents: 6,
  nextEvent: 'Live Music - Aug 22'
}, {
  id: 'venue-6',
  name: 'Clearwater Beach',
  image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  address: 'Clearwater Beach, FL 33767',
  category: 'Beach',
  rating: 4.9,
  reviewCount: 512,
  upcomingEvents: 9,
  nextEvent: 'Sunset Cinema - Aug 28'
}];
type LikedVenuesProps = {
  userId: string;
};
export const LikedVenues = ({
  userId
}: LikedVenuesProps) => {
  const navigate = useNavigate();
  return <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Liked Venues</h2>
        <span className="text-sm text-gray-500">
          {mockLikedVenues.length} venues
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLikedVenues.map(venue => <div key={venue.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/venues/${venue.id}`)}>
            <div className="h-48 overflow-hidden">
              <img src={venue.image} alt={venue.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {venue.name}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {venue.category}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {venue.address}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1">{venue.rating}</span>
                <span className="ml-1 text-gray-500">
                  ({venue.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center text-sm font-medium text-blue-600">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {venue.upcomingEvents} upcoming events
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Next: {venue.nextEvent}
                </div>
                <button onClick={e => {
              e.stopPropagation();
              navigate(`/venues/${venue.id}`);
            }} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 flex items-center">
                  View Venue
                  <ChevronRightIcon className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};