import React, { useEffect, useState } from 'react';
import { MapPinIcon, XIcon, SmileIcon, ImageIcon, UsersIcon, LockIcon, GlobeIcon, UserIcon, FacebookIcon, TwitterIcon, InstagramIcon, LinkIcon } from 'lucide-react';
import { useCheckIn, CheckInLocation } from '../../context/CheckInContext';
interface CheckInModalProps {
  venueId: string;
  venueName: string;
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  eventImage?: string;
  isOpen: boolean;
  onClose: () => void;
}
export const CheckInModal: React.FC<CheckInModalProps> = ({
  venueId,
  venueName,
  eventId,
  eventName,
  eventDate,
  eventTime,
  eventImage,
  isOpen,
  onClose
}) => {
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('friends');
  const [location, setLocation] = useState<CheckInLocation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [checkInId, setCheckInId] = useState<string | null>(null);
  const {
    getUserLocation,
    checkInToVenue,
    shareCheckIn
  } = useCheckIn();
  // Get user location when modal opens
  useEffect(() => {
    if (isOpen) {
      const getLocation = async () => {
        const userLocation = await getUserLocation();
        setLocation(userLocation);
      };
      getLocation();
    }
  }, [isOpen, getUserLocation]);
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNote('');
      setMood('');
      setPrivacy('friends');
      setLocation(null);
      setIsSubmitting(false);
      setShowShareOptions(false);
      setCheckInId(null);
    }
  }, [isOpen]);
  // Handle check-in submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const options: any = {
        note,
        mood,
        privacy
      };
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
      const result = await checkInToVenue(venueId, venueName, options);
      if (result) {
        // Store the check-in ID for sharing
        setCheckInId(`checkin-${Date.now()}`);
        setShowShareOptions(true);
      }
    } catch (error) {
      console.error('Check-in failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle sharing
  const handleShare = (platform: 'facebook' | 'twitter' | 'instagram' | 'copy') => {
    if (checkInId) {
      shareCheckIn(checkInId, platform);
    }
  };
  // Close the modal
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {showShareOptions ? 'Share Your Check-In' : 'Check In'}
          </h2>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {!showShareOptions ? <form onSubmit={handleSubmit}>
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center text-gray-800 font-medium">
                  <MapPinIcon className="h-5 w-5 text-indigo-600 mr-2" />
                  <span>{venueName}</span>
                </div>
                {eventName && <div className="mt-1 ml-7 text-sm text-gray-600">
                    {eventName}
                  </div>}
                {location ? <div className="mt-2 text-sm text-green-600 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Location detected
                  </div> : <div className="mt-2 text-sm text-amber-600 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                    Location not available
                  </div>}
              </div>
              <div className="mb-4">
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                  Add a note (optional)
                </label>
                <textarea id="note" value={note} onChange={e => setNote(e.target.value)} placeholder="What's happening here?" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" rows={3} />
              </div>
              <div className="mb-4">
                <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-1">
                  How are you feeling? (optional)
                </label>
                <div className="flex items-center">
                  <SmileIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <input id="mood" type="text" value={mood} onChange={e => setMood(e.target.value)} placeholder="Happy, Excited, Relaxed..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Who can see this check-in?
                </label>
                <div className="flex space-x-2">
                  <button type="button" onClick={() => setPrivacy('public')} className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-md ${privacy === 'public' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    <GlobeIcon className="h-4 w-4 mr-1.5" />
                    Public
                  </button>
                  <button type="button" onClick={() => setPrivacy('friends')} className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-md ${privacy === 'friends' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    <UsersIcon className="h-4 w-4 mr-1.5" />
                    Friends
                  </button>
                  <button type="button" onClick={() => setPrivacy('private')} className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-md ${privacy === 'private' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    <LockIcon className="h-4 w-4 mr-1.5" />
                    Only Me
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button type="button" onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isSubmitting}>
                {isSubmitting ? 'Checking In...' : 'Check In'}
              </button>
            </div>
          </form> : <div className="p-4">
            <div className="mb-6 text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPinIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                You're checked in!
              </h3>
              <p className="text-gray-600 mt-1">
                {eventName ? `You're now checked in at ${venueName} for ${eventName}.` : `You're now checked in at ${venueName}.`}
              </p>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Share your check-in
              </h4>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => handleShare('facebook')} className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50">
                  <FacebookIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-xs mt-1 text-gray-600">Facebook</span>
                </button>
                <button onClick={() => handleShare('twitter')} className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50">
                  <TwitterIcon className="h-6 w-6 text-blue-400" />
                  <span className="text-xs mt-1 text-gray-600">Twitter</span>
                </button>
                <button onClick={() => handleShare('instagram')} className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50">
                  <InstagramIcon className="h-6 w-6 text-pink-600" />
                  <span className="text-xs mt-1 text-gray-600">Instagram</span>
                </button>
                <button onClick={() => handleShare('copy')} className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50">
                  <LinkIcon className="h-6 w-6 text-gray-600" />
                  <span className="text-xs mt-1 text-gray-600">Copy Link</span>
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-center">
              <button onClick={handleClose} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Done
              </button>
            </div>
          </div>}
      </div>
    </div>;
};