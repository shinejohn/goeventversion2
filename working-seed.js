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
  console.log('🏢 Seeding venues with correct schema...');
  
  const mockCommunityId = '00000000-0000-0000-0000-000000000001';
  
  const venues = [
    {
      community_id: mockCommunityId,
      name: 'Madison Square Garden',
      description: 'Famous arena in New York City hosting major concerts and sports events',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Hollywood Bowl',
      description: 'Iconic outdoor amphitheater in Los Angeles',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'The Beacon Theatre',
      description: 'Historic Upper West Side theater in Manhattan',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Red Rocks Amphitheatre',
      description: 'Natural rock formation venue in Colorado',
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'The Fillmore',
      description: 'Historic music venue in San Francisco',
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Austin City Limits Live',
      description: 'Premier music venue in Austin',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Chicago Theatre',
      description: 'Historic landmark theater in downtown Chicago',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'The Gorge Amphitheatre',
      description: 'Scenic outdoor venue overlooking Columbia River',
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'The Ryman Auditorium',
      description: 'Mother Church of Country Music in Nashville',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'House of Blues Houston',
      description: 'Intimate music venue with authentic blues atmosphere',
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'The Greek Theatre Berkeley',
      description: 'Historic outdoor amphitheater in Berkeley Hills',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Warehouse Live Houston',
      description: 'Multi-room concert venue in downtown Houston',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    }
  ];

  let successCount = 0;
  
  for (let venue of venues) {
    const { data, error } = await supabase
      .from('venues')
      .insert(venue)
      .select();
    
    if (error) {
      console.error('❌ Error inserting venue:', venue.name, ':', error.message);
    } else {
      console.log('✅ Inserted venue:', venue.name);
      successCount++;
    }
  }
  
  return successCount;
}

async function seedEvents() {
  console.log('🎭 Seeding events...');
  
  const mockCommunityId = '00000000-0000-0000-0000-000000000001';
  
  const events = [
    {
      community_id: mockCommunityId,
      name: 'Summer Music Festival',
      description: 'Multi-day outdoor music festival featuring top artists',
      image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Jazz Night at the Blue Moon',
      description: 'Intimate jazz performance featuring local musicians',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Comedy Showcase',
      description: 'Stand-up comedy night with emerging and established comedians',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Rock Concert Series',
      description: 'Monthly rock concert series featuring different bands',
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Classical Orchestra Performance',
      description: 'Symphony orchestra performing classical masterpieces',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Electronic Dance Festival',
      description: 'All-night electronic music dance party',
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Folk Music Gathering',
      description: 'Acoustic folk music in an intimate setting',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Hip Hop Showcase',
      description: 'Underground hip hop artists showcase',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Country Music Night',
      description: 'Country music celebration with line dancing',
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Opera Performance',
      description: 'Classic opera performance with full orchestra',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Indie Rock Festival',
      description: 'Independent rock artists festival',
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'World Music Celebration',
      description: 'Celebrating music from around the world',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    }
  ];

  let successCount = 0;
  
  for (let event of events) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select();
    
    if (error) {
      console.error('❌ Error inserting event:', event.name, ':', error.message);
    } else {
      console.log('✅ Inserted event:', event.name);
      successCount++;
    }
  }
  
  return successCount;
}

async function seedPerformers() {
  console.log('🎤 Seeding performers...');
  
  const mockCommunityId = '00000000-0000-0000-0000-000000000001';
  
  const performers = [
    {
      community_id: mockCommunityId,
      name: 'The Midnight Express',
      description: 'High-energy rock band with electrifying performances',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Sarah Jazz Quintet',
      description: 'Smooth jazz ensemble led by vocalist Sarah',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Comedy Central Mike',
      description: 'Stand-up comedian with observational humor',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Electric Pulse DJ',
      description: 'Electronic music DJ and producer',
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Classical Strings Quartet',
      description: 'Professional classical music quartet',
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Folk Stories Trio',
      description: 'Acoustic folk trio with storytelling focus',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Hip Hop Collective',
      description: 'Underground hip hop artists collective',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    },
    {
      comedy_id: mockCommunityId,
      name: 'Country Roads Band',
      description: 'Traditional country music band',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Opera Prima Donna',
      description: 'Professional opera singer with international experience',
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Indie Rock Revival',
      description: 'Independent rock band with vintage sound',
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'World Beat Ensemble',
      description: 'Multi-cultural music ensemble',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    },
    {
      community_id: mockCommunityId,
      name: 'Magic Mike Magician',
      description: 'Professional magician and entertainer',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    }
  ];

  let successCount = 0;
  
  for (let performer of performers) {
    const { data, error } = await supabase
      .from('performers')
      .insert(performer)
      .select();
    
    if (error) {
      console.error('❌ Error inserting performer:', performer.name, ':', error.message);
    } else {
      console.log('✅ Inserted performer:', performer.name);
      successCount++;
    }
  }
  
  return successCount;
}

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');
  
  try {
    const venueCount = await seedVenues();
    console.log(`\n📊 Venues seeded: ${venueCount}/12`);
    
    const eventCount = await seedEvents();
    console.log(`📊 Events seeded: ${eventCount}/12`);
    
    const performerCount = await seedPerformers();
    console.log(`📊 Performers seeded: ${performerCount}/12`);
    
    console.log('\n✅ Database seeding completed!');
    console.log(`📈 Total records created: ${venueCount + eventCount + performerCount}`);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
}

main().catch(console.error);