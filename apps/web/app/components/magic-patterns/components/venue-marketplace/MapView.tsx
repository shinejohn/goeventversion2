import React, { useState } from 'react';
import { MapPinIcon, XIcon } from 'lucide-react';
type MapViewProps = {
  venues: any[];
  onVenueSelect: (id: string) => void;
};
export const MapView = ({
  venues,
  onVenueSelect
}: MapViewProps) => {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  // This is a simplified map view since we can't integrate with actual maps
  // In a real implementation, this would use a library like Google Maps or Mapbox
  const handleVenueClick = (venueId: string) => {
    setSelectedVenue(venueId);
  };
  const handleVenueSelect = (venueId: string) => {
    onVenueSelect(venueId);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[600px] relative">
      {/* Placeholder Map */}
      <div className="w-full h-full bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <svg className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-sm">Interactive map would be displayed here</p>
            <p className="text-xs mt-1">
              Using Google Maps or Mapbox integration
            </p>
          </div>
        </div>
        {/* Venue Pins */}
        {venues.map(venue => <button key={venue.id} className={`absolute p-1 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${selectedVenue === venue.id ? 'z-20 scale-125' : 'z-10 hover:scale-110'}`} style={{
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 80 + 10}%` // Random position for demo
      }} onClick={() => handleVenueClick(venue.id)}>
            <div className={`flex items-center justify-center h-6 w-6 rounded-full ${venue.verified ? 'bg-blue-500' : 'bg-indigo-500'} text-white shadow-md`}>
              <MapPinIcon className="h-4 w-4" />
            </div>
          </button>)}
        {/* Venue Preview Card */}
        {selectedVenue && <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-64 bg-white rounded-lg shadow-lg z-30" style={{
        maxWidth: 'calc(100% - 2rem)'
      }}>
            {venues.filter(v => v.id === selectedVenue).map(venue => <div key={venue.id} className="relative">
                  <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm z-10" onClick={() => setSelectedVenue(null)}>
                    <XIcon className="h-4 w-4 text-gray-500" />
                  </button>
                  <div className="h-32 overflow-hidden">
                    <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900">{venue.name}</h4>
                    <p className="text-sm text-gray-600">
                      {venue.location.neighborhood}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      ${venue.pricePerHour}/hour
                    </p>
                    <button className="mt-2 w-full py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded" onClick={() => handleVenueSelect(venue.id)}>
                      View Details
                    </button>
                  </div>
                </div>)}
          </div>}
      </div>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button className="p-2 bg-white rounded-md shadow-md text-gray-700 hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button className="p-2 bg-white rounded-md shadow-md text-gray-700 hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button className="p-2 bg-white rounded-md shadow-md text-gray-700 hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>;
};