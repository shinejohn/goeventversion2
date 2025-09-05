import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeftIcon, TrendingUpIcon, FlameIcon, EyeIcon, HeartIcon } from 'lucide-react';

export default function VenuesTrendingRoute() {
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
            <TrendingUpIcon className="h-8 w-8 text-orange-500 mr-3" />
            Trending Venues
          </h1>
          <p className="mt-2 text-gray-600">
            Discover the most popular venues in your area
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <FlameIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hot This Week</h3>
            <p className="text-gray-600">Most booked venues</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <EyeIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Most Viewed</h3>
            <p className="text-gray-600">Highest page views</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <HeartIcon className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fan Favorites</h3>
            <p className="text-gray-600">Highest rated venues</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <TrendingUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Trending Venues Coming Soon
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We&apos;re building a comprehensive trending system that will showcase the most popular venues 
              based on bookings, views, ratings, and community engagement.
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
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium"
              >
                List Your Venue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}