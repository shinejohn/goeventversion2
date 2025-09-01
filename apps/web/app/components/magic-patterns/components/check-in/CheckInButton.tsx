import React from 'react';
import { MapPinIcon } from 'lucide-react';
import { useCheckIn } from '../../context/CheckInContext';
interface CheckInButtonProps {
  venueId: string;
  venueName: string;
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  eventImage?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onCheckInComplete?: () => void;
}
export const CheckInButton: React.FC<CheckInButtonProps> = ({
  venueId,
  venueName,
  eventId,
  eventName,
  eventDate,
  eventTime,
  eventImage,
  variant = 'primary',
  size = 'md',
  className = '',
  onCheckInComplete
}) => {
  const {
    activeCheckIn,
    checkInToVenue,
    isCheckingIn
  } = useCheckIn();
  // Check if user is already checked in to this venue
  const isCheckedIn = activeCheckIn?.venueId === venueId;
  const handleCheckIn = async () => {
    if (isCheckedIn || isCheckingIn) return;
    const options: any = {};
    // If event details are provided, include them
    if (eventId && eventName) {
      options.eventId = eventId;
      options.eventDetails = {
        name: eventName,
        date: eventDate || new Date().toISOString().split('T')[0],
        time: eventTime || `${new Date().getHours()}:${new Date().getMinutes()}`
      };
      if (eventImage) {
        options.eventDetails.imageUrl = eventImage;
      }
    }
    const success = await checkInToVenue(venueId, venueName, options);
    if (success && onCheckInComplete) {
      onCheckInComplete();
    }
  };
  // Determine button style based on variant
  let buttonStyle = '';
  switch (variant) {
    case 'primary':
      buttonStyle = 'bg-indigo-600 hover:bg-indigo-700 text-white';
      break;
    case 'secondary':
      buttonStyle = 'bg-pink-600 hover:bg-pink-700 text-white';
      break;
    case 'outline':
      buttonStyle = 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50';
      break;
    case 'icon':
      buttonStyle = 'bg-white hover:bg-gray-50 text-indigo-600 border border-gray-200 shadow-sm';
      break;
  }
  // Determine button size
  let buttonSize = '';
  switch (size) {
    case 'sm':
      buttonSize = variant === 'icon' ? 'p-1.5 rounded-full' : 'px-3 py-1.5 text-xs rounded';
      break;
    case 'md':
      buttonSize = variant === 'icon' ? 'p-2 rounded-full' : 'px-4 py-2 text-sm rounded-md';
      break;
    case 'lg':
      buttonSize = variant === 'icon' ? 'p-3 rounded-full' : 'px-5 py-2.5 text-base rounded-md';
      break;
  }
  return <button onClick={handleCheckIn} disabled={isCheckedIn || isCheckingIn} className={`font-medium transition-colors ${buttonStyle} ${buttonSize} ${className} ${isCheckedIn ? 'bg-green-600 hover:bg-green-700 text-white' : ''} ${isCheckingIn ? 'opacity-70 cursor-wait' : ''}`}>
      <div className="flex items-center justify-center">
        <MapPinIcon className={`${variant === 'icon' ? '' : 'mr-1.5'} ${size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
        {variant !== 'icon' && <span>
            {isCheckedIn ? 'Checked In' : isCheckingIn ? 'Checking In...' : 'Check In'}
          </span>}
      </div>
    </button>;
};