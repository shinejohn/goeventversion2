import React from 'react';
import type { Route } from './+types/new';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';
import { z } from 'zod';

// Magic Patterns imports
import { CreatePerformerPage } from '~/components/magic-patterns/pages/CreatePerformerPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Create Performer Profile Route - Join the spotlight!
 * Register as a performer and showcase your talent
 * 
 * Time to shine on stage! 🎤⭐
 */

// Form data schema for performer profile creation
const CreatePerformerSchema = z.object({
  stageName: z.string().min(2).max(255),
  realName: z.string().max(255).optional(),
  bio: z.string().min(20).max(5000),
  category: z.enum([
    'musician', 'band', 'dj', 'comedian', 'speaker', 
    'dancer', 'magician', 'variety', 'other'
  ]),
  
  // Performance details
  genres: z.array(z.string()).min(1).max(10),
  instruments: z.array(z.string()).default([]),
  performanceDurationMin: z.coerce.number().min(15).max(480).default(60),
  setupTimeMin: z.coerce.number().min(0).max(240).default(30),
  
  // Media
  profileImageUrl: z.string().url().nullable(),
  galleryImages: z.array(z.string().url()).default([]),
  demoVideos: z.array(z.object({
    url: z.string().url(),
    title: z.string(),
    platform: z.enum(['youtube', 'vimeo', 'other']),
  })).default([]),
  audioSamples: z.array(z.object({
    url: z.string().url(),
    title: z.string(),
    duration: z.number().optional(),
  })).default([]),
  
  // Pricing
  baseRate: z.coerce.number().min(0).default(0),
  travelFee: z.coerce.number().min(0).default(0),
  equipmentFee: z.coerce.number().min(0).default(0),
  
  // Requirements
  technicalRequirements: z.string().max(2000).optional(),
  spaceRequirements: z.string().max(2000).optional(),
  
  // Contact & Booking
  bookingEmail: z.string().email().optional(),
  bookingPhone: z.string().max(20).optional(),
  websiteUrl: z.string().url().nullable(),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    tiktok: z.string().optional(),
    youtube: z.string().optional(),
    spotify: z.string().optional(),
    soundcloud: z.string().optional(),
  }).default({}),
  
  // Settings
  isAvailable: z.boolean().default(true),
});

// Genre options by category
const GENRE_OPTIONS = {
  musician: ['Rock', 'Pop', 'Jazz', 'Classical', 'Electronic', 'Hip Hop', 'Country', 'R&B', 'Folk', 'Metal', 'Blues', 'Latin', 'World'],
  band: ['Rock', 'Pop', 'Jazz', 'Cover Band', 'Wedding Band', 'Party Band', 'Tribute Band', 'Original Music'],
  dj: ['House', 'Techno', 'Hip Hop', 'Top 40', 'Wedding DJ', 'Club DJ', 'Mobile DJ', 'Radio DJ'],
  comedian: ['Stand-up', 'Improv', 'Sketch', 'Musical Comedy', 'Clean Comedy', 'Adult Comedy', 'Roast'],
  speaker: ['Motivational', 'Educational', 'Corporate', 'TEDx', 'Keynote', 'Workshop', 'Panel'],
  dancer: ['Ballet', 'Contemporary', 'Hip Hop', 'Jazz', 'Tap', 'Ballroom', 'Latin', 'Street', 'Traditional'],
  magician: ['Close-up', 'Stage Magic', 'Mentalism', 'Illusions', 'Comedy Magic', 'Kids Magic', 'Corporate Magic'],
  variety: ['Circus', 'Acrobatics', 'Juggling', 'Fire Performance', 'Aerial', 'Mime', 'Puppetry'],
  other: ['Custom', 'Mixed', 'Experimental', 'Traditional', 'Cultural'],
};

