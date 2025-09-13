import { z } from 'zod';
import type { Tables } from '@kit/supabase/database';

/**
 * Type-safe data transformers for Magic Patterns components
 * Converts Supabase data to Magic Patterns component interfaces
 */

// Venue data transformer
export const VenueDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  capacity: z.number(),
  images: z.array(z.string()),
  amenities: z.record(z.any()),
  average_rating: z.number().nullable(),
  total_reviews: z.number().nullable(),
  slug: z.string().nullable(),
  community_id: z.string().nullable(),
  account_id: z.string(),
  venue_type: z.string(),
  price_per_hour: z.number().nullable(),
  distance: z.number().nullable(),
  listed_date: z.string(),
  last_booked_days_ago: z.number().nullable(),
  unavailable_dates: z.array(z.string()),
  image_url: z.string().nullable(),
  city: z.string(),
  verified: z.boolean(),
});

export type VenueData = z.infer<typeof VenueDataSchema>;

export function transformVenueData(venue: Tables<'venues'>): VenueData {
  // Extract images from gallery_images JSON
  let images: string[] = [];
  if (venue.gallery_images && typeof venue.gallery_images === 'object') {
    if (Array.isArray(venue.gallery_images)) {
      images = venue.gallery_images.filter(img => typeof img === 'string');
    }
  }
  
  // Handle amenities as array
  let amenities: string[] = [];
  if (Array.isArray(venue.amenities)) {
    amenities = venue.amenities.filter(item => typeof item === 'string');
  }
  
  // Extract blackout dates if available
  let unavailableDates: string[] = [];
  if (venue.blackout_dates && typeof venue.blackout_dates === 'object') {
    if (Array.isArray(venue.blackout_dates)) {
      unavailableDates = venue.blackout_dates
        .map(date => typeof date === 'string' ? date : null)
        .filter(Boolean) as string[];
    }
  }

  return {
    id: venue.id,
    name: venue.name,
    description: venue.description || '',
    address: venue.address,
    capacity: venue.max_capacity,
    images,
    amenities,
    average_rating: null, // Would need to join with reviews
    total_reviews: null, // Would need to join with reviews
    slug: venue.slug || null,
    community_id: null, // Not in the venues table
    account_id: venue.account_id,
    venue_type: venue.venue_type || 'indoor',
    price_per_hour: venue.pricePerHour || null,
    distance: null, // Calculated separately if needed
    listed_date: venue.created_at || new Date().toISOString(),
    last_booked_days_ago: null, // Calculated separately if needed
    unavailable_dates: unavailableDates,
    image_url: venue.image_url || images[0] || null,
    city: venue.city,
    verified: venue.is_verified || false,
  };
}

// Event data transformer
export const EventDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.object({
    venueId: z.string().nullable(),
    venue: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string().nullable(),
    postalCode: z.string().nullable(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).nullable(),
  }),
  organizer: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().nullable(),
  }),
  category: z.string(),
  tags: z.array(z.string()),
  image: z.string().nullable(),
  gallery: z.array(z.string()),
  price: z.number(),
  capacity: z.number(),
  currentBookings: z.number(),
  status: z.enum(['draft', 'pending', 'published', 'cancelled', 'completed']),
  featured: z.boolean(),
});

export type EventData = z.infer<typeof EventDataSchema>;

export function transformEventData(event: Tables<'events'> & { 
  venues?: Partial<Tables<'venues'>> | null 
}): EventData {
  // Extract gallery images safely
  let gallery: string[] = [];
  if (event.gallery_images && typeof event.gallery_images === 'object') {
    if (Array.isArray(event.gallery_images)) {
      gallery = event.gallery_images.filter(img => typeof img === 'string');
    }
  }
  
  // Extract tags safely
  let tags: string[] = [];
  if (event.tags && Array.isArray(event.tags)) {
    tags = event.tags.filter(tag => typeof tag === 'string');
  }

  return {
    id: event.id,
    name: event.title,
    description: event.description || '',
    startDate: event.start_datetime || new Date().toISOString(),
    endDate: event.end_datetime || event.start_datetime || new Date().toISOString(),
    location: {
      venueId: event.venue_id,
      venue: event.venues?.name || event.location_name || 'TBA',
      address: event.venues?.address || event.address || '',
      city: event.venues?.city || event.city || '',
      state: event.state || null,
      postalCode: event.postal_code || null,
      coordinates: null, // latitude/longitude fields don't exist yet
    },
    organizer: {
      id: event.account_id,
      name: 'Event Organizer', // Would need to join with accounts
      avatar: null,
    },
    category: event.category || 'other',
    tags,
    image: event.image_url || null,
    gallery,
    price: event.ticket_price || event.price_min || 0,
    capacity: event.venues?.max_capacity || event.max_capacity || 0,
    currentBookings: event.current_attendees || 0,
    status: event.status || 'draft',
    featured: event.is_featured || false,
  };
}


