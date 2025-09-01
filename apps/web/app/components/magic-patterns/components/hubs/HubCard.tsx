import React, { useState } from 'react';
import { UserIcon, CalendarIcon, MessageSquareIcon, FileTextIcon, ChevronRightIcon, ActivityIcon, PlusIcon, BellIcon } from 'lucide-react';
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
type HubCardProps = {
  hub: Hub;
  viewMode: 'grid' | 'masonry';
  onView: () => void;
  onJoin: () => void;
};
export const HubCard = ({
  hub,
  viewMode,
  onView,
  onJoin
}: HubCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const getActivityIndicator = (level: string) => {
    switch (level) {
      case 'high':
        return <span className="flex items-center text-green-600 text-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
            High Activity
          </span>;
      case 'medium':
        return <span className="flex items-center text-yellow-600 text-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-500 mr-1.5"></span>
            Medium Activity
          </span>;
      case 'low':
        return <span className="flex items-center text-gray-500 text-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-gray-400 mr-1.5"></span>
            Low Activity
          </span>;
      default:
        return null;
    }
  };
  return <div className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 ${viewMode === 'masonry' ? 'flex flex-col' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img src={hub.image} alt={hub.name} className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {hub.categories.slice(0, 3).map((category, index) => <span key={index} className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/30 text-white backdrop-blur-sm">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>)}
            {hub.categories.length > 3 && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/30 text-white backdrop-blur-sm">
                +{hub.categories.length - 3} more
              </span>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 text-white mr-1.5" />
              <span className="text-white text-sm font-medium">
                {hub.memberCount.toLocaleString()} members
              </span>
            </div>
            <div>{getActivityIndicator(hub.activityLevel)}</div>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="p-4 flex-grow">
        <div onClick={onView} className="cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">
            {hub.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{hub.tagline}</p>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <MapPinIcon className="h-3.5 w-3.5 mr-1" />
          <span>{hub.location}</span>
          <span className="mx-2">•</span>
          <span>Created by {hub.creator}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <div className="text-lg font-semibold text-gray-900">
              {hub.stats.events}
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              Events
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <div className="text-lg font-semibold text-gray-900">
              {hub.stats.articles}
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center">
              <FileTextIcon className="h-3 w-3 mr-1" />
              Articles
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <div className="text-lg font-semibold text-gray-900">
              {hub.stats.discussions}
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center">
              <MessageSquareIcon className="h-3 w-3 mr-1" />
              Discussions
            </div>
          </div>
        </div>
        {/* Top Contributors */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-500">
              Top Contributors
            </h4>
          </div>
          <div className="flex -space-x-2 overflow-hidden">
            {hub.topContributors.map((contributor, index) => <img key={index} className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src={contributor.avatar} alt={contributor.name} title={contributor.name} />)}
            {hub.memberCount > hub.topContributors.length && <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 text-gray-800 text-xs font-medium ring-2 ring-white">
                +{hub.memberCount - hub.topContributors.length}
              </span>}
          </div>
        </div>
        {/* Recent Activity */}
        {viewMode === 'masonry' && hub.recentActivity.length > 0 && <div className="mt-4 border-t border-gray-100 pt-4">
            <h4 className="text-xs font-medium text-gray-500 mb-2">
              Recent Activity
            </h4>
            <div className="space-y-2">
              {hub.recentActivity.map((activity, index) => <div key={index} className="flex items-start">
                  <span className={`inline-block h-2 w-2 rounded-full mt-1.5 mr-2 ${activity.type === 'event' ? 'bg-purple-400' : activity.type === 'article' ? 'bg-blue-400' : 'bg-yellow-400'}`}></span>
                  <div>
                    <div className="text-sm text-gray-800">
                      {activity.title}
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>)}
            </div>
          </div>}
      </div>
      {/* Action Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <button onClick={onView} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
          View Hub
          <ChevronRightIcon className="ml-1 h-4 w-4" />
        </button>
        <div className="flex space-x-2">
          <button onClick={() => {}} className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-200" title="Subscribe to updates">
            <BellIcon className="h-4 w-4" />
          </button>
          <button onClick={onJoin} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            <PlusIcon className="h-3.5 w-3.5 mr-1" />
            Join
          </button>
        </div>
      </div>
    </div>;
};
// Add the missing MapPinIcon component
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>;
}