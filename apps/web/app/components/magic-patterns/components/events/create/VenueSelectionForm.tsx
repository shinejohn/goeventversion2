import React, { useState } from 'react';
import { 
  MapPinIcon, 
  SearchIcon,
  PlusIcon,
  CheckIcon,
  StarIcon,
  UsersIcon,
  WifiIcon,
  CarIcon,
  UtensilsIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  amenities: string[];
  price_range: string;
  rating: number;
  image_url: string;
  description: string;
  contact_phone: string;
  contact_email: string;
}

interface VenueSelectionFormProps {
  venues: Venue[];
  onSelect: (venue: Venue) => void;
  onBack: () => void;
  onNext: (venue: Venue) => void;
}

export const VenueSelectionForm = ({ venues, onSelect, onBack, onNext }: VenueSelectionFormProps) => {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');
  const [filterAmenities, setFilterAmenities] = useState<string[]>([]);

  const amenities = [
    { id: 'wifi', name: 'WiFi', icon: <WifiIcon className="h-4 w-4" /> },
    { id: 'parking', name: 'Parking', icon: <CarIcon className="h-4 w-4" /> },
    { id: 'catering', name: 'Catering', icon: <UtensilsIcon className="h-4 w-4" /> },
    { id: 'av', name: 'A/V Equipment', icon: <StarIcon className="h-4 w-4" /> }
  ];

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCapacity = !filterCapacity || venue.capacity >= parseInt(filterCapacity);
    const matchesAmenities = filterAmenities.length === 0 || 
                            filterAmenities.every(amenity => venue.amenities.includes(amenity));
    
    return matchesSearch && matchesCapacity && matchesAmenities;
  });

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    onSelect(venue);
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFilterAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleContinue = () => {
    if (selectedVenue) {
      onNext(selectedVenue);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={onBack} className="mr-4 text-gray-500 hover:text-gray-700">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Select Venue</h1>
                <p className="mt-2 text-gray-600">Choose the perfect venue for your event</p>
              </div>
            </div>
            <button
              onClick={() => {/* Add new venue */}}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Venue
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search venues..."
                  />
                </div>
              </div>

              {/* Capacity Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Capacity
                </label>
                <select
                  value={filterCapacity}
                  onChange={(e) => setFilterCapacity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Any capacity</option>
                  <option value="50">50+ people</option>
                  <option value="100">100+ people</option>
                  <option value="200">200+ people</option>
                  <option value="500">500+ people</option>
                  <option value="1000">1000+ people</option>
                </select>
              </div>

              {/* Amenities Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="space-y-2">
                  {amenities.map((amenity) => (
                    <label key={amenity.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterAmenities.includes(amenity.id)}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 flex items-center text-sm text-gray-700">
                        {amenity.icon}
                        <span className="ml-1">{amenity.name}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>

          {/* Venues List */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredVenues.map((venue) => (
                <div
                  key={venue.id}
                  onClick={() => handleVenueSelect(venue)}
                  className={`bg-white rounded-lg shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedVenue?.id === venue.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={venue.image_url}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {venue.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{venue.address}, {venue.city}, {venue.state}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {venue.description}
                          </p>
                        </div>
                        
                        {selectedVenue?.id === venue.id && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                              <CheckIcon className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-1" />
                            <span>{venue.capacity} capacity</span>
                          </div>
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>{venue.rating}</span>
                          </div>
                          <div>
                            <span className="font-medium">{venue.price_range}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {venue.amenities.map((amenity) => {
                          const amenityData = amenities.find(a => a.id === amenity);
                          return amenityData ? (
                            <span
                              key={amenity}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                            >
                              {amenityData.icon}
                              <span className="ml-1">{amenityData.name}</span>
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredVenues.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No venues found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or add a new venue
                  </p>
                  <button
                    onClick={() => {/* Add new venue */}}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Venue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {selectedVenue && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleContinue}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue with {selectedVenue.name}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

