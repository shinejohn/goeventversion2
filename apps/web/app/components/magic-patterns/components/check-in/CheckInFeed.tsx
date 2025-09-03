import React, { useEffect, useState } from 'react';
import { MapPinIcon, ClockIcon, HeartIcon, MessageCircleIcon, ShareIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { useCheckIn, CheckIn } from '../../context/CheckInContext';
import { useNavigate } from 'react-router';
interface CheckInFeedProps {
  type?: 'user' | 'friends' | 'nearby';
  userId?: string;
  limit?: number;
  className?: string;
  showActions?: boolean;
}
export const CheckInFeed: React.FC<CheckInFeedProps> = ({
  type = 'user',
  userId,
  limit = 10,
  className = '',
  showActions = true
}) => {
  const {
    getRecentCheckIns,
    getFriendsCheckIns,
    getNearbyCheckIns,
    getUserLocation
  } = useCheckIn();
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCheckIns = async () => {
      setLoading(true);
      try {
        let result: CheckIn[] = [];
        switch (type) {
          case 'user':
            result = getRecentCheckIns(userId, limit);
            break;
          case 'friends':
            result = getFriendsCheckIns().slice(0, limit);
            break;
          case 'nearby':
            const location = await getUserLocation();
            if (location) {
              result = getNearbyCheckIns(location.latitude, location.longitude, 5).slice(0, limit);
            }
            break;
        }
        setCheckIns(result);
      } catch (error) {
        console.error('Error fetching check-ins', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCheckIns();
  }, [type, userId, limit, getRecentCheckIns, getFriendsCheckIns, getNearbyCheckIns, getUserLocation]);
  const formatTimestamp = (timestamp: number) => {
    const now = new Date();
    const checkInDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - checkInDate.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return checkInDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  const handleVenueClick = (venueId: string) => {
    navigate(`/venues/${venueId}/${venueId.replace('venue-', '')}`);
  };
  const handleEventClick = (eventId: string, venueId: string) => {
    navigate(`/venues/${venueId}/events/${eventId}`);
  };
  if (loading) {
    return <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>)}
        </div>
      </div>;
  }
  if (checkIns.length === 0) {
    return <div className={`bg-white rounded-lg shadow-sm p-6 text-center ${className}`}>
        <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No check-ins yet
        </h3>
        <p className="text-gray-500">
          {type === 'user' ? "You haven't checked in anywhere yet." : type === 'friends' ? 'None of your friends have checked in recently.' : 'No one has checked in nearby recently.'}
        </p>
      </div>;
  }
  return <div className={`bg-white rounded-lg shadow-sm divide-y divide-gray-200 ${className}`}>
      {checkIns.map(checkIn => <div key={checkIn.id} className="p-4">
          <div className="flex">
            <div className="flex-shrink-0 mr-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <UserIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {type !== 'user' ? 'User Name' : 'You'} checked in at{' '}
                    <button className="font-semibold text-indigo-600 hover:text-indigo-800" onClick={() => handleVenueClick(checkIn.venueId)}>
                      {checkIn.venueName}
                    </button>
                  </p>
                  {checkIn.eventDetails && <p className="mt-0.5 text-sm text-gray-500">
                      For{' '}
                      <button className="text-indigo-600 hover:text-indigo-800" onClick={() => handleEventClick(checkIn.eventDetails!.id, checkIn.venueId)}>
                        {checkIn.eventDetails.name}
                      </button>
                    </p>}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <ClockIcon className="h-3.5 w-3.5 mr-1" />
                  {formatTimestamp(checkIn.timestamp)}
                </div>
              </div>
              {checkIn.note && <p className="mt-2 text-sm text-gray-700">"{checkIn.note}"</p>}
              {checkIn.mood && <p className="mt-1 text-sm text-gray-600">
                  Feeling {checkIn.mood}
                </p>}
              {checkIn.isActive && <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                  Currently here
                </div>}
              {showActions && <div className="mt-3 flex space-x-4">
                  <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
                    <HeartIcon className="h-3.5 w-3.5 mr-1" />
                    {checkIn.likes || 0} Likes
                  </button>
                  <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
                    <MessageCircleIcon className="h-3.5 w-3.5 mr-1" />
                    {checkIn.comments || 0} Comments
                  </button>
                  <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
                    <ShareIcon className="h-3.5 w-3.5 mr-1" />
                    Share
                  </button>
                </div>}
            </div>
          </div>
        </div>)}
    </div>;
};