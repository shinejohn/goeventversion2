import React from 'react';
import type { Route } from './+types/new';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';
import { z } from 'zod';

// Magic Patterns imports
import { CreateEventPage } from '~/components/magic-patterns/pages/CreateEventPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Create Event Route - Where the fun begins!
 * Create new events with venues, performers, and all the details
 * 
 * Let's make something amazing happen! 🎉✨
 */

// Form data schema for event creation
const CreateEventSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10).max(5000),
  category: z.enum([
    'music', 'sports', 'business', 'entertainment', 'arts',
    'food_drink', 'community', 'education', 'health', 'technology', 'other'
  ]),
  status: z.enum(['draft', 'pending', 'published']).default('draft'),
  
  // Event timing
  startDate: z.string(), // ISO date string
  endDate: z.string(), // ISO date string
  timezone: z.string().default('UTC'),
  
  // Location
  venueId: z.string().uuid().nullable(),
  locationName: z.string().max(255).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  
  // Media
  imageUrl: z.string().url().nullable(),
  galleryImages: z.array(z.string().url()).default([]),
  
  // Pricing & Capacity
  basePrice: z.coerce.number().min(0).default(0),
  maxCapacity: z.coerce.number().min(1).nullable(),
  
  // Event details
  requirements: z.string().max(2000).optional(),
  amenities: z.record(z.any()).default({}),
  tags: z.array(z.string()).default([]),
  
  // Settings
  isPublic: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    logger.info({ loader: 'events/new' }, '🎨 Loading event creation form');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Parallel fetch venues and performers for selection
    const [venuesQuery, performersQuery, categoriesQuery] = await Promise.all([
      // Get available venues
      client
        .from('venues')
        .select('id, name, address, city, max_capacity')
        .eq('is_active', true)
        .order('name', { ascending: true })
        .limit(100),
      
      // Get available performers
      client
        .from('performers')
        .select('id, stage_name, category, genres')
        .eq('is_available', true)
        .order('stage_name', { ascending: true })
        .limit(100),
      
      // Get popular event categories and tags
      client
        .from('events')
        .select('category, tags')
        .eq('account_id', user.id)
        .limit(50),
    ]);
    
    const { data: venues } = venuesQuery;
    const { data: performers } = performersQuery;
    const { data: userEvents } = categoriesQuery;
    
    // Extract popular tags from user's previous events
    const popularTags = new Set<string>();
    userEvents?.forEach(event => {
      if (Array.isArray(event.tags)) {
        event.tags.forEach(tag => popularTags.add(tag));
      }
    });
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'events/new',
      duration,
      venueCount: venues?.length || 0,
      performerCount: performers?.length || 0,
    }, '🎨 Event creation form loaded');
    
    return {
      venues: venues || [],
      performers: performers || [],
      popularTags: Array.from(popularTags).slice(0, 20),
      user: {
        id: user.id,
        email: user.email,
      },
      defaultValues: {
        status: 'draft' as const,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isPublic: true,
        isFeatured: false,
      },
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'events/new',
      url: request.url 
    }, 'Error loading event creation form');
    
    // Redirect to events page on error
    throw redirect('/events');
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  const logger = await getLogger();
  
  try {
    logger.info({ action: 'events/new' }, '🚀 Creating new event');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Parse form data
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    // Handle arrays and objects from form data
    if (typeof data.galleryImages === 'string') {
      data.galleryImages = JSON.parse(data.galleryImages);
    }
    if (typeof data.amenities === 'string') {
      data.amenities = JSON.parse(data.amenities);
    }
    if (typeof data.tags === 'string') {
      data.tags = JSON.parse(data.tags);
    }
    
    // Validate form data
    const eventData = CreateEventSchema.parse(data);
    
    // Create the event
    const { data: newEvent, error } = await client
      .from('events')
      .insert({
        account_id: user.id,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        status: eventData.status,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        timezone: eventData.timezone,
        venue_id: eventData.venueId,
        location_name: eventData.locationName,
        address: eventData.address,
        city: eventData.city,
        state: eventData.state,
        country: eventData.country,
        postal_code: eventData.postalCode,
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        image_url: eventData.imageUrl,
        gallery_images: eventData.galleryImages,
        base_price: eventData.basePrice,
        max_capacity: eventData.maxCapacity,
        requirements: eventData.requirements,
        amenities: eventData.amenities,
        tags: eventData.tags,
        is_public: eventData.isPublic,
        is_featured: eventData.isFeatured,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) {
      logger.error({ error, action: 'events/new' }, 'Failed to create event');
      throw error;
    }
    
    logger.info({ 
      action: 'events/new',
      eventId: newEvent.id,
      status: newEvent.status 
    }, '🎉 Event created successfully!');
    
    // Redirect to the new event's detail page
    return redirect(`/events/${newEvent.id}`);
    
  } catch (error) {
    logger.error({ 
      error, 
      action: 'events/new' 
    }, 'Error creating event');
    
    // Return error response
    return {
      error: error instanceof Error ? error.message : 'Failed to create event',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: CreateEventPage,
  transformData: (loaderData) => ({
    venues: loaderData.venues,
    performers: loaderData.performers,
    popularTags: loaderData.popularTags,
    user: loaderData.user,
    defaultValues: loaderData.defaultValues,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'Create New Event | When The Fun' },
    { 
      name: 'description', 
      content: 'Create amazing events with venues, performers, and all the details. Start planning your next unforgettable experience.' 
    },
    { property: 'og:title', content: 'Create Event - When The Fun' },
    { property: 'og:description', content: 'Plan your next amazing event' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers 🚀
export const headers = () => {
  return {
    'Cache-Control': 'private, max-age=0', // No caching for forms
  };
};