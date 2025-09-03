const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function insertCorrectData() {
  console.log('🔄 Inserting data with correct schemas...\n');

  // First check what columns are actually in venues
  console.log('1️⃣ Getting venue schema...');
  try {
    const { data, error } = await supabase.from('venues').select('*').limit(1);
    if (data && data.length > 0) {
      console.log('Venue columns:', Object.keys(data[0]).join(', '));
    } else {
      // Try inserting one minimal record to see what's required
      const { error: insertError } = await supabase.from('venues').insert({
        community_id: '00000000-0000-0000-0000-000000000001',
        name: 'Test Venue',
        slug: 'test-venue'
      });
      if (insertError) {
        console.log('Required fields error:', insertError.message);
      }
    }
  } catch (err) {
    console.log('Schema check error:', err.message);
  }

  // Check events schema
  console.log('\n2️⃣ Getting event schema...');
  try {
    const { data, error } = await supabase.from('events').select('*').limit(1);
    if (data && data.length > 0) {
      console.log('Event columns:', Object.keys(data[0]).join(', '));
    } else {
      // Try minimal insert to see requirements
      const { error: insertError } = await supabase.from('events').insert({
        community_id: '00000000-0000-0000-0000-000000000001',
        title: 'Test Event',
        slug: 'test-event'
      });
      if (insertError) {
        console.log('Required fields error:', insertError.message);
      }
    }
  } catch (err) {
    console.log('Schema check error:', err.message);
  }

  // Try to insert venues with PostGIS POINT geometry
  console.log('\n3️⃣ Inserting venues with PostGIS geometry...');
  const venueData = [
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Madison Square Garden',
      description: 'Famous arena in New York City',
      slug: 'madison-square-garden',
      venue_type: 1,
      address: '4 Pennsylvania Plaza, New York, NY 10001',
      location: 'POINT(-73.9934 40.7505)' // PostGIS format
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Hollywood Bowl', 
      description: 'Iconic outdoor amphitheater',
      slug: 'hollywood-bowl',
      venue_type: 2,
      address: '2301 N Highland Ave, Los Angeles, CA 90068',
      location: 'POINT(-118.3398 34.1122)'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'The Beacon Theatre',
      description: 'Historic Upper West Side theater',
      slug: 'beacon-theatre',
      venue_type: 1, 
      address: '2124 Broadway, New York, NY 10023',
      location: 'POINT(-73.9821 40.7796)'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Red Rocks Amphitheatre',
      description: 'Natural rock formation venue',
      slug: 'red-rocks-amphitheatre',
      venue_type: 2, 
      address: '18300 W Alameda Pkwy, Morrison, CO 80465',
      location: 'POINT(-105.2058 39.6654)'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'The Fillmore',
      description: 'Historic music venue in San Francisco',
      slug: 'the-fillmore',
      venue_type: 1, 
      address: '1805 Geary Blvd, San Francisco, CA 94115',
      location: 'POINT(-122.4330 37.7849)'
    }
  ];

  for (let i = 0; i < venueData.length; i++) {
    try {
      const { data: venueResult, error: venueError } = await supabase.from('venues').insert(venueData[i]);
      if (venueError) {
        console.log(`❌ Venue ${i+1} error:`, venueError.message);
      } else {
        console.log(`✅ Venue ${i+1} inserted: ${venueData[i].name}`);
      }
    } catch (err) {
      console.log(`❌ Venue ${i+1} error:`, err.message);
    }
  }

  // Try events with start_datetime
  console.log('\n4️⃣ Inserting events with start_datetime...');
  const eventData = [
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Summer Music Festival',
      description: 'Multi-day outdoor music festival featuring top artists',
      slug: 'summer-music-festival',
      category: 'music',
      start_datetime: '2024-07-15T18:00:00Z'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Jazz Night at the Blue Moon',
      description: 'Intimate jazz performance with local artists', 
      slug: 'jazz-night-blue-moon',
      category: 'music',
      start_datetime: '2024-06-20T20:00:00Z'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Comedy Showcase',
      description: 'Stand-up comedy night featuring rising comedians',
      slug: 'comedy-showcase',
      category: 'entertainment',
      start_datetime: '2024-06-25T19:30:00Z'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Rock Concert Series',
      description: 'Monthly rock concert series with different bands',
      slug: 'rock-concert-series',
      category: 'music',
      start_datetime: '2024-07-05T19:00:00Z'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Classical Orchestra Performance',
      description: 'Symphony orchestra performing classical masterpieces',
      slug: 'classical-orchestra-performance',
      category: 'music',
      start_datetime: '2024-06-30T19:30:00Z'
    }
  ];

  for (let i = 0; i < eventData.length; i++) {
    try {
      const { data: eventResult, error: eventError } = await supabase.from('events').insert(eventData[i]);
      if (eventError) {
        console.log(`❌ Event ${i+1} error:`, eventError.message);
      } else {
        console.log(`✅ Event ${i+1} inserted: ${eventData[i].title}`);
      }
    } catch (err) {
      console.log(`❌ Event ${i+1} error:`, err.message);
    }
  }

  // Add more performers to reach 12 total
  console.log('\n5️⃣ Adding more performers to reach 12 total...');
  const additionalPerformers = [
    {
      name: 'Electric Pulse DJ',
      stage_name: 'DJ Electric Pulse',
      slug: 'electric-pulse-dj',
      bio: 'Electronic music producer and DJ'
    },
    {
      name: 'Classical Strings Quartet',
      stage_name: 'Classical Strings Quartet',
      slug: 'classical-strings-quartet',
      bio: 'Professional classical music quartet'
    },
    {
      name: 'Folk Stories Trio',
      stage_name: 'Folk Stories Trio',
      slug: 'folk-stories-trio',
      bio: 'Acoustic folk music with storytelling'
    },
    {
      name: 'Hip Hop Collective',
      stage_name: 'Hip Hop Collective',
      slug: 'hip-hop-collective',
      bio: 'Underground hip hop group'
    },
    {
      name: 'Country Roads Band',
      stage_name: 'Country Roads Band',
      slug: 'country-roads-band',
      bio: 'Traditional country music band'
    },
    {
      name: 'Opera Prima Donna',
      stage_name: 'Opera Prima Donna',
      slug: 'opera-prima-donna',
      bio: 'Classically trained opera singer'
    },
    {
      name: 'Indie Rock Revival',
      stage_name: 'Indie Rock Revival',
      slug: 'indie-rock-revival',
      bio: 'Independent rock band with original songs'
    }
  ];

  for (let i = 0; i < additionalPerformers.length; i++) {
    try {
      const { data: performerResult, error: performerError } = await supabase.from('performers').insert(additionalPerformers[i]);
      if (performerError) {
        console.log(`❌ Performer ${i+1} error:`, performerError.message);
      } else {
        console.log(`✅ Performer ${i+1} inserted: ${additionalPerformers[i].name}`);
      }
    } catch (err) {
      console.log(`❌ Performer ${i+1} error:`, err.message);
    }
  }

  // Final count check
  console.log('\n6️⃣ Final counts:');
  const { data: finalVenues } = await supabase.from('venues').select('id');
  const { data: finalEvents } = await supabase.from('events').select('id');
  const { data: finalPerformers } = await supabase.from('performers').select('id');
  
  console.log(`📊 Total Venues: ${finalVenues?.length || 0}`);
  console.log(`📊 Total Events: ${finalEvents?.length || 0}`);
  console.log(`📊 Total Performers: ${finalPerformers?.length || 0}`);
  
  console.log('\n🎉 Database population complete!');
}

insertCorrectData().catch(console.error);