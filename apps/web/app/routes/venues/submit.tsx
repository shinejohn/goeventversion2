import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';

export default function VenueSubmitRoute() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/venues')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Venues
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Submit Your Venue</h1>
          <p className="mt-2 text-gray-600">
            List your venue on When&apos;s The Fun to connect with event organizers
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Venue Submission Form
            </h2>
            <p className="text-gray-600 mb-6">
              This feature is coming soon! We&apos;re building a comprehensive venue submission system.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Contact Us for Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}