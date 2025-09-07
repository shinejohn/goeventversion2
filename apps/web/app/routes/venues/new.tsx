import React from 'react';
import type { Route } from './+types/new';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';
import { z } from 'zod';

// Magic Patterns imports
import { CreateVenuePage } from '~/components/magic-patterns/pages/CreateVenuePage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Create Venue Route - Build the perfect stage!
 * Register new venues for hosting amazing events
 * 
 * Let's create spaces where memories are made! 🏛️✨
 */

// Form data schema for venue creation
const CreateVenueSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(10).max(5000),
  venueType: z.enum(['indoor', 'outdoor', 'hybrid', 'virtual', 'mobile']).default('indoor'),
  
  // Location
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  state: z.string().max(100).optional(),
  country: z.string().min(2).max(100).default('USA'),
  postalCode: z.string().max(20).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  
  // Capacity & Features
  maxCapacity: z.coerce.number().min(1).max(100000),
  amenities: z.record(z.any()).default({}),
  equipment: z.record(z.any()).default({}),
  accessibilityFeatures: z.array(z.string()).default([]),
  
  // Media
  imageUrl: z.string().url().nullable(),
  galleryImages: z.array(z.string().url()).default([]),
  virtualTourUrl: z.string().url().nullable(),
  
  // Pricing
  baseHourlyRate: z.coerce.number().min(0).default(0),
  setupFee: z.coerce.number().min(0).default(0),
  cleaningFee: z.coerce.number().min(0).default(0),
  
  // Availability
  operatingHours: z.record(z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean().optional(),
  })).default({}),
  blackoutDates: z.array(z.string()).default([]),
  
  // Business info
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(20).optional(),
  websiteUrl: z.string().url().nullable(),
  
  // Settings
  isActive: z.boolean().default(true),
});

// Amenities options
const AMENITY_OPTIONS = [
  { value: 'parking', label: 'Parking Available', icon: '🚗' },
  { value: 'wifi', label: 'WiFi', icon: '📶' },
  { value: 'catering', label: 'Catering Available', icon: '🍽️' },
  { value: 'bar', label: 'Bar Service', icon: '🍺' },
  { value: 'kitchen', label: 'Kitchen Facilities', icon: '👨‍🍳' },
  { value: 'stage', label: 'Stage', icon: '🎭' },
  { value: 'sound_system', label: 'Sound System', icon: '🔊' },
  { value: 'lighting', label: 'Professional Lighting', icon: '💡' },
  { value: 'projector', label: 'Projector/Screen', icon: '📽️' },
  { value: 'dressing_room', label: 'Dressing Rooms', icon: '👗' },
  { value: 'ac', label: 'Air Conditioning', icon: '❄️' },
  { value: 'heating', label: 'Heating', icon: '🔥' },
];

