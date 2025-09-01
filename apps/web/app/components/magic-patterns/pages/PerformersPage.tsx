import React, { useState } from 'react';
import { ArrowRightIcon, MusicIcon, CalendarIcon, MapPinIcon, StarIcon, SearchIcon } from 'lucide-react';
import { useNavigationContext } from '../context/NavigationContext';
import { LocationSelector } from '../components/ui/LocationSelector';
export const PerformersPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
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
  // Sample performers for the page with updated image URLs
  const featuredPerformers = [{
    id: 'performer-1',
    name: 'The Sunset Vibes',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Band',
    genre: 'Indie Rock',
    rating: 4.8,
    reviewCount: 42,
    nextEvent: 'Aug 15 at Capitol Theatre'
  }, {
    id: 'performer-2',
    name: 'DJ Coastal',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'DJ',
    genre: 'House / Electronic',
    rating: 4.7,
    reviewCount: 38,
    nextEvent: 'Aug 20 at The District Lounge'
  }, {
    id: 'performer-3',
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Musician',
    genre: 'Folk / Acoustic',
    rating: 4.9,
    reviewCount: 29,
    nextEvent: 'Aug 22 at Clear Sky on Cleveland'
  }, {
    id: 'performer-4',
    name: 'Comedy Crew',
    image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Comedy',
    genre: 'Stand-up / Improv',
    rating: 4.6,
    reviewCount: 24,
    nextEvent: 'Aug 25 at Ruth Eckerd Hall'
  }, {
    id: 'performer-5',
    name: 'The Beach Boys Tribute',
    image: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Band',
    genre: 'Tribute / Covers',
    rating: 4.5,
    reviewCount: 36,
    nextEvent: 'Sep 2 at Coachman Park'
  }, {
    id: 'performer-6',
    name: 'Street Art Collective',
    image: 'https://images.unsplash.com/photo-1460480278897-2c8dce96d2f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Artists',
    genre: 'Visual Arts',
    rating: 4.7,
    reviewCount: 31,
    nextEvent: 'Sep 5 at Downtown Arts District'
  }];
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
                <button onClick={() => navigateTo('/performers/join')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
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
          {performerCategories.map((category, index) => <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo(category.path)}>
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
            <button className="text-purple-600 hover:text-purple-800 flex items-center font-medium" onClick={() => navigateTo('/performers')}>
              View all performers
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPerformers.map(performer => <div key={performer.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo(`/performers/${performer.id}`)}>
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
                    <span className="ml-1">{performer.rating}</span>
                    <span className="ml-1 text-gray-500">
                      ({performer.reviewCount} reviews)
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
          <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm" onClick={() => navigateTo('/performers/join')}>
            Create Performer Profile
          </button>
          <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-md shadow-sm border border-gray-300" onClick={() => navigateTo('/book/performer')}>
            Find Gigs
          </button>
        </div>
      </div>
    </div>;
};