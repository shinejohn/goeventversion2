import React, { useEffect, useState, createContext, useContext, Component } from 'react';
import { useNavigationContext } from './NavigationContext';
// Types for our check-in system
export type CheckInLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  venueName?: string;
  address?: string;
  timestamp: number;
};
export type CheckInEvent = {
  id: string;
  name: string;
  venueId: string;
  venueName: string;
  date: string;
  time: string;
  imageUrl?: string;
  ticketId?: string;
  calendarEventId?: string;
};
export type CheckIn = {
  id: string;
  userId: string;
  eventId?: string;
  venueId: string;
  venueName: string;
  timestamp: number;
  location?: CheckInLocation;
  note?: string;
  mood?: string;
  privacy: 'public' | 'friends' | 'private';
  photos: string[];
  likes: number;
  comments: number;
  eventDetails?: CheckInEvent;
  isActive: boolean; // Whether the user is still at the venue/event
};
export type PlannedEvent = {
  id: string;
  eventId: string;
  eventName: string;
  venueId: string;
  venueName: string;
  date: string;
  time: string;
  source: 'ticket' | 'calendar' | 'manual';
  sourceId?: string;
  imageUrl?: string;
  shared: boolean;
};
type CheckInContextType = {
  checkIns: CheckIn[];
  activeCheckIn: CheckIn | null;
  plannedEvents: PlannedEvent[];
  isCheckingIn: boolean;
  checkInToVenue: (venueId: string, venueName: string, options?: {
    note?: string;
    mood?: string;
    privacy?: 'public' | 'friends' | 'private';
    eventId?: string;
    eventDetails?: Omit<CheckInEvent, 'venueId' | 'venueName'>;
  }) => Promise<boolean>;
  checkInToEvent: (eventId: string, eventDetails: Omit<CheckInEvent, 'id'>) => Promise<boolean>;
  endCheckIn: (checkInId: string) => void;
  addPlannedEvent: (event: Omit<PlannedEvent, 'id' | 'shared'>) => void;
  removePlannedEvent: (eventId: string) => void;
  togglePlannedEventSharing: (eventId: string) => void;
  getUserLocation: () => Promise<CheckInLocation | null>;
  shareCheckIn: (checkInId: string, platform: 'facebook' | 'twitter' | 'instagram' | 'copy') => void;
  getRecentCheckIns: (userId?: string, limit?: number) => CheckIn[];
  getNearbyCheckIns: (latitude: number, longitude: number, radiusKm: number) => CheckIn[];
  getFriendsCheckIns: () => CheckIn[];
};
// Mock user ID for demo purposes
const MOCK_USER_ID = 'user-1';
// Create the context
const CheckInContext = createContext<CheckInContextType | undefined>(undefined);
// Provider component
export const CheckInProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<CheckIn | null>(null);
  const [plannedEvents, setPlannedEvents] = useState<PlannedEvent[]>([]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const {
    navigateTo
  } = useNavigationContext();
  // Load check-ins from storage on mount
  useEffect(() => {
    // In a real app, this would fetch from an API
    const savedCheckIns = localStorage.getItem('userCheckIns');
    if (savedCheckIns) {
      try {
        const parsed = JSON.parse(savedCheckIns);
        setCheckIns(parsed);
        // Find any active check-in
        const active = parsed.find((c: CheckIn) => c.isActive);
        if (active) {
          setActiveCheckIn(active);
        }
      } catch (e) {
        console.error('Failed to parse saved check-ins', e);
      }
    }
    // Load planned events
    const savedPlannedEvents = localStorage.getItem('userPlannedEvents');
    if (savedPlannedEvents) {
      try {
        setPlannedEvents(JSON.parse(savedPlannedEvents));
      } catch (e) {
        console.error('Failed to parse saved planned events', e);
      }
    }
  }, []);
  // Save check-ins to storage when they change
  useEffect(() => {
    if (checkIns.length > 0) {
      localStorage.setItem('userCheckIns', JSON.stringify(checkIns));
    }
  }, [checkIns]);
  // Save planned events to storage when they change
  useEffect(() => {
    if (plannedEvents.length > 0) {
      localStorage.setItem('userPlannedEvents', JSON.stringify(plannedEvents));
    }
  }, [plannedEvents]);
  // Get user's current location
  const getUserLocation = async (): Promise<CheckInLocation | null> => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return null;
    }
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };
    } catch (error) {
      console.error('Error getting location', error);
      return null;
    }
  };
  // Check in to a venue
  const checkInToVenue = async (venueId: string, venueName: string, options: {
    note?: string;
    mood?: string;
    privacy?: 'public' | 'friends' | 'private';
    eventId?: string;
    eventDetails?: Omit<CheckInEvent, 'venueId' | 'venueName'>;
  } = {}): Promise<boolean> => {
    setIsCheckingIn(true);
    try {
      // Get location if available
      const location = await getUserLocation();
      // Create the check-in
      const newCheckIn: CheckIn = {
        id: `checkin-${Date.now()}`,
        userId: MOCK_USER_ID,
        venueId,
        venueName,
        timestamp: Date.now(),
        location,
        note: options.note,
        mood: options.mood,
        privacy: options.privacy || 'friends',
        photos: [],
        likes: 0,
        comments: 0,
        isActive: true
      };
      // Add event details if provided
      if (options.eventId && options.eventDetails) {
        newCheckIn.eventId = options.eventId;
        newCheckIn.eventDetails = {
          id: options.eventId,
          venueId,
          venueName,
          ...options.eventDetails
        };
      }
      // Add to check-ins
      setCheckIns(prev => [newCheckIn, ...prev]);
      setActiveCheckIn(newCheckIn);
      return true;
    } catch (error) {
      console.error('Check-in failed', error);
      return false;
    } finally {
      setIsCheckingIn(false);
    }
  };
  // Check in to an event
  const checkInToEvent = async (eventId: string, eventDetails: Omit<CheckInEvent, 'id'>): Promise<boolean> => {
    return checkInToVenue(eventDetails.venueId, eventDetails.venueName, {
      eventId,
      eventDetails: {
        name: eventDetails.name,
        date: eventDetails.date,
        time: eventDetails.time,
        imageUrl: eventDetails.imageUrl,
        ticketId: eventDetails.ticketId,
        calendarEventId: eventDetails.calendarEventId
      }
    });
  };
  // End an active check-in
  const endCheckIn = (checkInId: string) => {
    setCheckIns(prev => prev.map(c => c.id === checkInId ? {
      ...c,
      isActive: false
    } : c));
    if (activeCheckIn?.id === checkInId) {
      setActiveCheckIn(null);
    }
  };
  // Add a planned event
  const addPlannedEvent = (event: Omit<PlannedEvent, 'id' | 'shared'>) => {
    const newEvent: PlannedEvent = {
      ...event,
      id: `planned-${Date.now()}`,
      shared: false
    };
    setPlannedEvents(prev => [newEvent, ...prev]);
  };
  // Remove a planned event
  const removePlannedEvent = (eventId: string) => {
    setPlannedEvents(prev => prev.filter(e => e.eventId !== eventId));
  };
  // Toggle sharing status of a planned event
  const togglePlannedEventSharing = (eventId: string) => {
    setPlannedEvents(prev => prev.map(e => e.eventId === eventId ? {
      ...e,
      shared: !e.shared
    } : e));
  };
  // Share a check-in on social media or copy link
  const shareCheckIn = (checkInId: string, platform: 'facebook' | 'twitter' | 'instagram' | 'copy') => {
    const checkIn = checkIns.find(c => c.id === checkInId);
    if (!checkIn) return;
    const shareText = `I'm at ${checkIn.venueName}${checkIn.eventDetails ? ` for ${checkIn.eventDetails.name}` : ''}!`;
    const shareUrl = `https://whensthefun.com/checkin/${checkInId}`;
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL
        alert('To share on Instagram, please take a screenshot and share it from the Instagram app');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert('Check-in link copied to clipboard!');
        break;
    }
  };
  // Get recent check-ins for a user
  const getRecentCheckIns = (userId = MOCK_USER_ID, limit = 10): CheckIn[] => {
    return checkIns.filter(c => c.userId === userId).sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  };
  // Get nearby check-ins based on location
  const getNearbyCheckIns = (latitude: number, longitude: number, radiusKm = 5): CheckIn[] => {
    // Helper function to calculate distance between coordinates
    const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    const deg2rad = (deg: number) => {
      return deg * (Math.PI / 180);
    };
    return checkIns.filter(c => {
      if (!c.location) return false;
      const distance = getDistanceFromLatLonInKm(latitude, longitude, c.location.latitude, c.location.longitude);
      return distance <= radiusKm;
    }).sort((a, b) => b.timestamp - a.timestamp);
  };
  // Get check-ins from friends
  const getFriendsCheckIns = (): CheckIn[] => {
    // In a real app, this would filter by friend relationships
    // For now, return all public and friends check-ins from other users
    return checkIns.filter(c => c.userId !== MOCK_USER_ID && (c.privacy === 'public' || c.privacy === 'friends')).sort((a, b) => b.timestamp - a.timestamp);
  };
  const contextValue: CheckInContextType = {
    checkIns,
    activeCheckIn,
    plannedEvents,
    isCheckingIn,
    checkInToVenue,
    checkInToEvent,
    endCheckIn,
    addPlannedEvent,
    removePlannedEvent,
    togglePlannedEventSharing,
    getUserLocation,
    shareCheckIn,
    getRecentCheckIns,
    getNearbyCheckIns,
    getFriendsCheckIns
  };
  return <CheckInContext.Provider value={contextValue}>
      {children}
    </CheckInContext.Provider>;
};
// Hook for using the check-in context
export const useCheckIn = () => {
  const context = useContext(CheckInContext);
  if (context === undefined) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return context;
};