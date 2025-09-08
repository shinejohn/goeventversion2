#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function addTestData() {
  console.log('Adding test data that matches actual schema...\n');
  
  // Get a community ID (or create one if needed)
  let communityId: string;
  const { data: communities } = await supabase
    .from('communities')
    .select('id')
    .limit(1);
    
  if (communities && communities.length > 0) {
    communityId = communities[0].id;
  } else {
    // Create a community if none exists
    const { data: newCommunity } = await supabase
      .from('communities')
      .insert({
        name: 'Tampa Bay Community',
        slug: 'tampa-bay',
        description: 'Entertainment community for Tampa Bay area'
      })
      .select()
      .single();
      
    communityId = newCommunity?.id || '';
  }
  
  console.log('Using community ID:', communityId);
  
  // Add performers with required slug field
  console.log('\nAdding performers...');
  
  const performers = [
    {
      name: 'The Clearwater Band',
      slug: 'the-clearwater-band',
      category: 'band',
      bio: 'Local favorite band bringing high energy performances to the Tampa Bay area',
      profile_image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      rating: 4.8,
      is_verified: true,
      city: 'Clearwater'
    },
    {
      name: 'Sarah Johnson',
      slug: 'sarah-johnson',
      category: 'solo-artist',
      bio: 'Soulful vocalist with a passion for jazz standards and modern R&B',
      profile_image_url: 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=800&h=600&fit=crop',
      rating: 4.9,
      is_verified: true,
      city: 'Tampa'
    },
    {
      name: 'DJ Mike Storm',
      slug: 'dj-mike-storm',
      category: 'dj',
      bio: 'Premier DJ spinning the hottest tracks for clubs and events',
      profile_image_url: 'https://images.unsplash.com/photo-1571266028243-2af49d40e18f?w=800&h=600&fit=crop',
      rating: 4.5,
      is_verified: true,
      city: 'St. Petersburg'
    }
  ];
  
  const { data: insertedPerformers, error: performerError } = await supabase
    .from('performers')
    .upsert(performers, { onConflict: 'slug' })
    .select();
    
  if (performerError) {
    console.error('Error adding performers:', performerError);
  } else {
    console.log('Added', insertedPerformers?.length, 'performers');
  }
  
  // Get venue IDs
  const { data: venues } = await supabase
    .from('venues')
    .select('id, name')
    .limit(5);
    
  if (venues && venues.length > 0) {
    // Add events with required community_id
    console.log('\nAdding events...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const events = [
      {
        title: 'Summer Music Festival',
        slug: slugify('Summer Music Festival'),
        community_id: communityId,
        venue_id: venues[0].id,
        category: 'concert',
        description: 'Annual summer music festival featuring local bands',
        start_datetime: tomorrow.toISOString(),
        end_datetime: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
        price: 45,
        status: 'upcoming'
      },
      {
        title: 'Jazz Evening',
        slug: slugify('Jazz Evening'),
        community_id: communityId,
        venue_id: venues[1]?.id || venues[0].id,
        category: 'concert',
        description: 'An intimate evening of jazz standards',
        start_datetime: nextWeek.toISOString(),
        end_datetime: new Date(nextWeek.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop',
        price: 30,
        status: 'upcoming'
      },
      {
        title: 'Community Theater Night',
        slug: slugify('Community Theater Night'),
        community_id: communityId,
        venue_id: venues[2]?.id || venues[0].id,
        category: 'theater',
        description: 'Local theater group performance',
        start_datetime: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        end_datetime: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
        price: 20,
        status: 'upcoming'
      }
    ];
    
    const { data: insertedEvents, error: eventError } = await supabase
      .from('events')
      .upsert(events, { onConflict: 'slug' })
      .select();
      
    if (eventError) {
      console.error('Error adding events:', eventError);
    } else {
      console.log('Added', insertedEvents?.length, 'events');
    }
  }
  
  console.log('\n✅ Test data addition complete!');
}

addTestData().catch(console.error);