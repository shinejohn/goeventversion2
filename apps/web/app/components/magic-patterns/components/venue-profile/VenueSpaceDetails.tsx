import React, { useState } from 'react';
import { UsersIcon, LayoutIcon, CheckIcon, ChevronRightIcon, ExpandIcon, ArrowRightIcon } from 'lucide-react';
type VenueSpaceDetailsProps = {
  spaces: any[];
  activeSpace: string;
  onSpaceSelect: (spaceId: string) => void;
};
export const VenueSpaceDetails = ({
  spaces,
  activeSpace,
  onSpaceSelect
}: VenueSpaceDetailsProps) => {
  const [showComparisonView, setShowComparisonView] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('standing');
  const activeSpaceData = spaces.find(space => space.id === activeSpace);
  const layoutOptions = [{
    id: 'standing',
    label: 'Standing Reception'
  }, {
    id: 'seated',
    label: 'Seated Dinner'
  }, {
    id: 'theaterStyle',
    label: 'Theater Style'
  }, {
    id: 'banquetStyle',
    label: 'Banquet Style'
  }];
  return <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {spaces.length > 1 ? 'Venue Spaces' : 'Venue Space'}
        </h2>
        {spaces.length > 1 && <button onClick={() => setShowComparisonView(!showComparisonView)} className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
            {showComparisonView ? 'Single View' : 'Compare Spaces'}
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </button>}
      </div>
      {!showComparisonView ? <div>
          {/* Space Selector */}
          {spaces.length > 1 && <div className="mb-6">
              <div className="flex overflow-x-auto space-x-4 pb-2">
                {spaces.map(space => <button key={space.id} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeSpace === space.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => onSpaceSelect(space.id)}>
                    {space.name}
                  </button>)}
              </div>
            </div>}
          {/* Active Space Details */}
          {activeSpaceData && <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img src={activeSpaceData.images[0]} alt={activeSpaceData.name} className="rounded-lg object-cover w-full h-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {activeSpaceData.images.slice(1, 4).map((image: string, index: number) => <div key={index} className="aspect-w-1 aspect-h-1">
                          <img src={image} alt={`${activeSpaceData.name} view ${index + 2}`} className="rounded-lg object-cover w-full h-full" />
                        </div>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {activeSpaceData.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeSpaceData.description}
                  </p>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      Capacity Options
                    </h4>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <div className="grid grid-cols-4 border-b border-gray-200">
                        {layoutOptions.map(option => <button key={option.id} className={`py-2 text-sm font-medium ${selectedLayout === option.id ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setSelectedLayout(option.id)}>
                            {option.label}
                          </button>)}
                      </div>
                      <div className="p-6 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900">
                            {activeSpaceData.capacity[selectedLayout]}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {selectedLayout === 'standing' ? 'Standing Guests' : selectedLayout === 'seated' ? 'Seated Guests' : selectedLayout === 'theaterStyle' ? 'Theater Style Seats' : 'Banquet Style Guests'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Square Footage
                      </h4>
                      <div className="text-lg font-medium text-gray-900">
                        {activeSpaceData.squareFootage} sq ft
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Price
                      </h4>
                      <div className="text-lg font-medium text-gray-900">
                        ${activeSpaceData.pricePerHour}/hour
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      Features
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {activeSpaceData.features.map((feature: string, index: number) => <li key={index} className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>)}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  3D Floor Plan
                </h3>
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1532094349884-543019a69b2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Floor Plan" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg shadow-md font-medium flex items-center hover:bg-opacity-100">
                      <ExpandIcon className="h-4 w-4 mr-2" />
                      View Interactive Floor Plan
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Rental Options
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <ArrowRightIcon className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Full Space</span>
                        <p className="mt-1 text-sm text-gray-600">
                          Exclusive use of the entire space
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ArrowRightIcon className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Partial Rental</span>
                        <p className="mt-1 text-sm text-gray-600">
                          Section off a portion for smaller events
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ArrowRightIcon className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">
                          Combination Packages
                        </span>
                        <p className="mt-1 text-sm text-gray-600">
                          Combine with other venue spaces for larger events
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Technical Specs
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <LayoutIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Dimensions:</span>
                        <span className="ml-1 text-gray-600">
                          65' x 80' (5,200 sq ft)
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <LayoutIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Ceiling Height:</span>
                        <span className="ml-1 text-gray-600">18 feet</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <LayoutIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Power:</span>
                        <span className="ml-1 text-gray-600">
                          20 standard outlets, 4 high-capacity
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <LayoutIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Internet:</span>
                        <span className="ml-1 text-gray-600">
                          1 Gbps fiber, business-grade WiFi
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Ideal For
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Weddings
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Corporate Events
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Galas
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Conferences
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Performances
                    </span>
                  </div>
                </div>
              </div>
            </div>}
        </div> :
    // Comparison View
    <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b border-gray-200 w-1/4">
                  Space Details
                </th>
                {spaces.map(space => <th key={space.id} className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                    {space.name}
                  </th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Image
                </td>
                {spaces.map(space => <td key={space.id} className="py-3 px-4">
                    <div className="h-32 w-48 rounded-lg overflow-hidden">
                      <img src={space.images[0]} alt={space.name} className="h-full w-full object-cover" />
                    </div>
                  </td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Description
                </td>
                {spaces.map(space => <td key={space.id} className="py-3 px-4 text-sm text-gray-600">
                    {space.description.substring(0, 100)}...
                  </td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Square Footage
                </td>
                {spaces.map(space => <td key={space.id} className="py-3 px-4 text-sm text-gray-900">
                    {space.squareFootage} sq ft
                  </td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Standing Capacity
                </td>
                {spaces.map(space => <td key={space.id} className="py-3 px-4 text-sm text-gray-900">
                    {space.capacity.standing} guests
                  </td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Seated Capacity
                </td>
                {spaces.map(space => <td key={space.id} className="py-3 px-4 text-sm text-gray-900">
                    {space.capacity.seated} guests
                  </td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Features
                </td>
                {spaces.map(space => <td key={space.id} className="py-3 px-4">
                    <ul className="space-y-1">
                      {space.features.map((feature: string, index: number) => <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckIcon className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                          {feature}
                        </li>)}
                    </ul>
                  </td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                  Price
                </td>
                {spaces.map(space => <td key={space.id} className="py-3 px-4 text-sm font-medium text-gray-900">
                    ${space.pricePerHour}/hour
                  </td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50"></td>
                {spaces.map(space => <td key={space.id} className="py-3 px-4">
                    <button onClick={() => {
                onSpaceSelect(space.id);
                setShowComparisonView(false);
              }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      View Details
                    </button>
                  </td>)}
              </tr>
            </tbody>
          </table>
        </div>}
    </div>;
};