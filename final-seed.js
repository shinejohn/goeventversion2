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

async function createMockAccount() {
  // Create a demo account first
  const { data: account, error } = await supabase
    .from('accounts')
    .insert({
      name: 'GoEventCity Demo Account',
      is_personal_account: false,
      primary_owner_user_id: '00000000-0000-0000-0000-000000000002'
    })
    .select()
    .single();
    
  if (error) {
    console.log('Account already exists or error:', error.message);
    return '00000000-0000-0000-0000-000000000001'; // Use mock ID
  }
  
  console.log('✅ Created demo account:', account.id);
  return account.id;
}

async function seedVenues(accountId) {
  console.log('🏢 Seeding venues...');
  
  const venues = [
    {
      community_id: accountId,
      name: 'Madison Square Garden',
      description: 'Famous arena in New York City',
      slug: 'madison-square-garden'
    },
    {
      community_id: accountId,
      name: 'Hollywood Bowl',
      description: 'Iconic outdoor amphitheater',
      slug: 'hollywood-bowl'
    },
    {
      community_id: accountId,
      name: 'The Beacon Theatre',
      description: 'Historic Upper West Side theater',
      slug: 'beacon-theatre'
    },
    {
      community_id: accountId,
      name: 'Red Rocks Amphitheatre',
      description: 'Natural rock formation venue',
      slug: 'red-rocks-amphitheatre'
    },
    {
      community_id: accountId,
      name: 'The Fillmore',
      description: 'Historic music venue in San Francisco',
      slug: 'the-fillmore'
    },
    {
      community_id: accountId,
      name: 'Austin City Limits Live',
      description: 'Premier music venue in Austin',
      slug: 'austin-city-limits-live'
    },
    {
      community_id: accountId,
      name: 'Chicago Theatre',
      description: 'Historic landmark theater',
      slug: 'chicago-theatre'
    },
    {
      community_id: accountId,
      name: 'The Gorge Amphitheatre',
      description: 'Scenic outdoor venue',
      slug: 'the-gorge-amphitheatre'
    },
    {
      community_id: accountId,
      name: 'The Ryman Auditorium',
      description: 'Mother Church of Country Music',
      slug: 'ryman-auditorium'
    },
    {
      community_id: accountId,
      name: 'House of Blues Houston',
      description: 'Intimate music venue',
      slug: 'house-of-blues-houston'
    },
    {
      community_id: accountId,
      name: 'The Greek Theatre Berkeley',
      description: 'Historic outdoor amphitheater',
      slug: 'the-greek-theatre-berkeley'
    },
    {
      community_id: accountId,
      name: 'Warehouse Live Houston',
      description: 'Multi-room concert venue',
      slug: 'warehouse-live-houston'
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

async function seedEvents(accountId) {
  console.log('🎭 Seeding events...');
  
  const events = [
    {
      community_id: accountId,
      name: 'Summer Music Festival',
      description: 'Multi-day outdoor music festival',
      slug: 'summer-music-festival'
    },
    {
      community_id: accountId,
      name: 'Jazz Night at the Blue Moon',
      description: 'Intimate jazz performance',
      slug: 'jazz-night-blue-moon'
    },
    {
      community_id: accountId,
      name: 'Comedy Showcase',
      description: 'Stand-up comedy night',
      slug: 'comedy-showcase'
    },
    {
      community_id: accountId,
      name: 'Rock Concert Series',
      description: 'Monthly rock concert series',
      slug: 'rock-concert-series'
    },
    {
      community_id: accountId,
      name: 'Classical Orchestra Performance',
      description: 'Symphony orchestra performing',
      slug: 'classical-orchestra-performance'
    },
    {
      community_id: accountId,
      name: 'Electronic Dance Festival',
      description: 'All-night electronic music',
      slug: 'electronic-dance-festival'
    },
    {
      community_id: accountId,
      name: 'Folk Music Gathering',
      description: 'Acoustic folk music',
      slug: 'folk-music-gathering'
    },
    {
      community_id: accountId,
      name: 'Hip Hop Showcase',
      description: 'Underground hip hop artists',
      slug: 'hip-hop-showcase'
    },
    {
      community_id: accountId,
      name: 'Country Music Night',
      description: 'Country music celebration',
      slug: 'country-music-night'
    },
    {
      community_id: accountId,
      name: 'Opera Performance',
      description: 'Classic opera performance',
      slug: 'opera-performance'
    },
    {
      community_id: accountId,
      name: 'Indie Rock Festival',
      description: 'Independent rock artists',
      slug: 'indie-rock-festival'
    },
    {
      community_id: accountId,
      name: 'World Music Celebration',
      description: 'Celebrating music from around the world',
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
      console.error('❌ Error inserting event:', event.name, ':', error.message);
    } else {
      console.log('✅ Inserted event:', event.name);
      successCount++;
    }
  }
  
  return successCount;
}

async function seedPerformers(accountId) {
  console.log('🎤 Seeding performers...');
  
  const performers = [
    {
      community_id: accountId,
      name: 'The Midnight Express',
      description: 'High-energy rock band',
      slug: 'the-midnight-express'
    },
    {
      community_id: accountId,
      name: 'Sarah Jazz Quintet',
      description: 'Smooth jazz ensemble',
      slug: 'sarah-jazz-quintet'
    },
    {
      community_id: accountId,
      name: 'Comedy Central Mike',
      description: 'Stand-up comedian',
      slug: 'comedy-central-mike'
    },
    {
      community_id: accountId,
      name: 'Electric Pulse DJ',
      description: 'Electronic music DJ',
      slug: 'electric-pulse-dj'
    },
    {
      community_id: accountId,
      name: 'Classical Strings Quartet',
      description: 'Professional classical quartet',
      slug: 'classical-strings-quartet'
    },
    {
      community_id: accountId,
      name: 'Folk Stories Trio',
      description: 'Acoustic folk trio',
      slug: 'folk-stories-trio'
    },
    {
      community_id: accountId,
      name: 'Hip Hop Collective',
      description: 'Underground hip hop artists',
      slug: 'hip-hop-collective'
    },
    {
      community_id: accountId,
      name: 'Country Roads Band',
      description: 'Traditional country music',
      slug: 'country-roads-band'
    },
    {
      community_id: accountId,
      name: 'Opera Prima Donna',
      description: 'Professional opera singer',
      slug: 'opera-prima-donna'
    },
    {
      community_id: accountId,
      name: 'Indie Rock Revival',
      description: 'Independent rock band',
      slug: 'indie-rock-revival'
    },
    {
      community_id: accountId,
      name: 'World Beat Ensemble',
      description: 'Multi-cultural music ensemble',
      slug: 'world-beat-ensemble'
    },
    {
      community_id: accountId,
      name: 'Magic Mike Magician',
      description: 'Professional magician',
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
  console.log('🌱 Starting comprehensive database seeding...');
  
  try {
    const accountId = await createMockAccount();
    
    const venueCount = await seedVenues(accountId);
    console.log(`\n📊 Venues seeded: ${venueCount}/12`);
    
    const eventCount = await seedEvents(accountId);
    console.log(`📊 Events seeded: ${eventCount}/12`);
    
    const performerCount = await seedPerformers(accountId);
    console.log(`📊 Performers seeded: ${performerCount}/12`);
    
    console.log('\n✅ Database seeding completed!');
    console.log(`📈 Total records created: ${venueCount + eventCount + performerCount}`);
    
    if (venueCount > 0 || eventCount > 0 || performerCount > 0) {
      console.log('\n🎉 SUCCESS! The database now has data for the app to display.');
      console.log('You can now visit the app and see:');
      console.log('- /venues - Lists of venues');
      console.log('- /events - Lists of events'); 
      console.log('- /performers - Lists of performers');
    }
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
}

main().catch(console.error);