// Performer data transformer
export const PerformerDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.string(),
  genres: z.array(z.string()),
  instruments: z.array(z.string()),
  profileImage: z.string().nullable(),
  coverImage: z.string().nullable(),
  rating: z.number().nullable(),
  reviewCount: z.number(),
  hourlyRate: z.number().nullable(),
  location: z.object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
  }),
  availability: z.array(z.object({
    date: z.string(),
    available: z.boolean(),
  })),
  socialMedia: z.object({
    instagram: z.string().nullable(),
    facebook: z.string().nullable(),
    twitter: z.string().nullable(),
    youtube: z.string().nullable(),
  }).nullable(),
  verified: z.boolean(),
});

export type PerformerData = z.infer<typeof PerformerDataSchema>;

export function transformPerformerData(performer: Tables<'performers'>): PerformerData {
  // Extract location from the performer record safely
  let city = performer.home_city || '';
  let state = '';
  let country = 'USA';
  
  // Parse location if stored as "City, State" format
  if (performer.location && typeof performer.location === 'string') {
    const parts = performer.location.split(',').map(s => s.trim());
    if (parts.length >= 1) city = parts[0] || '';
    if (parts.length >= 2) state = parts[1] || '';
  }
  
  // Extract genres safely
  let genres: string[] = [];
  if (performer.genres && Array.isArray(performer.genres)) {
    genres = performer.genres.filter(g => typeof g === 'string');
  }
  
  // Extract social links safely
  let socialMedia = null;
  if (performer.social_links && typeof performer.social_links === 'object' && !Array.isArray(performer.social_links)) {
    socialMedia = {
      instagram: performer.social_links.instagram || null,
      facebook: performer.social_links.facebook || null,
      twitter: performer.social_links.twitter || null,
      youtube: performer.social_links.youtube || null,
    };
  }
  
  return {
    id: performer.id,
    name: performer.name || performer.stage_name || 'Unknown Performer',
    bio: performer.bio || '',
    genres: genres,
    instruments: [], // Field doesn't exist in DB
    profileImage: performer.image || null, // DB has 'image' not 'profile_image_url'
    coverImage: null, // Not in schema
    rating: performer.rating ? Number(performer.rating) : null,
    reviewCount: performer.total_reviews || 0,
    hourlyRate: performer.base_price ? Number(performer.base_price) : null,
    location: {
      city: city || 'Unknown City',
      state: state || '',
      country: country,
    },
    availability: [], // Would need to fetch from separate availability table
    socialMedia: socialMedia,
    verified: performer.verified || false,
  };
}

// Booking data transformer
export const BookingDataSchema = z.object({
  id: z.string(),
  eventName: z.string(),
  eventDate: z.string(),
  eventTime: z.string(),
  venue: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
  }),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  totalAmount: z.number(),
  createdAt: z.string(),
  notes: z.string().nullable(),
});

export type BookingData = z.infer<typeof BookingDataSchema>;

export function transformBookingData(booking: Tables<'bookings'>): BookingData {
  return {
    id: booking.id,
    eventName: booking.event_name || 'Unnamed Event',
    eventDate: booking.event_date || new Date().toISOString(),
    eventTime: booking.event_time || '00:00',
    venue: {
      id: booking.venue_id || '',
      name: booking.venue_name || 'Unknown Venue',
      address: booking.venue_address || '',
    },
    status: booking.status || 'pending',
    totalAmount: booking.total_amount || 0,
    createdAt: booking.created_at || new Date().toISOString(),
    notes: booking.notes || null,
  };
}

// Batch transformers for lists with defensive null handling
export const transformVenuesList = (venues: Tables<'venues'>[]): VenueData[] => {
  if (!venues || !Array.isArray(venues)) return [];
  return venues.filter(v => v && v.id).map(transformVenueData);
};

export const transformEventsList = (events: Array<Tables<'events'> & { 
  venues?: Partial<Tables<'venues'>> | null 
}>): EventData[] => {
  if (!events || !Array.isArray(events)) return [];
  return events.filter(e => e && e.id).map(transformEventData);
};

export const transformPerformersList = (performers: Tables<'performers'>[]): PerformerData[] => {
  if (!performers || !Array.isArray(performers)) return [];
  return performers.filter(p => p && p.id).map(transformPerformerData);
};

export const transformBookingsList = (bookings: Tables<'bookings'>[]): BookingData[] => {
  if (!bookings || !Array.isArray(bookings)) return [];
  return bookings.filter(b => b && b.id).map(transformBookingData);
};

// Community data transformer
export const transformCommunityData = (community: Tables<'community_hubs'>): {
  id: string;
  name: string;
  description: string;
  slug: string;
  category: string;
  location: string;
  memberCount: number;
  eventCount: number;
  isActive: boolean;
  image?: string;
  website?: string;
  socialMedia?: string;
  tags?: string[];
  createdAt: string;
} => {
  return {
    id: community.id,
    name: community.name || 'Unnamed Community',
    description: community.description || 'No description available',
    slug: community.slug || community.id,
    category: community.category || 'General',
    location: community.location || 'Location not specified',
    memberCount: community.member_count || 0,
    eventCount: community.event_count || 0,
    isActive: community.is_active ?? true,
    image: community.image_url || undefined,
    website: community.website || undefined,
    socialMedia: community.social_media || undefined,
    tags: community.tags || [],
    createdAt: community.created_at || new Date().toISOString()
  };
};