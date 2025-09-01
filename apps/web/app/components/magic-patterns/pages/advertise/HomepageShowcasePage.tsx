import React from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { ArrowRightIcon, LayoutIcon } from 'lucide-react';
export const HomepageShowcasePage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  return <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
              Homepage Showcase
            </h1>
            <p className="mt-3 text-xl max-w-3xl mx-auto">
              Display your events or venue on our high-traffic homepage
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <LayoutIcon className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">
            Premium Homepage Visibility
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Get maximum exposure with prominent placement on our homepage
          </p>
        </div>
        <div className="mt-12 text-center">
          <button onClick={() => navigateTo('/advertise/packages')} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-md inline-flex items-center">
            View Homepage Showcase Packages
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>;
};