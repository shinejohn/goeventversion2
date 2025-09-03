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
  
  const venues = [
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Madison Square Garden',
      description: 'Famous arena in New York City hosting major concerts and sports events',
      slug: 'madison-square-garden',
      venue_type: 1, // Assuming 1 = indoor
      address: '4 Pennsylvania Plaza, New York, NY 10001'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Hollywood Bowl',
      description: 'Iconic outdoor amphitheater in Los Angeles',
      slug: 'hollywood-bowl',
      venue_type: 2, // Assuming 2 = outdoor
      address: '2301 N Highland Ave, Los Angeles, CA 90068'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'The Beacon Theatre',
      description: 'Historic Upper West Side theater in Manhattan',
      slug: 'beacon-theatre',
      venue_type: 1,
      address: '2124 Broadway, New York, NY 10023'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Red Rocks Amphitheatre',
      description: 'Natural rock formation venue in Colorado',
      slug: 'red-rocks-amphitheatre',
      venue_type: 2,
      address: '18300 W Alameda Pkwy, Morrison, CO 80465'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'The Fillmore',
      description: 'Historic music venue in San Francisco',
      slug: 'the-fillmore',
      venue_type: 1,
      address: '1805 Geary Blvd, San Francisco, CA 94115'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Austin City Limits Live',
      description: 'Premier music venue in Austin',
      slug: 'austin-city-limits-live',
      venue_type: 1,
      address: '310 Willie Nelson Blvd, Austin, TX 78701'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Chicago Theatre',
      description: 'Historic landmark theater in downtown Chicago',
      slug: 'chicago-theatre',
      venue_type: 1,
      address: '175 N State St, Chicago, IL 60601'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'The Gorge Amphitheatre',
      description: 'Scenic outdoor venue overlooking Columbia River',
      slug: 'the-gorge-amphitheatre',
      venue_type: 2,
      address: '754 Silica Rd NW, Quincy, WA 98848'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'The Ryman Auditorium',
      description: 'Mother Church of Country Music in Nashville',
      slug: 'ryman-auditorium',
      venue_type: 1,
      address: '116 Rep John Lewis Way N, Nashville, TN 37219'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'House of Blues Houston',
      description: 'Intimate music venue with authentic blues atmosphere',
      slug: 'house-of-blues-houston',
      venue_type: 1,
      address: '1204 Caroline St, Houston, TX 77002'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'The Greek Theatre Berkeley',
      description: 'Historic outdoor amphitheater in Berkeley Hills',
      slug: 'the-greek-theatre-berkeley',
      venue_type: 2,
      address: '2001 Gayley Rd, Berkeley, CA 94720'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Warehouse Live Houston',
      description: 'Multi-room concert venue in downtown Houston',
      slug: 'warehouse-live-houston',
      venue_type: 1,
      address: '813 St Emanuel St, Houston, TX 77003'
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
  console.log('🎭 Seeding events with correct schema...');
  
  const events = [
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Summer Music Festival',
      description: 'Multi-day outdoor music festival featuring top artists from around the world',
      slug: 'summer-music-festival'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Jazz Night at the Blue Moon',
      description: 'Intimate jazz performance featuring local musicians and special guests',
      slug: 'jazz-night-blue-moon'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Comedy Showcase',
      description: 'Stand-up comedy night with emerging and established comedians',
      slug: 'comedy-showcase'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Rock Concert Series',
      description: 'Monthly rock concert series featuring different bands each month',
      slug: 'rock-concert-series'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Classical Orchestra Performance',
      description: 'Symphony orchestra performing classical masterpieces',
      slug: 'classical-orchestra-performance'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Electronic Dance Festival',
      description: 'All-night electronic music dance party with top DJs',
      slug: 'electronic-dance-festival'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Folk Music Gathering',
      description: 'Acoustic folk music in an intimate coffeehouse setting',
      slug: 'folk-music-gathering'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Hip Hop Showcase',
      description: 'Underground hip hop artists showcase with live battles',
      slug: 'hip-hop-showcase'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Country Music Night',
      description: 'Country music celebration with line dancing and live bands',
      slug: 'country-music-night'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Opera Performance',
      description: 'Classic opera performance with full orchestra and costumes',
      slug: 'opera-performance'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'Indie Rock Festival',
      description: 'Independent rock artists festival showcasing emerging talent',
      slug: 'indie-rock-festival'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      organizer_id: '00000000-0000-0000-0000-000000000002',
      title: 'World Music Celebration',
      description: 'Celebrating music from around the world with diverse performers',
      slug: 'world-music-celebration'
    }
  ];

  let successCount = 0;
  
  for (let event of events) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select();
    
    if (error) {
      console.error('❌ Error inserting event:', event.title, ':', error.message);
    } else {
      console.log('✅ Inserted event:', event.title);
      successCount++;
    }
  }
  
  return successCount;
}

async function seedPerformers() {
  console.log('🎤 Seeding performers with correct schema...');
  
  const performers = [
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'The Midnight Express',
      slug: 'the-midnight-express'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Sarah Jazz Quintet',
      slug: 'sarah-jazz-quintet'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Comedy Central Mike',
      slug: 'comedy-central-mike'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Electric Pulse DJ',
      slug: 'electric-pulse-dj'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Classical Strings Quartet',
      slug: 'classical-strings-quartet'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Folk Stories Trio',
      slug: 'folk-stories-trio'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Hip Hop Collective',
      slug: 'hip-hop-collective'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Country Roads Band',
      slug: 'country-roads-band'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Opera Prima Donna',
      slug: 'opera-prima-donna'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Indie Rock Revival',
      slug: 'indie-rock-revival'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'World Beat Ensemble',
      slug: 'world-beat-ensemble'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Magic Mike Magician',
      slug: 'magic-mike-magician'
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
  console.log('🌱 Starting FINAL database seeding with correct schema...');
  
  try {
    const venueCount = await seedVenues();
    console.log(`\n📊 Venues seeded: ${venueCount}/12`);
    
    const eventCount = await seedEvents();
    console.log(`📊 Events seeded: ${eventCount}/12`);
    
    const performerCount = await seedPerformers();
    console.log(`📊 Performers seeded: ${performerCount}/12`);
    
    console.log('\n✅ Database seeding completed!');
    console.log(`📈 Total records created: ${venueCount + eventCount + performerCount}`);
    
    if (venueCount > 0 || eventCount > 0 || performerCount > 0) {
      console.log('\n🎉 SUCCESS! The database now has data for the app to display.');
      console.log('You can now visit the production app and see actual data!');
    }
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
}

main().catch(console.error);