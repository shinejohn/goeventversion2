import React from 'react';
import { StarIcon, CheckCircleIcon, HeartIcon, PlayIcon, CalendarIcon, MapPinIcon, ClockIcon, UsersIcon } from 'lucide-react';
type PerformerGridProps = {
  performers: any[];
  onPerformerClick: (performerId: string) => void;
};
export const PerformerGrid = ({
  performers,
  onPerformerClick
}: PerformerGridProps) => {
  // Format follower count (e.g., 1.5K)
  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };
  // Format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {performers.map(performer => <div key={performer.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPerformerClick(performer.id)}>
          {/* Profile Image */}
          <div className="relative h-48 overflow-hidden bg-gray-200">
            <img src={performer.profileImage} alt={performer.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
            {/* Trending Badge */}
            {performer.trendingScore > 80 && <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <span className="mr-1">🔥</span> Trending
              </div>}
            {/* New Badge */}
            {new Date(performer.addedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                New
              </div>}
            {/* Quick Action Buttons */}
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <button className="bg-white/80 hover:bg-white p-2 rounded-full text-indigo-600 backdrop-blur-sm" onClick={e => {
            e.stopPropagation();
            // Handle heart click
          }}>
                <HeartIcon className="h-5 w-5" />
              </button>
              {performer.hasSamples && <button className="bg-white/80 hover:bg-white p-2 rounded-full text-indigo-600 backdrop-blur-sm" onClick={e => {
            e.stopPropagation();
            // Handle play click
          }}>
                  <PlayIcon className="h-5 w-5" />
                </button>}
            </div>
          </div>
          {/* Content */}
          <div className="p-4">
            {/* Header with Name and Verification */}
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-lg text-gray-900 flex items-center">
                {performer.name}
                {performer.isVerified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
              </h3>
            </div>
            {/* Genre Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {performer.genres.slice(0, 3).map((genre: string, index: number) => <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {genre}
                  </span>)}
            </div>
            {/* Rating and Followers */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-700">
                  {performer.rating}
                </span>
                <span className="ml-1 text-xs text-gray-500">
                  ({performer.reviewCount})
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {formatFollowerCount(performer.followerCount)} followers
              </div>
            </div>
            {/* Next Show Preview */}
            {performer.upcomingShows.length > 0 && <div className="border-t border-gray-100 pt-3 mb-3">
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Next Show
                </div>
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center text-sm text-gray-700">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{formatDate(performer.upcomingShows[0].date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700 mt-0.5">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="truncate">
                        {performer.upcomingShows[0].venue}
                      </span>
                    </div>
                  </div>
                  {performer.upcomingShows[0].ticketsAvailable && <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full" onClick={e => {
              e.stopPropagation();
              // Handle tickets click
            }}>
                      Get Tickets
                    </button>}
                </div>
              </div>}
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-1 text-xs text-gray-500">
              <div className="flex flex-col items-center p-1 bg-gray-50 rounded">
                <ClockIcon className="h-3 w-3 mb-0.5" />
                <span>{performer.yearsActive} yrs</span>
              </div>
              <div className="flex flex-col items-center p-1 bg-gray-50 rounded">
                <UsersIcon className="h-3 w-3 mb-0.5" />
                <span>{performer.showsPlayed}+ shows</span>
              </div>
              <div className="flex flex-col items-center p-1 bg-gray-50 rounded">
                <MapPinIcon className="h-3 w-3 mb-0.5" />
                <span>{performer.homeCity.split(',')[0]}</span>
              </div>
            </div>
          </div>
          {/* Footer with View Profile Button */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <button className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded" onClick={() => onPerformerClick(performer.id)}>
              View Profile
            </button>
          </div>
        </div>)}
    </div>;
};