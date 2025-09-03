import React, { useState } from 'react';
import { CalendarIcon, UserIcon, CheckCircleIcon, UsersIcon, TrendingUpIcon, ClockIcon, PlusIcon, CheckIcon, MapPinIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
type CalendarEvent = {
  title: string;
  date: string;
  venue: string;
};
type CalendarCreator = {
  name: string;
  verified: boolean;
};
type CalendarProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  creator: CalendarCreator;
  followers: number;
  growthRate: number;
  eventCount: number;
  price: number;
  events: CalendarEvent[];
  featured?: boolean;
  trending?: boolean;
};
export const CalendarCard = ({
  calendar
}: {
  calendar: CalendarProps;
}) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/calendar/${calendar.id}`)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Calendar Banner Image */}
      <div className="relative h-40 overflow-hidden">
        <img src={calendar.image} alt={calendar.title} className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`} />
        {/* Price Badge */}
        {calendar.price > 0 ? <div className="absolute top-3 right-3 bg-white text-indigo-700 px-2 py-1 rounded-md text-sm font-medium shadow-sm">
            ${calendar.price.toFixed(2)}/mo
          </div> : <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium shadow-sm">
            FREE
          </div>}
        {/* Trending Badge */}
        {calendar.trending && <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium shadow-sm flex items-center">
            <TrendingUpIcon className="h-3 w-3 mr-1" />
            Trending
          </div>}
      </div>
      {/* Calendar Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
              {calendar.title}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{calendar.creator.name}</span>
              {calendar.creator.verified && <CheckCircleIcon className="h-4 w-4 ml-1 text-blue-500" />}
            </div>
          </div>
          <button onClick={handleFollow} className={`flex-shrink-0 p-2 rounded-full transition-colors ${isFollowing ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {isFollowing ? <CheckIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2 h-10">
          {calendar.description}
        </p>
        {/* Stats */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <UsersIcon className="h-4 w-4 mr-1" />
            <span>{formatNumber(calendar.followers)} followers</span>
            {calendar.growthRate > 0 && <span className="ml-1 text-green-600 flex items-center">
                <TrendingUpIcon className="h-3 w-3 mr-0.5" />
                {calendar.growthRate}%
              </span>}
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{calendar.eventCount} this week</span>
          </div>
        </div>
        {/* Divider */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-500 mb-2">
            UPCOMING EVENTS
          </h4>
          <div className="space-y-2">
            {calendar.events.slice(0, 3).map((event, index) => <div key={index} className="text-sm">
                <div className="font-medium text-gray-900 line-clamp-1">
                  {event.title}
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span className="mr-2">{event.date}</span>
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  <span>{event.venue}</span>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};