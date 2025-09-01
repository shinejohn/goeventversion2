import React, { useState } from 'react';
import { WifiIcon, UtensilsIcon, SpeakerIcon, GlassWaterIcon, MicIcon, DoorOpenIcon, PlusIcon } from 'lucide-react';
type AmenitiesSectionProps = {
  id: string;
  amenities: string[];
  additionalServices: {
    name: string;
    description: string;
    priceRange: string;
  }[];
};
export const AmenitiesSection = ({
  id,
  amenities,
  additionalServices
}: AmenitiesSectionProps) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  // Define amenity icons
  const amenityIcons: Record<string, React.ReactNode> = {
    'Parking Available': <div className="h-5 w-5" />,
    'Wheelchair Accessible': <div className="h-5 w-5" />,
    'Kitchen/Catering': <UtensilsIcon className="h-5 w-5" />,
    'A/V Equipment': <SpeakerIcon className="h-5 w-5" />,
    WiFi: <WifiIcon className="h-5 w-5" />,
    'Bar Service': <GlassWaterIcon className="h-5 w-5" />,
    'Outdoor Space': <div className="h-5 w-5" />,
    'Stage/Performance Area': <MicIcon className="h-5 w-5" />,
    'Green Room': <DoorOpenIcon className="h-5 w-5" />,
    'Load-in Access': <DoorOpenIcon className="h-5 w-5" />
  };
  // Display all or limited amenities based on state
  const displayedAmenities = showAllAmenities ? amenities : amenities.slice(0, 6);
  return <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Amenities & Services
      </h2>
      {/* Included Amenities */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Included Amenities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedAmenities.map((amenity, index) => <div key={index} className="flex items-center">
              <div className="text-gray-500 mr-3">
                {amenityIcons[amenity] || <PlusIcon className="h-5 w-5" />}
              </div>
              <span className="text-gray-700">{amenity}</span>
            </div>)}
        </div>
        {amenities.length > 6 && <button onClick={() => setShowAllAmenities(!showAllAmenities)} className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            {showAllAmenities ? 'Show less' : `Show all ${amenities.length} amenities`}
          </button>}
      </div>
      {/* Additional Services */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Additional Services
        </h3>
        <div className="space-y-4">
          {additionalServices.map((service, index) => <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {service.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-gray-900 font-medium">
                    {service.priceRange}
                  </span>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};