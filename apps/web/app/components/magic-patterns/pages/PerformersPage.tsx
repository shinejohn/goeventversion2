import React, { useState } from 'react';
import { ArrowRightIcon, MusicIcon, CalendarIcon, MapPinIcon, StarIcon, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { LocationSelector } from '../components/ui/LocationSelector';
interface PerformersPageProps {
  performers?: any[];
}

export const PerformersPage = ({ performers = [] }: PerformersPageProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };
  const performerCategories = [{
    title: 'Musicians',
    description: 'Bands, solo artists, and musical performers',
    path: '/performers/musicians',
    count: 45
  }, {
    title: 'Comedians',
    description: 'Stand-up comics and comedy troupes',
    path: '/performers/comedy',
    count: 18
  }, {
    title: 'DJs',
    description: 'Electronic music performers and party DJs',
    path: '/performers/djs',
    count: 32
  }, {
    title: 'Local Artists',
    description: 'Talented creators from the community',
    path: '/performers/artists',
    count: 56
  }];
  // Use REAL performers data from props
  const featuredPerformers = performers.slice(0, 6).map(performer => ({
    id: performer.id,
    name: performer.name || performer.stage_name,
    image: performer.image || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: performer.category || 'Performer',
    genre: performer.genres?.[0] || 'Entertainment',
    average_rating: performer.rating || 0,
    total_reviews: performer.reviews || 0,
    nextEvent: 'Check availability'
  }));
  return <div className="min-h-screen bg-white">
      {/* Page Header with Search and Location */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Performers</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-64">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Search performers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
              </form>
            </div>
            <div className="w-full sm:w-auto">
              <LocationSelector currentLocation="Clearwater, FL" eventCount={120} />
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <div className="bg-white text-purple-700 py-12 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Discover Local Performers
            </h1>
            <p className="mt-3 text-xl">
              Find talent for your event or discover your next favorite artist
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex">
                <button onClick={() => navigate('/performers/join')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  Join as Performer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Performer Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse Performers By Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performerCategories.map((category, index) => <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(category.path)}>
              <h3 className="text-lg font-bold text-gray-900">
                {category.title}
              </h3>
              <p className="text-gray-600 mt-2">{category.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {category.count} performers
                </span>
                <ArrowRightIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>)}
        </div>
      </div>
      {/* Featured Performers */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Performers
            </h2>
            <button className="text-purple-600 hover:text-purple-800 flex items-center font-medium" onClick={() => navigate('/performers')}>
              View all performers
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPerformers.map(performer => <div key={performer.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/performers/${performer.id}`)}>
                <div className="h-48 overflow-hidden">
                  <img src={performer.image} alt={performer.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {performer.name}
                    </h3>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {performer.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {performer.genre}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">{performer.average_rating}</span>
                    <span className="ml-1 text-gray-500">
                      ({performer.total_reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center text-sm font-medium text-purple-600">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Next: {performer.nextEvent}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Are you a performer?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join When's The Fun to connect with venues, get bookings, and grow
          your audience
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm" onClick={() => navigate('/performers/join')}>
            Create Performer Profile
          </button>
          <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-md shadow-sm border border-gray-300" onClick={() => navigate('/book/performer')}>
            Find Gigs
          </button>
        </div>
      </div>
    </div>;
};