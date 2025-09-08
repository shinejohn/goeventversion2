#!/usr/bin/env node

// Script to seed the cloud database using the Supabase REST API
const SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

async function seedDatabase() {
  console.log('Seeding cloud database...');
  
  // Test performers seed data
  const performers = [
    {
      id: 'a1000000-0000-0000-0000-000000000001',
      name: 'John Doe',
      stage_name: 'DJ Johnny',
      bio: 'Electronic music producer and DJ from Los Angeles',
      genres: ['electronic', 'house', 'techno'],
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      rating: 4.5,
      verified: true,
      base_price: 1500
    },
    {
      id: 'a1000000-0000-0000-0000-000000000002',
      name: 'Sarah Smith',
      stage_name: 'The Blues Queen',
      bio: 'Award-winning blues singer with a powerful voice',
      genres: ['blues', 'soul', 'jazz'],
      image: 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?w=800&q=80',
      rating: 4.8,
      verified: true,
      base_price: 2000
    },
    {
      id: 'a1000000-0000-0000-0000-000000000003',
      name: 'The Night Owls',
      stage_name: null,
      bio: 'Rock band known for their energetic live performances',
      genres: ['rock', 'alternative', 'indie'],
      image: 'https://images.unsplash.com/photo-1506091403742-e3aa39518db5?w=800&q=80',
      rating: 4.7,
      verified: false,
      base_price: 3000
    }
  ];

  // Insert performers
  console.log('Inserting performers...');
  const performersResponse = await fetch(`${SUPABASE_URL}/rest/v1/performers`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(performers)
  });

  if (!performersResponse.ok) {
    console.error('Failed to insert performers:', await performersResponse.text());
  } else {
    console.log('Performers inserted successfully');
  }

  // Test venues seed data
  const venues = [
    {
      id: 'b1000000-0000-0000-0000-000000000001',
      name: 'The Grand Theater',
      slug: 'grand-theater',
      description: 'Historic theater in downtown with stunning architecture',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90001',
      country: 'USA',
      capacity: 1500,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      rating: 4.6,
      category: 'theater'
    },
    {
      id: 'b1000000-0000-0000-0000-000000000002',
      name: 'Blue Note Jazz Club',
      slug: 'blue-note-jazz',
      description: 'Intimate jazz club with world-class acoustics',
      address: '456 Jazz Ave',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      country: 'USA',
      capacity: 300,
      image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80',
      rating: 4.8,
      category: 'club'
    },
    {
      id: 'b1000000-0000-0000-0000-000000000003',
      name: 'Sunset Arena',
      slug: 'sunset-arena',
      description: 'Large outdoor venue perfect for festivals',
      address: '789 Sunset Blvd',
      city: 'Miami',
      state: 'FL',
      zip_code: '33101',
      country: 'USA',
      capacity: 5000,
      image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
      rating: 4.5,
      category: 'arena'
    }
  ];

  // Insert venues
  console.log('Inserting venues...');
  const venuesResponse = await fetch(`${SUPABASE_URL}/rest/v1/venues`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(venues)
  });

  if (!venuesResponse.ok) {
    console.error('Failed to insert venues:', await venuesResponse.text());
  } else {
    console.log('Venues inserted successfully');
  }

  // Test events seed data
  const events = [
    {
      id: 'c1000000-0000-0000-0000-000000000001',
      title: 'Electronic Dance Night',
      slug: 'electronic-dance-night-2025',
      description: 'Get ready for an unforgettable night of electronic music!',
      category: 'Music',
      start_datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      end_datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      venue_id: 'b1000000-0000-0000-0000-000000000001',
      performer_id: 'a1000000-0000-0000-0000-000000000001',
      image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
      status: 'published',
      price_min: 25,
      price_max: 50,
      city: 'Los Angeles'
    },
    {
      id: 'c1000000-0000-0000-0000-000000000002',
      title: 'Blues & Soul Evening',
      slug: 'blues-soul-evening-2025',
      description: 'An intimate evening with the Blues Queen',
      category: 'Music',
      start_datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      end_datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      venue_id: 'b1000000-0000-0000-0000-000000000002',
      performer_id: 'a1000000-0000-0000-0000-000000000002',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      status: 'published',
      price_min: 35,
      price_max: 75,
      city: 'New York'
    },
    {
      id: 'c1000000-0000-0000-0000-000000000003',
      title: 'Rock Festival 2025',
      slug: 'rock-festival-2025',
      description: 'The biggest rock festival of the year!',
      category: 'Music',
      start_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
      venue_id: 'b1000000-0000-0000-0000-000000000003',
      performer_id: 'a1000000-0000-0000-0000-000000000003',
      image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
      status: 'published',
      price_min: 50,
      price_max: 150,
      city: 'Miami'
    }
  ];

  // Insert events
  console.log('Inserting events...');
  const eventsResponse = await fetch(`${SUPABASE_URL}/rest/v1/events`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(events)
  });

  if (!eventsResponse.ok) {
    console.error('Failed to insert events:', await eventsResponse.text());
  } else {
    console.log('Events inserted successfully');
  }

  console.log('✅ Database seeding completed!');
}

// Run the seeding
seedDatabase().catch(console.error);