// Accessibility features
const ACCESSIBILITY_OPTIONS = [
  'Wheelchair accessible entrance',
  'Wheelchair accessible parking',
  'Wheelchair accessible restrooms',
  'Elevator access',
  'Hearing loop system',
  'Braille signage',
  'Service animal friendly',
  'ASL interpreter available',
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    logger.info({ loader: 'venues/new' }, '🏗️ Loading venue creation form');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get user's existing venues to extract common patterns
    const { data: userVenues } = await client
      .from('venues')
      .select('city, state, country, amenities')
      .eq('account_id', user.id)
      .limit(10);
    
    // Extract common locations from user's venues
    const commonCities = new Set<string>();
    const commonAmenities = new Set<string>();
    
    userVenues?.forEach(venue => {
      if (venue.city) commonCities.add(venue.city);
      if (venue.amenities && typeof venue.amenities === 'object') {
        Object.keys(venue.amenities).forEach(key => commonAmenities.add(key));
      }
    });
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'venues/new',
      duration,
      userVenueCount: userVenues?.length || 0,
    }, '🏗️ Venue creation form loaded');
    
    return {
      amenityOptions: AMENITY_OPTIONS,
      accessibilityOptions: ACCESSIBILITY_OPTIONS,
      commonCities: Array.from(commonCities),
      commonAmenities: Array.from(commonAmenities),
      user: {
        id: user.id,
        email: user.email,
      },
      defaultValues: {
        country: 'USA',
        venueType: 'indoor' as const,
        isActive: true,
        operatingHours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '10:00', close: '16:00' },
          sunday: { closed: true, open: '', close: '' },
        },
      },
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'venues/new',
      url: request.url 
    }, 'Error loading venue creation form');
    
    // Redirect to venues page on error
    throw redirect('/venues');
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  const logger = await getLogger();
  
  try {
    logger.info({ action: 'venues/new' }, '🚀 Creating new venue');
    
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
    if (typeof data.equipment === 'string') {
      data.equipment = JSON.parse(data.equipment);
    }
    if (typeof data.accessibilityFeatures === 'string') {
      data.accessibilityFeatures = JSON.parse(data.accessibilityFeatures);
    }
    if (typeof data.operatingHours === 'string') {
      data.operatingHours = JSON.parse(data.operatingHours);
    }
    if (typeof data.blackoutDates === 'string') {
      data.blackoutDates = JSON.parse(data.blackoutDates);
    }
    
    // Validate form data
    const venueData = CreateVenueSchema.parse(data);
    
    // Create the venue
    const { data: newVenue, error } = await client
      .from('venues')
      .insert({
        account_id: user.id,
        name: venueData.name,
        description: venueData.description,
        venue_type: venueData.venueType,
        address: venueData.address,
        city: venueData.city,
        state: venueData.state,
        country: venueData.country,
        postal_code: venueData.postalCode,
        latitude: venueData.latitude,
        longitude: venueData.longitude,
        max_capacity: venueData.maxCapacity,
        amenities: venueData.amenities,
        equipment: venueData.equipment,
        accessibility_features: venueData.accessibilityFeatures,
        image_url: venueData.imageUrl,
        gallery_images: venueData.galleryImages,
        virtual_tour_url: venueData.virtualTourUrl,
        base_hourly_rate: venueData.baseHourlyRate,
        setup_fee: venueData.setupFee,
        cleaning_fee: venueData.cleaningFee,
        operating_hours: venueData.operatingHours,
        blackout_dates: venueData.blackoutDates,
        contact_email: venueData.contactEmail,
        contact_phone: venueData.contactPhone,
        website_url: venueData.websiteUrl,
        is_active: venueData.isActive,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) {
      logger.error({ error, action: 'venues/new' }, 'Failed to create venue');
      throw error;
    }
    
    logger.info({ 
      action: 'venues/new',
      venueId: newVenue.id,
      isActive: newVenue.is_active 
    }, '🏛️ Venue created successfully!');
    
    // Redirect to the new venue's detail page
    return redirect(`/venues/${newVenue.id}`);
    
  } catch (error) {
    logger.error({ 
      error, 
      action: 'venues/new' 
    }, 'Error creating venue');
    
    // Return error response
    return {
      error: error instanceof Error ? error.message : 'Failed to create venue',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: CreateVenuePage,
  transformData: (loaderData) => ({
    amenityOptions: loaderData.amenityOptions,
    accessibilityOptions: loaderData.accessibilityOptions,
    commonCities: loaderData.commonCities,
    commonAmenities: loaderData.commonAmenities,
    user: loaderData.user,
    defaultValues: loaderData.defaultValues,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'Add Your Venue | When The Fun' },
    { 
      name: 'description', 
      content: 'List your venue for events. Reach thousands of event organizers looking for the perfect space for their next event.' 
    },
    { property: 'og:title', content: 'Add Venue - When The Fun' },
    { property: 'og:description', content: 'List your venue for amazing events' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers 🚀
export const headers = () => {
  return {
    'Cache-Control': 'private, max-age=0', // No caching for forms
  };
};