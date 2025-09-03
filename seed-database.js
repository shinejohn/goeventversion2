#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Production Supabase credentials
const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaGxzbnBhbWpjaGR0Z3JxdXUiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzI3ODEzNzAwLCJleHAiOjIwNDMzODk3MDB9.h3VYLNyKPa7lBUoTOPwKSJKEwXwj6fH2MQG5VJOoUUM';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Mock account ID - we'll use a fixed UUID for seeding
const MOCK_ACCOUNT_ID = '00000000-0000-0000-0000-000000000001';
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000002';

async function seedVenues() {
  console.log('🏢 Seeding venues...');
  
  const venues = [
    {
      account_id: MOCK_ACCOUNT_ID,
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
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
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
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
      name: 'The Beacon Theatre',
      description: 'Historic Upper West Side theater',
      venue_type: 'indoor',
      address: '2124 Broadway',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postal_code: '10023',
      latitude: 40.7794,
      longitude: -73.9825,
      max_capacity: 2894,
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      base_hourly_rate: 5000,
      contact_email: 'info@beacontheatre.com',
      slug: 'beacon-theatre',
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
      name: 'Red Rocks Amphitheatre',
      description: 'Natural rock formation venue',
      venue_type: 'outdoor',
      address: '18300 W Alameda Pkwy',
      city: 'Morrison',
      state: 'CO',
      country: 'USA',
      postal_code: '80465',
      latitude: 39.6654,
      longitude: -105.2057,
      max_capacity: 9525,
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      base_hourly_rate: 12000,
      contact_email: 'events@redrocks.com',
      slug: 'red-rocks-amphitheatre',
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
      name: 'The Fillmore',
      description: 'Historic music venue in San Francisco',
      venue_type: 'indoor',
      address: '1805 Geary Blvd',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postal_code: '94115',
      latitude: 37.7849,
      longitude: -122.4329,
      max_capacity: 1150,
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
      base_hourly_rate: 3000,
      contact_email: 'booking@thefillmore.com',
      slug: 'the-fillmore',
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
      name: 'Austin City Limits Live',
      description: 'Premier music venue in Austin',
      venue_type: 'indoor',
      address: '310 Willie Nelson Blvd',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      postal_code: '78701',
      latitude: 30.2630,
      longitude: -97.7441,
      max_capacity: 2750,
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      base_hourly_rate: 4500,
      contact_email: 'info@acllive.com',
      slug: 'austin-city-limits-live',
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
      name: 'Chicago Theatre',
      description: 'Historic landmark theater',
      venue_type: 'indoor',
      address: '175 N State St',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postal_code: '60601',
      latitude: 41.8854,
      longitude: -87.6279,
      max_capacity: 3600,
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      base_hourly_rate: 6000,
      contact_email: 'events@chicagotheatre.com',
      slug: 'chicago-theatre',
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
      name: 'The Gorge Amphitheatre',
      description: 'Scenic outdoor venue overlooking Columbia River',
      venue_type: 'outdoor',
      address: '754 Silica Rd NW',
      city: 'Quincy',
      state: 'WA',
      country: 'USA',
      postal_code: '98848',
      latitude: 47.0987,
      longitude: -119.9931,
      max_capacity: 27500,
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      base_hourly_rate: 18000,
      contact_email: 'info@gorgeamphitheatre.net',
      slug: 'the-gorge-amphitheatre',
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
      name: 'The Ryman Auditorium',
      description: 'Mother Church of Country Music',
      venue_type: 'indoor',
      address: '116 Rep John Lewis Way N',
      city: 'Nashville',
      state: 'TN',
      country: 'USA',
      postal_code: '37219',
      latitude: 36.1612,
      longitude: -86.7775,
      max_capacity: 2362,
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      base_hourly_rate: 4000,
      contact_email: 'events@ryman.com',
      slug: 'ryman-auditorium',
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
      name: 'House of Blues',
      description: 'Chain of intimate music venues',
      venue_type: 'indoor',
      address: '1204 Caroline St',
      city: 'Houston',
      state: 'TX',
      country: 'USA',
      postal_code: '77002',
      latitude: 29.7542,
      longitude: -95.3615,
      max_capacity: 1100,
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
      base_hourly_rate: 2800,
      contact_email: 'booking@houseofblues.com',
      slug: 'house-of-blues-houston',
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
      name: 'The Greek Theatre',
      description: 'Historic outdoor amphitheater in Berkeley',
      venue_type: 'outdoor',
      address: '2001 Gayley Rd',
      city: 'Berkeley',
      state: 'CA',
      country: 'USA',
      postal_code: '94720',
      latitude: 37.8719,
      longitude: -122.2585,
      max_capacity: 8500,
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      base_hourly_rate: 8500,
      contact_email: 'info@thegreektheatre.com',
      slug: 'the-greek-theatre',
      is_verified: true,
      created_by: MOCK_USER_ID
    },
    {
      account_id: MOCK_ACCOUNT_ID,
      name: 'Warehouse Live',
      description: 'Multi-room concert venue',
      venue_type: 'indoor',
      address: '813 St Emanuel St',
      city: 'Houston',
      state: 'TX',
      country: 'USA',
      postal_code: '77003',
      latitude: 29.7428,
      longitude: -95.3467,
      max_capacity: 3500,
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      base_hourly_rate: 3500,
      contact_email: 'bookings@warehouselive.com',
      slug: 'warehouse-live',
      is_verified: true,
      created_by: MOCK_USER_ID
    }
  ];

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

if (require.main === module) {
  main();
}

module.exports = { seedVenues };