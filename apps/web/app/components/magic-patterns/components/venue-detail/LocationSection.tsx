import React from 'react';
import { MapPinIcon, CarIcon, BusIcon, DoorOpenIcon, BuildingIcon } from 'lucide-react';
type LocationSectionProps = {
  id: string;
  venue: any;
};
export const LocationSection = ({
  id,
  venue
}: LocationSectionProps) => {
  return <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Location & Access
      </h2>
      {/* Interactive Map */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="h-64 bg-gray-200 relative">
          {/* This would be a real map component in a production app */}
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
          {/* Map Pin */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center">
              <MapPinIcon className="h-8 w-8 text-red-500" />
              <div className="mt-1 bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium">
                {venue.name}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="font-medium text-gray-900">
              {venue.location.address}
            </h3>
          </div>
          <div className="flex justify-between">
            <a href={`https://maps.google.com/?q=${venue.location.coordinates.lat},${venue.location.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800">
              Get Directions
            </a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${venue.location.address.replace(/ /g, '+')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800">
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
      {/* Access Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parking */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start mb-4">
            <CarIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Parking</h3>
              <p className="text-gray-600 mt-1">{venue.parkingDetails}</p>
            </div>
          </div>
          <div className="pl-8">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Nearby Parking Options:
            </h4>
            {venue.parking.map((option: any, index: number) => <div key={index} className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{option.name}</span>
                <span className="text-gray-900">
                  ${option.price} • {option.walkingTime} min walk
                </span>
              </div>)}
          </div>
        </div>
        {/* Public Transit */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start mb-4">
            <BusIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Public Transit</h3>
              <p className="text-gray-600 mt-1">
                Several public transportation options available nearby.
              </p>
            </div>
          </div>
          <div className="pl-8">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Nearby Transit Options:
            </h4>
            {venue.publicTransit.map((option: any, index: number) => <div key={index} className="mb-3">
                <div className="flex items-center">
                  {option.type === 'Bus' ? <BusIcon className="h-4 w-4 text-blue-500 mr-2" /> : <svg className="h-4 w-4 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 15V9c0-4 3-8 8-8s8 4 8 8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 15h4v2a3 3 0 01-3 3H4v-5zM20 15h-4v2a3 3 0 003 3h1v-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 16a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>}
                  <span className="font-medium text-gray-900">
                    {option.type}
                  </span>
                </div>
                <div className="ml-6 text-sm text-gray-600">
                  <div>Routes: {option.routes.join(', ')}</div>
                  <div>
                    Stop: {option.stop} ({option.distance})
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        {/* Load-in/Load-out */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start">
            <DoorOpenIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Load-in/Load-out</h3>
              <p className="text-gray-600 mt-1">{venue.loadInDetails}</p>
              <div className="mt-2 text-sm text-gray-600">
                <div className="mb-1">
                  • Recommended arrival: 2 hours before event
                </div>
                <div className="mb-1">
                  • Service elevator dimensions: 8' × 6' × 7'
                </div>
                <div>• Dollies and hand trucks available upon request</div>
              </div>
            </div>
          </div>
        </div>
        {/* Neighborhood */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start">
            <BuildingIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Neighborhood</h3>
              <p className="text-gray-600 mt-1">
                {venue.neighborhoodDescription}
              </p>
              <h4 className="text-sm font-medium text-gray-700 mt-3 mb-2">
                Nearby Amenities:
              </h4>
              <div className="space-y-2">
                {venue.venue.nearbyAmenities.map((item: any, index: number) => <div key={index} className="flex items-center text-sm">
                    <span className="mr-2">•</span>
                    <span className="text-gray-600">
                      {item.name} ({item.distance})
                    </span>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};