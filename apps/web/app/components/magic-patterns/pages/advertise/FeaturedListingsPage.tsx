import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowRightIcon, StarIcon } from 'lucide-react';
export const FeaturedListingsPage = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
              Featured Listings
            </h1>
            <p className="mt-3 text-xl max-w-3xl mx-auto">
              Get premium placement in search results and category pages
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <StarIcon className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">
            Stand Out From The Crowd
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Featured listings appear at the top of search results and category
            pages
          </p>
        </div>
        <div className="mt-12 text-center">
          <button onClick={() => navigate('/advertise/packages')} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-md inline-flex items-center">
            View Featured Listing Packages
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>;
};