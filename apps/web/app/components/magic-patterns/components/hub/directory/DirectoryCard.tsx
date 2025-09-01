import React, { useState } from 'react';
import { MapPinIcon, StarIcon, UsersIcon, CalendarIcon, PlusIcon, CheckIcon, ExternalLinkIcon, MusicIcon, BuildingIcon, DollarSignIcon, InfoIcon } from 'lucide-react';
type DirectoryCardProps = {
  item: any;
  type: 'performer' | 'venue';
  viewMode: 'grid' | 'list';
  hubSlug: string;
  onView: () => void;
  onFollow: () => void;
};
export const DirectoryCard = ({
  item,
  type,
  viewMode,
  hubSlug,
  onView,
  onFollow
}: DirectoryCardProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow();
  };
  // Determine the main image to display
  const mainImage = type === 'performer' ? item.profileImage : item.images && item.images.length > 0 ? item.images[0] : '';
  // Determine number of upcoming events
  const upcomingEventsCount = type === 'performer' ? item.upcomingShows ? item.upcomingShows.length : 0 : item.upcomingEvents || 0;
  // Determine followers count
  const followersCount = type === 'performer' ? item.followerCount : item.followersCount || 0;
  // Determine location
  const location = type === 'performer' ? item.homeCity : item.location ? item.location.address.split(',')[1].trim() : '';
  // Determine badges
  const badges = item.hubBadges || [];
  return <div className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Image Section */}
      <div className={`relative ${viewMode === 'list' ? 'md:w-1/3 h-48 md:h-auto' : 'h-48'} overflow-hidden`}>
        <img src={mainImage} alt={item.name} className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {badges.map((badge: string, index: number) => <span key={index} className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/30 backdrop-blur-sm text-white">
              {badge}
            </span>)}
          {type === 'performer' && item.isVerified && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/80 backdrop-blur-sm text-white">
              Verified
            </span>}
          {type === 'venue' && item.verified && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/80 backdrop-blur-sm text-white">
              Verified
            </span>}
        </div>
        {/* Type Icon */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
          {type === 'performer' ? <MusicIcon className="h-5 w-5 text-indigo-600" /> : <BuildingIcon className="h-5 w-5 text-indigo-600" />}
        </div>
      </div>
      {/* Content Section */}
      <div className={`p-4 ${viewMode === 'list' ? 'md:w-2/3' : ''}`}>
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={onView}>
            {item.name}
          </h3>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium text-yellow-700">
              {item.rating}
            </span>
            <span className="text-xs text-yellow-600 ml-1">
              ({type === 'performer' ? item.reviewCount : item.reviewCount})
            </span>
          </div>
        </div>
        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span>{location}</span>
        </div>
        {/* Bio/Description - truncated */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {type === 'performer' ? item.bio : item.description}
        </p>
        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm mb-3">
          {/* Followers */}
          <div className="flex items-center">
            <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-700">
              {followersCount.toLocaleString()} follower
              {followersCount !== 1 ? 's' : ''}
            </span>
          </div>
          {/* Upcoming Events */}
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-700">
              {upcomingEventsCount} upcoming event
              {upcomingEventsCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        {/* Additional Info */}
        {type === 'performer' && <div className="flex flex-wrap gap-1.5 mb-3">
            {item.genres.slice(0, 3).map((genre: string, index: number) => <span key={index} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                {genre}
              </span>)}
            {item.genres.length > 3 && <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                +{item.genres.length - 3} more
              </span>}
          </div>}
        {type === 'venue' && <div className="flex items-center mb-3">
            <DollarSignIcon className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-700 text-sm">
              ${item.pricePerHour}/hour • {item.capacity} capacity
            </span>
          </div>}
        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button onClick={onView} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
            View Details
            <ExternalLinkIcon className="ml-1 h-4 w-4" />
          </button>
          <button onClick={handleFollow} className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${isFollowing ? 'bg-green-50 text-green-700 border-green-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent'}`}>
            {isFollowing ? <>
                <CheckIcon className="h-4 w-4 mr-1" />
                Following
              </> : <>
                <PlusIcon className="h-4 w-4 mr-1" />
                Follow
              </>}
          </button>
        </div>
      </div>
    </div>;
};