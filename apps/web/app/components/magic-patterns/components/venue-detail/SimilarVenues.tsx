import React from 'react';
import { StarIcon, MapPinIcon, UsersIcon, ArrowRightIcon, CheckCircleIcon } from 'lucide-react';
type SimilarVenuesProps = {
  venues: any[];
  onVenueClick: (venueId: string) => void;
};
export const SimilarVenues = ({
  venues,
  onVenueClick
}: SimilarVenuesProps) => {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {venues.map(venue => <div key={venue.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onVenueClick(venue.id)}>
          <div className="h-48 overflow-hidden">
            <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{venue.name}</h3>
              {venue.verified && <CheckCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />}
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{venue.location.neighborhood}</span>
              <span className="mx-1">•</span>
              <span>{venue.distance} miles away</span>
            </div>
            <div className="flex items-center mt-1 text-sm">
              <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{venue.rating}</span>
              <span className="text-gray-600 ml-1">({venue.reviewCount})</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <UsersIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>Up to {venue.capacity} guests</span>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div className="font-medium">${venue.pricePerHour}/hour</div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                View
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};