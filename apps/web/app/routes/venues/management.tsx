import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeftIcon, BuildingIcon, CalendarIcon, SettingsIcon, BarChart3Icon } from 'lucide-react';

export default function VenueManagementRoute() {
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
          <h1 className="text-3xl font-bold text-gray-900">Venue Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your venues, bookings, and analytics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <BuildingIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">My Venues</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View and edit your venue listings
            </p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium">
              Manage Venues
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Track and manage venue bookings
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
              View Bookings
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <BarChart3Icon className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View performance and insights
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium">
              View Analytics
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Venue Management Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              This comprehensive management system is under development. 
              For now, please contact us to manage your venue listings.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/contact')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Contact Support
              </button>
              <button
                onClick={() => navigate('/venues')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium"
              >
                Browse Venues
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}