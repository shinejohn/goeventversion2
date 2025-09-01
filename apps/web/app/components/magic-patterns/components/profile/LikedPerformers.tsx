import React, { useEffect, useState } from 'react';
import { StarIcon, CalendarIcon, ChevronRightIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
type LikedPerformersProps = {
  userId: string;
};
export const LikedPerformers = ({
  userId
}: LikedPerformersProps) => {
  const {
    navigateTo
  } = useNavigationContext();
  const [likedPerformers, setLikedPerformers] = useState([]);
  // This would fetch real data in a production environment
  useEffect(() => {
    // API call would go here
    setLikedPerformers([]);
  }, [userId]);
  return <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Liked Performers
        </h2>
        <span className="text-sm text-gray-500">
          {likedPerformers.length} performers
        </span>
      </div>
      {likedPerformers.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedPerformers.map((performer: any) => <div key={performer.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo(`/performers/${performer.id}`)}>
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
                <div className="mt-3 flex justify-end">
                  <button onClick={e => {
              e.stopPropagation();
              navigateTo(`/performers/${performer.id}`);
            }} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 flex items-center">
                    View Profile
                    <ChevronRightIcon className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>)}
        </div> : <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">
            <StarIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No liked performers yet
          </h3>
          <p className="text-gray-500 mb-4">
            When you like performers, they'll appear here
          </p>
          <button onClick={() => navigateTo('/performers')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
            Discover Performers
          </button>
        </div>}
    </div>;
};