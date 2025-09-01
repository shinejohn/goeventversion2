import React, { useState } from 'react';
import { HeartIcon, MessageSquareIcon, ShareIcon, PlayIcon, MusicIcon, ClockIcon, UserIcon } from 'lucide-react';
type MediaCardProps = {
  item: any;
  onClick: () => void;
};
export const MediaCard = ({
  item,
  onClick
}: MediaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  // Format upload date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // Get appropriate overlay icon based on media type
  const getOverlayIcon = () => {
    if (item.type === 'video') {
      return <PlayIcon className="h-12 w-12 text-white" />;
    } else if (item.type === 'audio') {
      return <MusicIcon className="h-12 w-12 text-white" />;
    }
    return null;
  };
  return <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={onClick}>
      {/* Thumbnail */}
      <div className="aspect-w-16 aspect-h-9 sm:aspect-w-3 sm:aspect-h-2 bg-gray-200 relative overflow-hidden">
        <img src={item.thumbnail} alt={item.title} className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`} />
        {/* Media Type Indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          {getOverlayIcon()}
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        {/* Media Info Overlay (appears on hover) */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-white text-center p-4">
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-sm text-white/80 line-clamp-2">
              {item.description}
            </p>
            {item.event && <span className="inline-block mt-2 px-2 py-1 bg-indigo-600/70 rounded-full text-xs">
                {item.event}
              </span>}
          </div>
        </div>
      </div>
      {/* Bottom Info Bar */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={item.contributor.avatar} alt={item.contributor.name} className="h-6 w-6 rounded-full mr-2" />
            <span className="text-xs text-gray-700 truncate">
              {item.contributor.name}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>{formatDate(item.uploadedAt)}</span>
          </div>
        </div>
        {/* Engagement Metrics */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <button className="flex items-center text-gray-500 hover:text-red-500">
            <HeartIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">{item.likes}</span>
          </button>
          <button className="flex items-center text-gray-500 hover:text-gray-700">
            <MessageSquareIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">{item.comments}</span>
          </button>
          <button className="flex items-center text-gray-500 hover:text-blue-500">
            <ShareIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">{item.shares}</span>
          </button>
        </div>
      </div>
    </div>;
};