// Common instruments
const INSTRUMENT_OPTIONS = [
  'Vocals', 'Guitar', 'Bass', 'Drums', 'Piano', 'Keyboard', 
  'Violin', 'Cello', 'Saxophone', 'Trumpet', 'Flute', 'Clarinet',
  'DJ Equipment', 'Turntables', 'Electronic', 'Percussion', 'Other',
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    logger.info({ loader: 'performers/new' }, '🎭 Loading performer creation form');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if user already has a performer profile
    const { data: existingProfile } = await client
      .from('performers')
      .select('id')
      .eq('account_id', user.id)
      .single();
    
    if (existingProfile) {
      logger.info({ 
        loader: 'performers/new',
        existingProfileId: existingProfile.id 
      }, 'User already has performer profile, redirecting');
      
      // Redirect to their existing profile
      throw redirect(`/performers/${existingProfile.id}`);
    }
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'performers/new',
      duration,
    }, '🎭 Performer creation form loaded');
    
    return {
      genreOptions: GENRE_OPTIONS,
      instrumentOptions: INSTRUMENT_OPTIONS,
      user: {
        id: user.id,
        email: user.email,
      },
      defaultValues: {
        category: 'musician' as const,
        performanceDurationMin: 60,
        setupTimeMin: 30,
        isAvailable: true,
        bookingEmail: user.email,
      },
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'performers/new',
      url: request.url 
    }, 'Error loading performer creation form');
    
    // If it's a redirect, throw it
    if (error instanceof Response) {
      throw error;
    }
    
    // Otherwise redirect to performers page
    throw redirect('/performers');
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  const logger = await getLogger();
  
  try {
    logger.info({ action: 'performers/new' }, '🚀 Creating performer profile');
    
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
    if (typeof data.genres === 'string') {
      data.genres = JSON.parse(data.genres);
    }
    if (typeof data.instruments === 'string') {
      data.instruments = JSON.parse(data.instruments);
    }
    if (typeof data.galleryImages === 'string') {
      data.galleryImages = JSON.parse(data.galleryImages);
    }
    if (typeof data.demoVideos === 'string') {
      data.demoVideos = JSON.parse(data.demoVideos);
    }
    if (typeof data.audioSamples === 'string') {
      data.audioSamples = JSON.parse(data.audioSamples);
    }
    if (typeof data.socialMedia === 'string') {
      data.socialMedia = JSON.parse(data.socialMedia);
    }
    
    // Validate form data
    const performerData = CreatePerformerSchema.parse(data);
    
    // Create the performer profile
    const { data: newPerformer, error } = await client
      .from('performers')
      .insert({
        account_id: user.id,
        stage_name: performerData.stageName,
        real_name: performerData.realName,
        bio: performerData.bio,
        category: performerData.category,
        genres: performerData.genres,
        instruments: performerData.instruments,
        performance_duration_min: performerData.performanceDurationMin,
        setup_time_min: performerData.setupTimeMin,
        profile_image_url: performerData.profileImageUrl,
        gallery_images: performerData.galleryImages,
        demo_videos: performerData.demoVideos,
        audio_samples: performerData.audioSamples,
        base_rate: performerData.baseRate,
        travel_fee: performerData.travelFee,
        equipment_fee: performerData.equipmentFee,
        technical_requirements: performerData.technicalRequirements,
        space_requirements: performerData.spaceRequirements,
        booking_email: performerData.bookingEmail,
        booking_phone: performerData.bookingPhone,
        website_url: performerData.websiteUrl,
        social_media: performerData.socialMedia,
        is_available: performerData.isAvailable,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) {
      logger.error({ error, action: 'performers/new' }, 'Failed to create performer profile');
      throw error;
    }
    
    logger.info({ 
      action: 'performers/new',
      performerId: newPerformer.id,
      category: newPerformer.category 
    }, '🌟 Performer profile created successfully!');
    
    // Redirect to the new performer's profile page
    return redirect(`/performers/${newPerformer.id}`);
    
  } catch (error) {
    logger.error({ 
      error, 
      action: 'performers/new' 
    }, 'Error creating performer profile');
    
    // Return error response
    return {
      error: error instanceof Error ? error.message : 'Failed to create performer profile',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: CreatePerformerPage,
  transformData: (loaderData) => ({
    genreOptions: loaderData.genreOptions,
    instrumentOptions: loaderData.instrumentOptions,
    user: loaderData.user,
    defaultValues: loaderData.defaultValues,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'Become a Performer | When The Fun' },
    { 
      name: 'description', 
      content: 'Join as a performer and showcase your talent. Connect with event organizers and venues looking for amazing entertainment.' 
    },
    { property: 'og:title', content: 'Become a Performer - When The Fun' },
    { property: 'og:description', content: 'Showcase your talent to thousands of event organizers' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers 🚀
export const headers = () => {
  return {
    'Cache-Control': 'private, max-age=0', // No caching for forms
  };
};