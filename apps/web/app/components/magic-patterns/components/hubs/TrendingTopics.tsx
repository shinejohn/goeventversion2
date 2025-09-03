import React from 'react';
import { useNavigate } from 'react-router';
import { TrendingUpIcon, ChevronRightIcon } from 'lucide-react';
type Hub = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  memberCount: number;
  activityLevel: string;
  location: string;
  categories: string[];
  stats: {
    events: number;
    articles: number;
    discussions: number;
  };
  topContributors: {
    id: string;
    name: string;
    avatar: string;
  }[];
  recentActivity: {
    type: string;
    title: string;
    time: string;
  }[];
  isFeatured: boolean;
  creator: string;
  createdAt: string;
};
type TrendingTopicsProps = {
  trendingHubs: Hub[];
};
export const TrendingTopics = ({
  trendingHubs
}: TrendingTopicsProps) => {
  const navigate = useNavigate();
  if (trendingHubs.length === 0) {
    return null;
  }
  return <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUpIcon className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Trending Topics</h2>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center" onClick={() => navigate('/hubs/trending')}>
          View all trending
          <ChevronRightIcon className="ml-1 h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trendingHubs.map(hub => <div key={hub.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => navigate(`/hubs/${hub.id}`)}>
            <div className="relative h-32 overflow-hidden">
              <img src={hub.image} alt={hub.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                  Trending
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-bold text-sm line-clamp-2">
                  {hub.name}
                </h3>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-600 line-clamp-2">
                {hub.tagline}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="flex -space-x-1 overflow-hidden">
                    {hub.topContributors.slice(0, 3).map((contributor, index) => <img key={index} className="inline-block h-5 w-5 rounded-full ring-1 ring-white" src={contributor.avatar} alt={contributor.name} />)}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {hub.memberCount.toLocaleString()} members
                  </span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                  Active
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                <div className="flex space-x-2 text-xs text-gray-500">
                  <span>{hub.stats.events} events</span>
                  <span>•</span>
                  <span>{hub.stats.discussions} discussions</span>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};