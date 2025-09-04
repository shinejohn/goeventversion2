import React from 'react';
import { StarIcon, CheckCircleIcon, HeartIcon, PlayIcon, CalendarIcon, MapPinIcon, ClockIcon, MusicIcon, TicketIcon, ArrowRightIcon } from 'lucide-react';
type PerformerListProps = {
  performers: any[];
  onPerformerClick: (performerId: string) => void;
};
export const PerformerList = ({
  performers,
  onPerformerClick
}: PerformerListProps) => {
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
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  return <div className="space-y-4">
      {performers.map(performer => <div key={performer.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPerformerClick(performer.id)}>
          <div className="flex flex-col md:flex-row">
            {/* Profile Image */}
            <div className="md:w-48 h-48 md:h-auto overflow-hidden bg-gray-200 relative">
              <img src={performer.profileImage} alt={performer.name} className="w-full h-full object-cover" />
              {/* Trending Badge */}
              {performer.trendingScore > 80 && <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <span className="mr-1">🔥</span> Trending
                </div>}
              {/* New Badge */}
              {new Date(performer.addedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  New
                </div>}
            </div>
            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex flex-col h-full">
                {/* Header with Name and Verification */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center">
                    {performer.name}
                    {performer.isVerified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-1.5 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={e => {
                  e.stopPropagation();
                  // Handle heart click
                }}>
                      <HeartIcon className="h-5 w-5" />
                    </button>
                    {performer.hasSamples && <button className="p-1.5 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={e => {
                  e.stopPropagation();
                  // Handle play click
                }}>
                        <PlayIcon className="h-5 w-5" />
                      </button>}
                  </div>
                </div>
                {/* Genre Tags and Ratings */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {performer.genres.slice(0, 3).map((genre: string, index: number) => <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {genre}
                      </span>)}
                  <div className="flex items-center ml-auto">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-700">
                      {performer.average_rating}
                    </span>
                    <span className="ml-1 text-xs text-gray-500">
                      ({performer.total_reviews})
                    </span>
                  </div>
                </div>
                {/* Bio Preview */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {performer.bio}
                </p>
                {/* Stats and Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{performer.yearsActive} years active</span>
                  </div>
                  <div className="flex items-center">
                    <MusicIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{performer.showsPlayed}+ shows played</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{performer.homeCity}</span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span>
                      {formatFollowerCount(performer.followerCount)} followers
                    </span>
                  </div>
                </div>
                {/* Booking Status */}
                <div className="mb-3">
                  {performer.availableForBooking ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Available for Booking
                    </span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Limited Availability
                    </span>}
                </div>
                {/* Upcoming Shows */}
                {performer.upcomingShows.length > 0 && <div className="mt-auto">
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                      Upcoming Shows
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {performer.upcomingShows.slice(0, 3).map((show: any, index: number) => <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                            <div className="flex-1">
                              <div className="flex items-center text-sm font-medium text-gray-700">
                                <CalendarIcon className="h-3 w-3 text-gray-400 mr-1" />
                                {formatDate(show.date)}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {show.venue}
                              </div>
                            </div>
                            {show.ticketsAvailable && <button className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center" onClick={e => {
                    e.stopPropagation();
                    // Handle tickets click
                  }}>
                                <TicketIcon className="h-3 w-3 mr-1" />
                                Tickets
                              </button>}
                          </div>)}
                    </div>
                  </div>}
              </div>
            </div>
            {/* Action Button */}
            <div className="md:w-48 p-4 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex items-center justify-center">
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded flex items-center justify-center" onClick={() => onPerformerClick(performer.id)}>
                View Profile
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};