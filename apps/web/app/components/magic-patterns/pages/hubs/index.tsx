import React, { useState } from 'react';
import { Search, MapPin, Users, Star, TrendingUp, Filter, Grid, List, Heart, MessageCircle, Calendar, Tag } from 'lucide-react';
import { useNavigate } from 'react-router';

interface HubsDiscoveryPageProps {
  hubs: any[];
}

const HubsDiscoveryPage = ({ hubs }: HubsDiscoveryPageProps) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  
  // Use the hubs data from the database
  const communities = hubs || [];
  
  const handleCommunityClick = (hubId: string) => {
    navigate(`/hub/${hubId}`);
  };

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Communities', count: communities.length },
    { id: 'music', name: 'Music & Arts', count: communities.filter(c => c.categories?.includes('Music')).length },
    { id: 'lifestyle', name: 'Lifestyle', count: communities.filter(c => c.categories?.includes('Lifestyle')).length },
    { id: 'fitness', name: 'Fitness & Health', count: communities.filter(c => c.categories?.includes('Fitness')).length },
    { id: 'food', name: 'Food & Dining', count: communities.filter(c => c.categories?.includes('Food')).length },
    { id: 'business', name: 'Business', count: communities.filter(c => c.categories?.includes('Business')).length },
  ];

  // Sort options
  const sortOptions = [
    { id: 'popular', name: 'Most Popular', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'newest', name: 'Newest', icon: <Calendar className="h-4 w-4" /> },
    { id: 'members', name: 'Most Members', icon: <Users className="h-4 w-4" /> },
    { id: 'activity', name: 'Most Active', icon: <MessageCircle className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Discover Amazing Communities
              </h1>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Connect with people who share your passions, join local groups,
                and never miss what's happening in your area.
              </p>
              
              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-2 flex items-center shadow-xl max-w-2xl mx-auto">
                <div className="flex-grow flex items-center px-4">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search communities..." 
                    className="w-full border-none focus:ring-0 text-gray-800 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="border-l border-gray-200 pl-4 pr-4 flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-800 font-medium">Clearwater, FL</span>
                </div>
                <button className="ml-4 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Filter className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communities List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Communities' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="text-sm text-gray-500">
              {communities.length} communities found
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {communities.map(community => (
                <div 
                  key={community.id} 
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handleCommunityClick(community.id)}
                >
                  {/* Community Image */}
                  <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                    <img 
                      src={community.banner_image || community.image} 
                      alt={community.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Featured Badge */}
                    {community.is_featured && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </div>
                      </div>
                    )}

                    {/* Verified Badge */}
                    {community.is_verified && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-blue-500 text-white p-1 rounded-full">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Community Info */}
                  <div className="p-6">
                    {/* Creator Info */}
                    <div className="flex items-center mb-3">
                      <img 
                        src={community.creator_avatar || community.logo} 
                        alt={community.creator_name} 
                        className="h-8 w-8 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{community.creator_name}</div>
                        <div className="text-xs text-gray-500">Creator</div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {community.name}
                    </h3>
                    
                    {community.tagline && (
                      <p className="text-sm text-indigo-600 font-medium mb-2">
                        {community.tagline}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {community.description}
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {community.categories?.slice(0, 3).map((category: string, index: number) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{community.members_count?.toLocaleString() || community.members?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{community.posts_count || '0'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{community.events_count || '0'}</span>
                        </div>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {communities.map(community => (
                <div 
                  key={community.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleCommunityClick(community.id)}
                >
                  <div className="flex">
                    {/* Community Image */}
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden flex-shrink-0">
                      <img 
                        src={community.banner_image || community.image} 
                        alt={community.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Community Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <img 
                              src={community.creator_avatar || community.logo} 
                              alt={community.creator_name} 
                              className="h-6 w-6 rounded-full mr-2"
                            />
                            <span className="text-sm text-gray-500">{community.creator_name}</span>
                            {community.is_verified && (
                              <div className="ml-2 bg-blue-500 text-white p-0.5 rounded-full">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                            {community.name}
                          </h3>
                          
                          {community.tagline && (
                            <p className="text-sm text-indigo-600 font-medium mb-2">
                              {community.tagline}
                            </p>
                          )}
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {community.description}
                          </p>

                          {/* Categories */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {community.categories?.slice(0, 4).map((category: string, index: number) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {category}
                              </span>
                            ))}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{community.members_count?.toLocaleString() || community.members?.toLocaleString() || '0'} members</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>{community.posts_count || '0'} posts</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{community.events_count || '0'} events</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          {community.is_featured && (
                            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </div>
                          )}
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            Join Community
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default HubsDiscoveryPage;