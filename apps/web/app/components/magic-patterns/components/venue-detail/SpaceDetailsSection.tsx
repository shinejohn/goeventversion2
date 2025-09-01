import React, { useState } from 'react';
import { UsersIcon, SquareIcon, ArrowUpIcon, ZapIcon, WifiIcon, VolumeIcon, LayoutIcon } from 'lucide-react';
type SpaceDetailsSectionProps = {
  id: string;
  venue: any;
};
export const SpaceDetailsSection = ({
  id,
  venue
}: SpaceDetailsSectionProps) => {
  const [activeTab, setActiveTab] = useState('capacity');
  return <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">The Space</h2>
      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 -mb-px">
          {[{
          id: 'capacity',
          label: 'Capacity',
          icon: <UsersIcon className="h-5 w-5" />
        }, {
          id: 'dimensions',
          label: 'Dimensions',
          icon: <SquareIcon className="h-5 w-5" />
        }, {
          id: 'technical',
          label: 'Technical Specs',
          icon: <ZapIcon className="h-5 w-5" />
        }, {
          id: 'layout',
          label: 'Layout Options',
          icon: <LayoutIcon className="h-5 w-5" />
        }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>)}
        </nav>
      </div>
      {/* Tab content */}
      <div>
        {/* Capacity Breakdown */}
        {activeTab === 'capacity' && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(venue.capacityBreakdown).map(([type, count]) => <div key={type} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-900 capitalize mb-1">
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="text-3xl font-bold text-indigo-600">
                  {count}
                </div>
                <p className="text-sm text-gray-600 mt-1">guests</p>
              </div>)}
          </div>}
        {/* Dimensions */}
        {activeTab === 'dimensions' && <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Space Dimensions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <SquareIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium">Total Area</div>
                      <div className="text-gray-600">
                        {venue.squareFootage} square feet
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ArrowUpIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium">Ceiling Height</div>
                      <div className="text-gray-600">
                        {venue.ceilingHeight} feet
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Room Measurements
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Main Room</span>
                    <span className="font-medium">80' × 60'</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stage Area</span>
                    <span className="font-medium">30' × 20'</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bar/Lounge</span>
                    <span className="font-medium">40' × 25'</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entrance Foyer</span>
                    <span className="font-medium">25' × 15'</span>
                  </div>
                </div>
              </div>
            </div>
          </div>}
        {/* Technical Specs */}
        {activeTab === 'technical' && <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start">
                <ZapIcon className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Power</h3>
                  <p className="text-gray-600 mt-1">{venue.powerDetails}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start">
                <WifiIcon className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Internet</h3>
                  <p className="text-gray-600 mt-1">{venue.internetSpeed}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707M12 21v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">Lighting</h3>
                  <p className="text-gray-600 mt-1">{venue.lightingOptions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start">
                <VolumeIcon className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Sound</h3>
                  <p className="text-gray-600 mt-1">{venue.soundLimitations}</p>
                </div>
              </div>
            </div>
          </div>}
        {/* Layout Options */}
        {activeTab === 'layout' && <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Floor Plan
              </h3>
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <img src={venue.floorPlan} alt="Floor plan" className="object-cover w-full h-full" />
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Available Layouts
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">Theater Style</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">Banquet Style</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">Classroom Style</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">Reception Style</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">U-Shape</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Customization
                  </h4>
                  <p className="text-gray-600">
                    The venue offers flexible layout options that can be
                    customized to your specific event needs. Our event
                    coordinators can work with you to design the perfect space
                    arrangement.
                  </p>
                  <p className="text-gray-600 mt-2">
                    Additional floor plan diagrams and 3D renderings are
                    available upon request.
                  </p>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </section>;
};