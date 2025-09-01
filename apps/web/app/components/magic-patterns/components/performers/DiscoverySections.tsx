import React from 'react';
import { SparklesIcon, LightbulbIcon, ArrowRightIcon, StarIcon, CheckCircleIcon, MapPinIcon, CalendarIcon } from 'lucide-react';
type DiscoverySectionsProps = {
  performers: any[];
  onPerformerClick: (performerId: string) => void;
};
export const DiscoverySections = ({
  performers,
  onPerformerClick
}: DiscoverySectionsProps) => {
  // Get trending performers (top 10 by trending score)
  const trendingPerformers = [...performers].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 10);
  // Get new performers (added in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newPerformers = performers.filter(performer => new Date(performer.addedDate) > thirtyDaysAgo).sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()).slice(0, 5);
  // Get recommended performers (mock recommendation based on rating and follower count)
  const recommendedPerformers = [...performers].sort((a, b) => b.rating * 0.7 + b.followerCount * 0.3 - (a.rating * 0.7 + a.followerCount * 0.3)).slice(0, 5);
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  return <div className="space-y-12 mt-8">
      {/* Trending This Week Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <div className="h-5 w-5 text-red-500 mr-2" />
            Trending This Week
          </h2>
          <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
            View all trending
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
            {trendingPerformers.map((performer, index) => <div key={performer.id} className="flex-shrink-0 w-48 bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPerformerClick(performer.id)}>
                <div className="relative h-32 overflow-hidden bg-gray-200">
                  <img src={performer.profileImage} alt={performer.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <div className="h-3 w-3 mr-1" />#{index + 1}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 flex items-center text-sm truncate">
                    {performer.name}
                    {performer.isVerified && <CheckCircleIcon className="h-3 w-3 text-blue-500 ml-1 flex-shrink-0" />}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="ml-1">{performer.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{performer.genres[0]}</span>
                  </div>
                  {performer.upcomingShows.length > 0 && <div className="mt-2 text-xs text-gray-600 flex items-center">
                      <CalendarIcon className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="truncate">
                        Next: {formatDate(performer.upcomingShows[0].date)}
                      </span>
                    </div>}
                </div>
                <button className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium border-t border-gray-200">
                  Quick Follow
                </button>
              </div>)}
          </div>
          {/* Gradient fade for overflow */}
          <div className="absolute top-0 bottom-4 right-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </section>
      {/* New to Clearwater Section */}
      {newPerformers.length > 0 && <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <SparklesIcon className="h-5 w-5 text-green-500 mr-2" />
              New to Clearwater
            </h2>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
              View all new performers
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {newPerformers.map(performer => <div key={performer.id} className="bg-white rounded-lg border border-green-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPerformerClick(performer.id)}>
                <div className="p-4 bg-green-50 border-b border-green-100">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <SparklesIcon className="h-3 w-3 mr-1" />
                      New to the scene
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(performer.addedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center p-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img src={performer.profileImage} alt={performer.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      {performer.name}
                      {performer.isVerified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-0.5">
                      <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                        {performer.genres[0]}
                      </span>
                      <span className="mx-1">•</span>
                      <MapPinIcon className="h-3 w-3 text-gray-400" />
                      <span className="ml-0.5 text-xs">
                        {performer.homeCity}
                      </span>
                    </div>
                    {performer.upcomingShows.length > 0 && <div className="mt-1 text-xs text-indigo-600 font-medium">
                        First show:{' '}
                        {formatDate(performer.upcomingShows[0].date)}
                      </div>}
                  </div>
                </div>
                <div className="px-4 py-2 bg-green-50 border-t border-green-100 flex justify-between items-center">
                  {performer.introductoryPricing && <span className="text-xs text-green-700">
                      Introductory pricing available
                    </span>}
                  <button className="ml-auto text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded" onClick={e => {
              e.stopPropagation();
              // Handle follow click
            }}>
                    Follow
                  </button>
                </div>
              </div>)}
          </div>
        </section>}
      {/* Recommended For You Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <LightbulbIcon className="h-5 w-5 text-amber-500 mr-2" />
            Recommended For You
          </h2>
          <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
            View all recommendations
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 mb-6">
          <p className="text-amber-800 text-sm">
            Recommendations are personalized based on your follows, listens, and
            event history. Follow more performers to improve your
            recommendations!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {recommendedPerformers.map(performer => <div key={performer.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPerformerClick(performer.id)}>
              <div className="relative h-32 overflow-hidden bg-gray-200">
                <img src={performer.profileImage} alt={performer.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 flex items-center text-sm">
                  {performer.name}
                  {performer.isVerified && <CheckCircleIcon className="h-3 w-3 text-blue-500 ml-1" />}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {performer.genres.slice(0, 2).map((genre: string, index: number) => <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                        {genre}
                      </span>)}
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <div className="text-amber-700 font-medium mb-1">
                    Because you like:
                  </div>
                  <div className="flex items-center">
                    <div className="h-5 w-5 rounded-full overflow-hidden bg-gray-200">
                      <img src="https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Similar artist" className="w-full h-full object-cover" />
                    </div>
                    <span className="ml-1 truncate">Similar Artist Name</span>
                  </div>
                </div>
              </div>
              <div className="flex border-t border-gray-200">
                <button className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium border-r border-gray-200" onClick={e => {
              e.stopPropagation();
              // Handle follow click
            }}>
                  Follow
                </button>
                <button className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium" onClick={e => {
              e.stopPropagation();
              // Handle listen click
            }}>
                  Quick Listen
                </button>
              </div>
            </div>)}
        </div>
      </section>
    </div>;
};