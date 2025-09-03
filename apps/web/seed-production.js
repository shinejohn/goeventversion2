#!/usr/bin/env node

// Use the existing app's Supabase configuration
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaGxzbnBhbWpjaGR0Z3JxdXUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyNzgxMzcwMCwiZXhwIjoyMDQzMzg5NzAwfQ.dSxGQYMYhxtgf7W9z6CJQKwYhLT8I9Xk2f9c8sO7Gzc';

// Create client directly
const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
  cookies: {
    getAll: () => [],
    setAll: () => {}
  }
});

// Mock account ID - we need to create real accounts first
const venues = [
  {
    name: 'Madison Square Garden',
    description: 'Famous arena in New York City',
    venue_type: 'indoor',
    address: '4 Pennsylvania Plaza',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    postal_code: '10001',
    latitude: 40.7505,
    longitude: -73.9934,
    max_capacity: 20000,
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    base_hourly_rate: 25000,
    contact_email: 'bookings@msg.com',
    slug: 'madison-square-garden',
    is_verified: true
  },
  {
    name: 'Hollywood Bowl',
    description: 'Iconic outdoor amphitheater',
    venue_type: 'outdoor',
    address: '2301 N Highland Ave',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    postal_code: '90068',
    latitude: 34.1122,
    longitude: -118.3399,
    max_capacity: 17500,
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    base_hourly_rate: 15000,
    contact_email: 'events@hollywoodbowl.com',
    slug: 'hollywood-bowl',
    is_verified: true
  }
];

async function seedVenues() {
  console.log('🏢 Seeding venues...');
  
  for (let venue of venues) {
    const { data, error } = await supabase
      .from('venues')
      .insert(venue)
      .select();
    
    if (error) {
      console.error('Error inserting venue:', venue.name, error);
    } else {
      console.log('✅ Inserted venue:', venue.name);
    }
  }
}

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    await seedVenues();
    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

main();