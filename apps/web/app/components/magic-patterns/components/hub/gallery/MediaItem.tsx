import React, { useState } from 'react';
import { PlayIcon, MusicIcon, HeartIcon, MessageSquareIcon, ShareIcon } from 'lucide-react';
type MediaItemProps = {
  media: any;
  onClick: () => void;
  onLike: () => void;
};
export const MediaItem = ({
  media,
  onClick,
  onLike
}: MediaItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  // Format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // Handle like click without triggering the main onClick
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike();
  };
  // Handle share click
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would open a share dialog
    alert(`Share ${media.title}`);
  };
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer group" onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Media Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={media.thumbnail} alt={media.title} className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`} />
        {/* Overlay for videos and audio */}
        {media.type !== 'image' && <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            {media.type === 'video' ? <PlayIcon className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" /> : <MusicIcon className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />}
          </div>}
        {/* Duration badge for video/audio */}
        {media.duration && <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {media.duration}
          </div>}
        {/* Media type badge */}
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded capitalize">
          {media.type}
        </div>
      </div>
      {/* Media Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {media.title}
        </h3>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center">
            <img src={media.contributor.avatar} alt={media.contributor.name} className="h-5 w-5 rounded-full mr-1" />
            <span className="truncate max-w-[100px]">
              {media.contributor.name}
            </span>
          </div>
          <span>{formatDate(media.uploadedAt)}</span>
        </div>
      </div>
      {/* Actions */}
      <div className="px-3 py-2 border-t border-gray-100 flex justify-between items-center">
        <div className="flex space-x-3">
          <button className={`flex items-center ${media.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`} onClick={handleLikeClick}>
            <HeartIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">{media.likes}</span>
          </button>
          <button className="flex items-center text-gray-500">
            <MessageSquareIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">{media.comments}</span>
          </button>
        </div>
        <button className="text-gray-500 hover:text-indigo-500" onClick={handleShareClick}>
          <ShareIcon className="h-4 w-4" />
        </button>
      </div>
    </div>;
};