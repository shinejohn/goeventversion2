import React from 'react';
import { useNavigationContext } from '../context/NavigationContext';
import { HomeIcon } from 'lucide-react';
export const NotFoundPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  return <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <button onClick={() => navigateTo('/')} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <HomeIcon className="w-4 h-4 mr-2" />
            Go to Homepage
          </button>
          <div>
            <button onClick={() => navigateTo('/directory')} className="text-indigo-600 hover:text-indigo-800 font-medium">
              View Page Directory
            </button>
          </div>
        </div>
      </div>
    </div>;
};