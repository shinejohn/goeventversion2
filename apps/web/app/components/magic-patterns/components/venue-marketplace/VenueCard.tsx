import React, { useState } from 'react';
import { CheckCircleIcon, HeartIcon, MapPinIcon, UsersIcon, StarIcon, ArrowRightIcon, CalendarIcon, InfoIcon } from 'lucide-react';
type VenueCardProps = {
  venue: any;
  selectedDate: Date | null;
  onViewDetails: () => void;
};
export const VenueCard = ({
  venue,
  selectedDate,
  onViewDetails
}: VenueCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((currentImageIndex + 1) % venue.images.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(currentImageIndex === 0 ? venue.images.length - 1 : currentImageIndex - 1);
  };
  // Determine upcoming events count
  const upcomingEventsCount = Math.floor(Math.random() * 10) + 1; // Mocked data
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={onViewDetails}>
      {/* Image Carousel */}
      <div className="relative h-48 bg-gray-200">
        <img src={venue.images[currentImageIndex]} alt={venue.name} className="w-full h-full object-cover" />
        {/* Image Navigation */}
        {venue.images.length > 1 && <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow-sm hover:bg-opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow-sm hover:bg-opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {/* Carousel Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
              {venue.images.map((_: any, index: number) => <button key={index} onClick={e => {
            e.stopPropagation();
            setCurrentImageIndex(index);
          }} className={`h-2 w-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'}`} />)}
            </div>
          </>}
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
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
            {venue.name}
          </h3>
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {venue.city || 'Location'}{venue.distance ? `, ${venue.distance} miles away` : ''}
          </span>
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-600">
          <UsersIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>Up to {venue.capacity} guests</span>
        </div>
        <div className="mt-1 flex items-center text-sm">
          <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
          <span className="font-medium">{venue.average_rating}</span>
          <span className="text-gray-600 ml-1">
            ({venue.total_reviews} reviews)
          </span>
        </div>
        {/* Amenities */}
        <div className="mt-2 flex flex-wrap gap-1">
          {venue.amenities.slice(0, 3).map((amenity: string) => <span key={amenity} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
              {amenity}
            </span>)}
          {venue.amenities.length > 3 && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
              +{venue.amenities.length - 3} more
            </span>}
        </div>
        {/* Action Buttons */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{venue.venue_type}</span>
          </div>
          <button onClick={e => {
          e.stopPropagation();
          onViewDetails();
        }} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 flex items-center">
            <InfoIcon className="h-3 w-3 mr-1" />
            View Venue
          </button>
        </div>
      </div>
    </div>;
};