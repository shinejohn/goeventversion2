const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function insertWorkingData() {
  console.log('🔄 Inserting working data with correct schema...\n');

  // First, let's check what exists
  console.log('1️⃣ Checking existing venues...');
  const { data: existingVenues } = await supabase.from('venues').select('id, name').limit(3);
  console.log('Existing venues:', existingVenues?.length || 0);

  console.log('\n2️⃣ Checking existing events...');
  const { data: existingEvents } = await supabase.from('events').select('id, title').limit(3);
  console.log('Existing events:', existingEvents?.length || 0);

  console.log('\n3️⃣ Checking existing performers...');
  const { data: existingPerformers } = await supabase.from('performers').select('id, name').limit(3);
  console.log('Existing performers:', existingPerformers?.length || 0);

  // Insert venues with required location field
  console.log('\n4️⃣ Inserting venues with proper schema...');
  const venueData = [
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Madison Square Garden',
      description: 'Famous arena in New York City',
      slug: 'madison-square-garden',
      venue_type: 1,
      address: '4 Pennsylvania Plaza, New York, NY 10001',
      location: { lat: 40.7505, lng: -73.9934 } // Required location field
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Hollywood Bowl', 
      description: 'Iconic outdoor amphitheater',
      slug: 'hollywood-bowl',
      venue_type: 2,
      address: '2301 N Highland Ave, Los Angeles, CA 90068',
      location: { lat: 34.1122, lng: -118.3398 }
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'The Beacon Theatre',
      description: 'Historic Upper West Side theater',
      slug: 'beacon-theatre',
      venue_type: 1, 
      address: '2124 Broadway, New York, NY 10023',
      location: { lat: 40.7796, lng: -73.9821 }
    }
  ];

  try {
    const { data: venueResult, error: venueError } = await supabase.from('venues').insert(venueData);
    if (venueError) {
      console.log('❌ Venue insert error:', venueError.message);
    } else {
      console.log('✅ 3 venues inserted successfully');
    }
  } catch (err) {
    console.log('❌ Venue insert error:', err.message);
  }

  // Insert events with proper schema
  console.log('\n5️⃣ Inserting events...');
  const eventData = [
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Summer Music Festival',
      description: 'Multi-day outdoor music festival featuring top artists',
      slug: 'summer-music-festival',
      category: 'music'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Jazz Night at the Blue Moon',
      description: 'Intimate jazz performance with local artists', 
      slug: 'jazz-night-blue-moon',
      category: 'music'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Comedy Showcase',
      description: 'Stand-up comedy night featuring rising comedians',
      slug: 'comedy-showcase',
      category: 'entertainment'
    }
  ];

  try {
    const { data: eventResult, error: eventError } = await supabase.from('events').insert(eventData);
    if (eventError) {
      console.log('❌ Event insert error:', eventError.message);
    } else {
      console.log('✅ 3 events inserted successfully');
    }
  } catch (err) {
    console.log('❌ Event insert error:', err.message);
  }

  // Insert performers 
  console.log('\n6️⃣ Inserting performers...');
  const performerData = [
    {
      name: 'The Midnight Express',
      stage_name: 'The Midnight Express',
      slug: 'the-midnight-express',
      bio: 'High-energy rock band from Austin, Texas'
    },
    {
      name: 'Sarah Jazz Quintet',
      stage_name: 'Sarah Jazz Quintet', 
      slug: 'sarah-jazz-quintet',
      bio: 'Smooth jazz ensemble led by Sarah Williams'
    },
    {
      name: 'Comedy Central Mike',
      stage_name: 'Comedy Central Mike',
      slug: 'comedy-central-mike',
      bio: 'Stand-up comedian with 15 years of experience'
    }
  ];

  try {
    const { data: performerResult, error: performerError } = await supabase.from('performers').insert(performerData);
    if (performerError) {
      console.log('❌ Performer insert error:', performerError.message);
    } else {
      console.log('✅ 3 performers inserted successfully');
    }
  } catch (err) {
    console.log('❌ Performer insert error:', err.message);
  }

  // Check final counts
  console.log('\n7️⃣ Final counts:');
  const { data: finalVenues } = await supabase.from('venues').select('id').limit(20);
  const { data: finalEvents } = await supabase.from('events').select('id').limit(20);
  const { data: finalPerformers } = await supabase.from('performers').select('id').limit(20);
  
  console.log(`📊 Venues: ${finalVenues?.length || 0}`);
  console.log(`📊 Events: ${finalEvents?.length || 0}`);
  console.log(`📊 Performers: ${finalPerformers?.length || 0}`);
  
  console.log('\n🎉 Initial data insertion complete!');
}

insertWorkingData().catch(console.error);