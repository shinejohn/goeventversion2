import React from 'react';
import { CalendarIcon, UsersIcon, EyeIcon, HeartIcon, ShareIcon, ExternalLinkIcon, StarIcon, ClockIcon } from 'lucide-react';

interface CalendarCardProps {
  calendar: {
    id: string;
    name: string;
    description: string;
    slug: string;
    creator: {
      name: string;
      avatar_url?: string;
    };
    event_count: number;
    subscriber_count: number;
    view_count: number;
    is_public: boolean;
    color: string;
    image_url?: string;
    created_at: string;
    categories?: string[];
    is_featured?: boolean;
    is_verified?: boolean;
  };
  onView: (slug: string) => void;
  onFollow?: (id: string) => void;
  onShare?: (slug: string) => void;
  viewMode?: 'grid' | 'list';
}

export const CalendarCard: React.FC<CalendarCardProps> = ({
  calendar,
  onView,
  onFollow,
  onShare,
  viewMode = 'grid'
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCardClick = () => {
    onView(calendar.slug);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFollow?.(calendar.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(calendar.slug);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
        onClick={handleCardClick}
      >
        <div className="p-6 flex items-center space-x-4">
          {/* Calendar Icon/Image */}
          <div 
            className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: calendar.color }}
          >
            {calendar.image_url ? (
              <img 
                src={calendar.image_url} 
                alt={calendar.name}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              <CalendarIcon className="w-8 h-8" />
            )}
          </div>

          {/* Calendar Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {calendar.name}
              </h3>
              {calendar.is_verified && (
                <StarIcon className="w-4 h-4 text-blue-500" />
              )}
              {calendar.is_featured && (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {calendar.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <UsersIcon className="w-4 h-4" />
                <span>{calendar.subscriber_count} subscribers</span>
              </div>
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{calendar.event_count} events</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeIcon className="w-4 h-4" />
                <span>{calendar.view_count} views</span>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center space-x-2 mb-2">
              {calendar.creator.avatar_url ? (
                <img 
                  src={calendar.creator.avatar_url} 
                  alt={calendar.creator.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {calendar.creator.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-600">{calendar.creator.name}</span>
            </div>
            <div className="text-xs text-gray-500">
              Created {formatDate(calendar.created_at)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <button
              onClick={handleFollowClick}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Follow calendar"
            >
              <HeartIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleShareClick}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Share calendar"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleCardClick}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
              title="View calendar"
            >
              <ExternalLinkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Calendar Header */}
      <div className="relative">
        {calendar.image_url ? (
          <img 
            src={calendar.image_url} 
            alt={calendar.name}
            className="w-full h-32 object-cover rounded-t-lg"
          />
        ) : (
          <div 
            className="w-full h-32 rounded-t-lg flex items-center justify-center"
            style={{ backgroundColor: calendar.color }}
          >
            <CalendarIcon className="w-12 h-12 text-white" />
          </div>
        )}
        
        {/* Featured Badge */}
        {calendar.is_featured && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Verified Badge */}
        {calendar.is_verified && (
          <div className="absolute top-2 right-2">
            <StarIcon className="w-5 h-5 text-blue-500" />
          </div>
        )}
      </div>

      {/* Calendar Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {calendar.name}
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {calendar.description}
        </p>

        {/* Creator Info */}
        <div className="flex items-center space-x-2 mb-3">
          {calendar.creator.avatar_url ? (
            <img 
              src={calendar.creator.avatar_url} 
              alt={calendar.creator.name}
              className="w-5 h-5 rounded-full"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {calendar.creator.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-600">{calendar.creator.name}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <UsersIcon className="w-4 h-4" />
            <span>{calendar.subscriber_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{calendar.event_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <EyeIcon className="w-4 h-4" />
            <span>{calendar.view_count}</span>
          </div>
        </div>

        {/* Categories */}
        {calendar.categories && calendar.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {calendar.categories.slice(0, 3).map((category, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
              >
                {category}
              </span>
            ))}
            {calendar.categories.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                +{calendar.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Created {formatDate(calendar.created_at)}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleFollowClick}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Follow calendar"
            >
              <HeartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareClick}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Share calendar"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
