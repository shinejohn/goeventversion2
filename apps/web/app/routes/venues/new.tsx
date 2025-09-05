import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeftIcon, SparklesIcon, BuildingIcon, CalendarIcon, MapPinIcon } from 'lucide-react';

export default function VenuesNewRoute() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/venues')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Venues
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SparklesIcon className="h-8 w-8 text-yellow-500 mr-3" />
            New Venues
          </h1>
          <p className="mt-2 text-gray-600">
            Discover the latest venue additions to our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <BuildingIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recently Added</h3>
            <p className="text-gray-600">Latest venue listings</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <CalendarIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Now Booking</h3>
            <p className="text-gray-600">Available for events</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <MapPinIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">New Locations</h3>
            <p className="text-gray-600">Expanding coverage</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              New Venues Showcase Coming Soon
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We&apos;re building a dedicated section to highlight newly added venues, making it easy 
              for event organizers to discover fresh spaces and opportunities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/venues')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Browse All Venues
              </button>
              <button
                onClick={() => navigate('/venues/submit')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Add Your Venue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}