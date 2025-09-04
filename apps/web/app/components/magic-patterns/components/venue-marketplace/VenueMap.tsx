import React, { useEffect, useState, useRef } from 'react';
import { MapPinIcon, StarIcon } from 'lucide-react';
type VenueMapProps = {
  venues: any[];
  onVenueSelect: (venueId: string) => void;
};
export const VenueMap = ({
  venues,
  onVenueSelect
}: VenueMapProps) => {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  // In a real implementation, we would use a mapping library like Leaflet or Google Maps
  // For this mock, we'll create a simple visual representation
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const handleVenueClick = (venueId: string) => {
    setSelectedVenue(venueId);
  };
  return <div className="relative w-full h-full bg-gray-100" ref={mapRef}>
      {!mapLoaded ? <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div> : <>
          {/* This is a mock map - in a real app, this would be a proper map component */}
          <div className="absolute inset-0 bg-gray-200">
            <img src="https://maps.googleapis.com/maps/api/staticmap?center=Clearwater,FL&zoom=13&size=1200x800&maptype=roadmap&key=DEMO_KEY" alt="Map of venues" className="w-full h-full object-cover opacity-50" />
          </div>
          {/* Venue pins */}
          <div className="absolute inset-0">
            {venues.map(venue => <div key={venue.id} className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${selectedVenue === venue.id ? 'z-10 scale-125' : 'z-0 hover:scale-110'}`} style={{
          left: `${(venue.location.coordinates.lng + 82.8) / 0.2 * 100}%`,
          top: `${(venue.location.coordinates.lat - 27.9) / 0.2 * 100}%`
        }} onClick={() => handleVenueClick(venue.id)}>
                <div className={`p-1 rounded-full ${venue.verified ? 'bg-blue-500' : 'bg-indigo-500'}`}>
                  <MapPinIcon className="h-6 w-6 text-white" />
                </div>
                {selectedVenue === venue.id && <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-lg p-3 z-20">
                    <div className="flex">
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                        <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {venue.name}
                        </h3>
                        <div className="flex items-center mt-1 text-xs">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">
                            {venue.average_rating}
                          </span>
                          <span className="ml-1 text-gray-500">
                            ({venue.total_reviews})
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Up to {venue.capacity} guests
                        </div>
                        <div className="text-xs font-medium mt-1">
                          ${venue.price_per_hour}/hour
                        </div>
                      </div>
                    </div>
                    <button className="mt-2 w-full bg-indigo-600 text-white text-xs py-1.5 rounded hover:bg-indigo-700" onClick={() => onVenueSelect(venue.id)}>
                      View Details
                    </button>
                  </div>}
              </div>)}
          </div>
          {/* Map controls */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow p-2 flex flex-col gap-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-3">
            <div className="text-sm font-medium mb-2">Map Legend</div>
            <div className="flex items-center mb-1">
              <div className="p-1 rounded-full bg-blue-500 mr-2">
                <MapPinIcon className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs">Verified Venue</span>
            </div>
            <div className="flex items-center">
              <div className="p-1 rounded-full bg-indigo-500 mr-2">
                <MapPinIcon className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs">Standard Venue</span>
            </div>
          </div>
        </>}
    </div>;
};