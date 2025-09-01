import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, HeartIcon, MapPinIcon, UsersIcon, StarIcon, ArrowRightIcon, CalendarIcon, InfoIcon } from 'lucide-react';
type VenueListItemProps = {
  venue: any;
  selectedDate: Date | null;
  onViewDetails: () => void;
};
export const VenueListItem = ({
  venue,
  selectedDate,
  onViewDetails
}: VenueListItemProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  // Fetch upcoming events count
  useEffect(() => {
    // API call would go here to get real upcoming events count
    // For now, just set to 0 instead of using random mock data
    setUpcomingEventsCount(0);
  }, [venue.id]);
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={onViewDetails}>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-64 h-48 sm:h-auto relative">
          <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
          {/* Save Button */}
          <button onClick={handleSave} className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100">
            <HeartIcon className={`h-5 w-5 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </button>
          {/* Verified Badge */}
          {venue.verified && <div className="absolute top-2 left-2 flex items-center bg-white bg-opacity-80 px-2 py-0.5 rounded-full shadow-sm">
              <CheckCircleIcon className="h-4 w-4 text-blue-500" />
              <span className="ml-1 text-xs font-medium">Verified</span>
            </div>}
          {/* Events Badge */}
          <div className="absolute bottom-2 left-2 flex items-center bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {upcomingEventsCount} upcoming events
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="font-bold text-lg text-gray-900">{venue.name}</h3>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>
                {venue.location.neighborhood}, {venue.distance} miles away
              </span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <UsersIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>Up to {venue.capacity} guests</span>
            </div>
            <div className="mt-1 flex items-center text-sm">
              <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{venue.rating}</span>
              <span className="text-gray-600 ml-1">
                ({venue.reviewCount} reviews)
              </span>
            </div>
            {/* Amenities */}
            <div className="mt-2 flex flex-wrap gap-1">
              {venue.amenities.slice(0, 5).map((amenity: string) => <span key={amenity} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                  {amenity}
                </span>)}
              {venue.amenities.length > 5 && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                  +{venue.amenities.length - 5} more
                </span>}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Next event:</span> Not available
            </div>
          </div>
          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900">
              {venue.venueType}
            </div>
            <div className="flex space-x-2">
              <button onClick={e => {
              e.stopPropagation();
              onViewDetails();
            }} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 flex items-center">
                <InfoIcon className="h-3 w-3 mr-1" />
                View Venue Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};