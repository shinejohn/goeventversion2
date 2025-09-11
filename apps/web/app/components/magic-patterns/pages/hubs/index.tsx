import React from 'react';
import { Search, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router';

interface HubsDiscoveryPageProps {
  hubs: any[];
}

const HubsDiscoveryPage = ({ hubs }: HubsDiscoveryPageProps) => {
  const navigate = useNavigate();
  
  // Use the hubs data from the database
  const communities = hubs || [];
  const handleCommunityClick = communityId => {
    navigate(`/c/${communityId}`);
  };
  return <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Discover Local Communities
              </h1>
              <p className="text-lg text-indigo-100 mb-8">
                Connect with people who share your interests, join local groups,
                and never miss what's happening in your area.
              </p>
              <div className="bg-white rounded-lg p-2 flex items-center shadow-md">
                <div className="flex-grow flex items-center">
                  <Search className="h-5 w-5 text-gray-400 ml-2 mr-2" />
                  <input type="text" placeholder="Search communities..." className="w-full border-none focus:ring-0 text-gray-800" />
                </div>
                <div className="border-l border-gray-200 pl-4 flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-800">Clearwater, FL</span>
                </div>
                <button className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Communities List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Communities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communities.map(community => <div key={community.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCommunityClick(community.id)}>
                <div className="h-40 bg-gray-100 relative">
                  <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {community.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {community.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{community.location}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 text-indigo-500 mr-1" />
                      <span>{community.members.toLocaleString()} members</span>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Join
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </main>
    </div>;
};
export default HubsDiscoveryPage;