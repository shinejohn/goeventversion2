const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function completePopulation() {
  console.log('🔄 Complete database population with all requirements...\n');

  // Step 1: Create community_hubs table if it doesn't exist
  console.log('1️⃣ Checking for community_hubs table...');
  try {
    const { data, error } = await supabase.from('community_hubs').select('id').limit(1);
    if (error && error.message.includes('does not exist')) {
      console.log('❌ community_hubs table does not exist');
      console.log('⚠️  You need to manually create the community_hubs table in Supabase SQL Editor:');
      console.log(`
CREATE TABLE public.community_hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
      `);
    } else {
      console.log('✅ community_hubs table exists');
    }
  } catch (err) {
    console.log('⚠️  community_hubs table issue:', err.message);
  }

  // Step 2: Insert default community
  console.log('\n2️⃣ Creating default community...');
  try {
    const { data, error } = await supabase.from('community_hubs').insert({
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Default Community',
      description: 'Default community for testing',
      slug: 'default-community'
    });
    
    if (error) {
      if (error.message.includes('duplicate key')) {
        console.log('✅ Default community already exists');
      } else {
        console.log('❌ Community insert error:', error.message);
        return;
      }
    } else {
      console.log('✅ Default community created');
    }
  } catch (err) {
    console.log('❌ Community error:', err.message);
    return;
  }

  // Step 3: Insert 12 venues with correct schema
  console.log('\n3️⃣ Inserting 12 venues...');
  const venueData = [
    { name: 'Madison Square Garden', description: 'Famous arena in New York City', slug: 'madison-square-garden', address: '4 Pennsylvania Plaza, New York, NY 10001', location: 'POINT(-73.9934 40.7505)' },
    { name: 'Hollywood Bowl', description: 'Iconic outdoor amphitheater', slug: 'hollywood-bowl', address: '2301 N Highland Ave, Los Angeles, CA 90068', location: 'POINT(-118.3398 34.1122)' },
    { name: 'The Beacon Theatre', description: 'Historic Upper West Side theater', slug: 'beacon-theatre', address: '2124 Broadway, New York, NY 10023', location: 'POINT(-73.9821 40.7796)' },
    { name: 'Red Rocks Amphitheatre', description: 'Natural rock formation venue', slug: 'red-rocks-amphitheatre', address: '18300 W Alameda Pkwy, Morrison, CO 80465', location: 'POINT(-105.2058 39.6654)' },
    { name: 'The Fillmore', description: 'Historic music venue in San Francisco', slug: 'the-fillmore', address: '1805 Geary Blvd, San Francisco, CA 94115', location: 'POINT(-122.4330 37.7849)' },
    { name: 'Austin City Limits Live', description: 'Premier music venue in Austin', slug: 'austin-city-limits-live', address: '310 Willie Nelson Blvd, Austin, TX 78701', location: 'POINT(-97.7431 30.2672)' },
    { name: 'Chicago Theatre', description: 'Historic landmark theater', slug: 'chicago-theatre', address: '175 N State St, Chicago, IL 60601', location: 'POINT(-87.6298 41.8781)' },
    { name: 'The Gorge Amphitheatre', description: 'Scenic outdoor venue', slug: 'the-gorge-amphitheatre', address: '754 Silica Rd NW, Quincy, WA 98848', location: 'POINT(-119.9945 47.0987)' },
    { name: 'The Ryman Auditorium', description: 'Mother Church of Country Music', slug: 'ryman-auditorium', address: '116 Rep John Lewis Way N, Nashville, TN 37219', location: 'POINT(-86.7816 36.1627)' },
    { name: 'House of Blues Houston', description: 'Intimate music venue', slug: 'house-of-blues-houston', address: '1204 Caroline St, Houston, TX 77002', location: 'POINT(-95.3698 29.7604)' },
    { name: 'The Greek Theatre Berkeley', description: 'Historic outdoor amphitheater', slug: 'the-greek-theatre-berkeley', address: '2001 Gayley Rd, Berkeley, CA 94720', location: 'POINT(-122.2543 37.8735)' },
    { name: 'Warehouse Live Houston', description: 'Multi-room concert venue', slug: 'warehouse-live-houston', address: '813 St Emanuel St, Houston, TX 77003', location: 'POINT(-95.3605 29.7589)' }
  ];

  let venueCount = 0;
  for (const venue of venueData) {
    try {
      const { error } = await supabase.from('venues').insert({
        community_id: '00000000-0000-0000-0000-000000000001',
        venue_type: 1, // Required field
        ...venue
      });
      
      if (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️  ${venue.name} already exists`);
          venueCount++;
        } else {
          console.log(`❌ ${venue.name} error:`, error.message);
        }
      } else {
        console.log(`✅ ${venue.name} inserted`);
        venueCount++;
      }
    } catch (err) {
      console.log(`❌ ${venue.name} error:`, err.message);
    }
  }

  // Step 4: Insert 12 events with both start and end datetime
  console.log('\n4️⃣ Inserting 12 events...');
  const eventData = [
    { title: 'Summer Music Festival', description: 'Multi-day outdoor music festival', slug: 'summer-music-festival', start_datetime: '2024-07-15T18:00:00Z', end_datetime: '2024-07-17T23:00:00Z' },
    { title: 'Jazz Night at the Blue Moon', description: 'Intimate jazz performance', slug: 'jazz-night-blue-moon', start_datetime: '2024-06-20T20:00:00Z', end_datetime: '2024-06-20T23:30:00Z' },
    { title: 'Comedy Showcase', description: 'Stand-up comedy night', slug: 'comedy-showcase', start_datetime: '2024-06-25T19:30:00Z', end_datetime: '2024-06-25T22:00:00Z' },
    { title: 'Rock Concert Series', description: 'Monthly rock concert series', slug: 'rock-concert-series', start_datetime: '2024-07-05T19:00:00Z', end_datetime: '2024-07-05T23:00:00Z' },
    { title: 'Classical Orchestra Performance', description: 'Symphony orchestra performing', slug: 'classical-orchestra-performance', start_datetime: '2024-06-30T19:30:00Z', end_datetime: '2024-06-30T22:00:00Z' },
    { title: 'Electronic Dance Festival', description: 'All-night electronic music', slug: 'electronic-dance-festival', start_datetime: '2024-08-10T21:00:00Z', end_datetime: '2024-08-11T06:00:00Z' },
    { title: 'Folk Music Gathering', description: 'Acoustic folk music', slug: 'folk-music-gathering', start_datetime: '2024-07-12T18:00:00Z', end_datetime: '2024-07-12T21:00:00Z' },
    { title: 'Hip Hop Showcase', description: 'Underground hip hop artists', slug: 'hip-hop-showcase', start_datetime: '2024-07-18T20:00:00Z', end_datetime: '2024-07-18T23:30:00Z' },
    { title: 'Country Music Night', description: 'Country music celebration', slug: 'country-music-night', start_datetime: '2024-07-22T19:00:00Z', end_datetime: '2024-07-22T23:00:00Z' },
    { title: 'Opera Performance', description: 'Classic opera performance', slug: 'opera-performance', start_datetime: '2024-08-05T19:00:00Z', end_datetime: '2024-08-05T22:30:00Z' },
    { title: 'Indie Rock Festival', description: 'Independent rock artists', slug: 'indie-rock-festival', start_datetime: '2024-08-15T17:00:00Z', end_datetime: '2024-08-15T23:00:00Z' },
    { title: 'World Music Celebration', description: 'Music from around the world', slug: 'world-music-celebration', start_datetime: '2024-08-20T18:00:00Z', end_datetime: '2024-08-20T22:00:00Z' }
  ];

  let eventCount = 0;
  for (const event of eventData) {
    try {
      const { error } = await supabase.from('events').insert({
        community_id: '00000000-0000-0000-0000-000000000001',
        organizer_id: '00000000-0000-0000-0000-000000000002', // Required field
        category: 'music', // Required field
        ...event
      });
      
      if (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️  ${event.title} already exists`);
          eventCount++;
        } else {
          console.log(`❌ ${event.title} error:`, error.message);
        }
      } else {
        console.log(`✅ ${event.title} inserted`);
        eventCount++;
      }
    } catch (err) {
      console.log(`❌ ${event.title} error:`, err.message);
    }
  }

  // Final summary
  console.log('\n🎉 FINAL SUMMARY:');
  const { data: finalVenues } = await supabase.from('venues').select('id');
  const { data: finalEvents } = await supabase.from('events').select('id'); 
  const { data: finalPerformers } = await supabase.from('performers').select('id');
  
  console.log(`📊 Venues: ${finalVenues?.length || 0}/12 records`);
  console.log(`📊 Events: ${finalEvents?.length || 0}/12 records`);
  console.log(`📊 Performers: ${finalPerformers?.length || 0}/12 records`);
  
  if (finalVenues?.length >= 12 && finalEvents?.length >= 12 && finalPerformers?.length >= 12) {
    console.log('\n🎊 SUCCESS! All tables now have 12+ records each!');
  } else {
    console.log('\n⚠️  Some tables still need more records. Check the errors above.');
  }
}

completePopulation().catch(console.error);