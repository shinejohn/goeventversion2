const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function seedVenues() {
  console.log('🏢 Seeding venues with minimal fields...');
  
  // Need to get or create an account first
  const mockAccountId = '00000000-0000-0000-0000-000000000001';
  const mockUserId = '00000000-0000-0000-0000-000000000002';
  
  const venues = [
    {
      account_id: mockAccountId,
      name: 'Madison Square Garden',
      description: 'Famous arena in New York City',
      venue_type: 'indoor',
      address: '4 Pennsylvania Plaza',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postal_code: '10001',
      max_capacity: 20000,
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      contact_email: 'bookings@msg.com',
      slug: 'madison-square-garden',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'Hollywood Bowl',
      description: 'Iconic outdoor amphitheater',
      venue_type: 'outdoor',
      address: '2301 N Highland Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postal_code: '90068',
      max_capacity: 17500,
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      contact_email: 'events@hollywoodbowl.com',
      slug: 'hollywood-bowl',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'The Beacon Theatre',
      description: 'Historic Upper West Side theater',
      venue_type: 'indoor',
      address: '2124 Broadway',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postal_code: '10023',
      max_capacity: 2894,
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      contact_email: 'info@beacontheatre.com',
      slug: 'beacon-theatre',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'Red Rocks Amphitheatre',
      description: 'Natural rock formation venue',
      venue_type: 'outdoor',
      address: '18300 W Alameda Pkwy',
      city: 'Morrison',
      state: 'CO',
      country: 'USA',
      postal_code: '80465',
      max_capacity: 9525,
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      contact_email: 'events@redrocks.com',
      slug: 'red-rocks-amphitheatre',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'The Fillmore',
      description: 'Historic music venue in San Francisco',
      venue_type: 'indoor',
      address: '1805 Geary Blvd',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postal_code: '94115',
      max_capacity: 1150,
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
      contact_email: 'booking@thefillmore.com',
      slug: 'the-fillmore',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'Austin City Limits Live',
      description: 'Premier music venue in Austin',
      venue_type: 'indoor',
      address: '310 Willie Nelson Blvd',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      postal_code: '78701',
      max_capacity: 2750,
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      contact_email: 'info@acllive.com',
      slug: 'austin-city-limits-live',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'Chicago Theatre',
      description: 'Historic landmark theater',
      venue_type: 'indoor',
      address: '175 N State St',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postal_code: '60601',
      max_capacity: 3600,
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      contact_email: 'events@chicagotheatre.com',
      slug: 'chicago-theatre',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'The Gorge Amphitheatre',
      description: 'Scenic outdoor venue overlooking Columbia River',
      venue_type: 'outdoor',
      address: '754 Silica Rd NW',
      city: 'Quincy',
      state: 'WA',
      country: 'USA',
      postal_code: '98848',
      max_capacity: 27500,
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      contact_email: 'info@gorgeamphitheatre.net',
      slug: 'the-gorge-amphitheatre',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'The Ryman Auditorium',
      description: 'Mother Church of Country Music',
      venue_type: 'indoor',
      address: '116 Rep John Lewis Way N',
      city: 'Nashville',
      state: 'TN',
      country: 'USA',
      postal_code: '37219',
      max_capacity: 2362,
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      contact_email: 'events@ryman.com',
      slug: 'ryman-auditorium',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'House of Blues Houston',
      description: 'Intimate music venue',
      venue_type: 'indoor',
      address: '1204 Caroline St',
      city: 'Houston',
      state: 'TX',
      country: 'USA',
      postal_code: '77002',
      max_capacity: 1100,
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
      contact_email: 'booking@houseofblues.com',
      slug: 'house-of-blues-houston',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'The Greek Theatre Berkeley',
      description: 'Historic outdoor amphitheater in Berkeley',
      venue_type: 'outdoor',
      address: '2001 Gayley Rd',
      city: 'Berkeley',
      state: 'CA',
      country: 'USA',
      postal_code: '94720',
      max_capacity: 8500,
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      contact_email: 'info@thegreektheatre.com',
      slug: 'the-greek-theatre-berkeley',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    },
    {
      account_id: mockAccountId,
      name: 'Warehouse Live Houston',
      description: 'Multi-room concert venue',
      venue_type: 'indoor',
      address: '813 St Emanuel St',
      city: 'Houston',
      state: 'TX',
      country: 'USA',
      postal_code: '77003',
      max_capacity: 3500,
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      contact_email: 'bookings@warehouselive.com',
      slug: 'warehouse-live-houston',
      is_verified: true,
      is_active: true,
      created_by: mockUserId
    }
  ];

  for (let venue of venues) {
    const { data, error } = await supabase
      .from('venues')
      .insert(venue)
      .select();
    
    if (error) {
      console.error('❌ Error inserting venue:', venue.name, error.message);
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
  }
}

main().catch(console.error);