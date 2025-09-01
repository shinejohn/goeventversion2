import React, { useState } from 'react';
import { HeartIcon, MessageSquareIcon, ShareIcon, PlusIcon, CheckIcon } from 'lucide-react';
type CalendarEngagementBarProps = {
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  isAddedToMyCalendars: boolean;
  onAddToMyCalendars: () => void;
};
export const CalendarEngagementBar = ({
  isLiked,
  likeCount,
  commentCount,
  isAddedToMyCalendars,
  onAddToMyCalendars
}: CalendarEngagementBarProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button onClick={handleLike} className={`flex items-center space-x-1 ${liked ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <HeartIcon className="h-5 w-5" fill={liked ? 'currentColor' : 'none'} />
            <span>{likes}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700" onClick={() => document.getElementById('discussion-tab')?.click()}>
            <MessageSquareIcon className="h-5 w-5" />
            <span>{commentCount}</span>
          </button>
          <div className="relative">
            <button onClick={handleShare} className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
              <ShareIcon className="h-5 w-5" />
              <span>Share</span>
            </button>
            {showShareOptions && <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Copy Link
                  </button>
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Share on Twitter
                  </button>
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Share on Facebook
                  </button>
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Embed Calendar
                  </button>
                </div>
              </div>}
          </div>
        </div>
        <button onClick={onAddToMyCalendars} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${isAddedToMyCalendars ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'}`}>
          {isAddedToMyCalendars ? <>
              <CheckIcon className="h-4 w-4 mr-1.5" />
              Added to My Calendars
            </> : <>
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Add to My Calendars
            </>}
        </button>
      </div>
    </div>;
};