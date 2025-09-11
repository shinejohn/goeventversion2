import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { HeartIcon, ShareIcon, CalendarIcon, MapPinIcon, StarIcon, MessageCircleIcon } from 'lucide-react';

interface PerformerProfilePageProps {
  performer: any;
  upcomingEvents?: any[];
}

export const PerformerProfilePageSimple = ({
  performer,
  upcomingEvents = []
}: PerformerProfilePageProps) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  
  if (!performer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Performer Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The performer you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/performers')} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse All Performers
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Photo */}
      <div className="relative h-80 md:h-96 bg-gradient-to-br from-purple-600 to-indigo-600">
        {(performer.coverImage || performer.image) && (
          <img 
            src={performer.coverImage || performer.image} 
            alt={`${performer.name} cover`} 
            className="w-full h-full object-cover opacity-30" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 md:-mt-24">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                  <img 
                    src={performer.profileImage || performer.image || 'https://via.placeholder.com/150'} 
                    alt={performer.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {performer.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-600">
                      {performer.genres && performer.genres.length > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {performer.genres[0]}
                        </span>
                      )}
                      {performer.location && (
                        <span className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {typeof performer.location === 'string' 
                            ? performer.location 
                            : `${performer.location.city}, ${performer.location.state}`
                          }
                        </span>
                      )}
                      {performer.rating && performer.rating > 0 && (
                        <span className="flex items-center">
                          <StarIcon className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                          <span>{performer.rating}</span>
                          {performer.reviewCount > 0 && (
                            <span className="text-gray-500 ml-1">
                              ({performer.reviewCount} reviews)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 md:mt-0 flex gap-3">
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`inline-flex items-center px-4 py-2 rounded-md font-medium ${
                        isFollowing
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      <HeartIcon className="h-5 w-5 mr-2" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <ShareIcon className="h-5 w-5 mr-2" />
                      Share
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <MessageCircleIcon className="h-5 w-5 mr-2" />
                      Contact
                    </button>
                  </div>
                </div>

                {/* Bio */}
                {performer.bio && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">About</h2>
                    <p className="text-gray-600">{performer.bio}</p>
                  </div>
                )}

                {/* Price Info */}
                {performer.price && (
                  <div className="mt-4">
                    <p className="text-lg">
                      <span className="font-medium">Booking Rate:</span> {performer.price}
                    </p>
                  </div>
                )}

                {/* Next Performance */}
                {performer.nextPerformance && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">Next Performance</p>
                    <p className="text-sm text-purple-700 mt-1">
                      {new Date(performer.nextPerformance).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mt-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Upcoming Shows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {new Date(event.start_datetime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {event.venue?.name || 'Venue TBA'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 

