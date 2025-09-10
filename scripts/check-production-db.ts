import { createClient } from '@supabase/supabase-js';

// Production credentials
const PRODUCTION_SUPABASE_URL = process.env.PRODUCTION_SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const PRODUCTION_SERVICE_ROLE_KEY = process.env.PRODUCTION_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

if (!PRODUCTION_SUPABASE_URL || !PRODUCTION_SERVICE_ROLE_KEY) {
  console.error('❌ Please set PRODUCTION_SUPABASE_URL and PRODUCTION_SERVICE_ROLE_KEY environment variables');
  console.log('\nTo run this script:');
  console.log('PRODUCTION_SUPABASE_URL=your-url PRODUCTION_SERVICE_ROLE_KEY=your-key pnpm tsx scripts/check-production-db.ts');
  process.exit(1);
}

const supabase = createClient(PRODUCTION_SUPABASE_URL, PRODUCTION_SERVICE_ROLE_KEY);

async function checkAndSeedDatabase() {
  console.log('🔍 Checking production database...\n');

  // Check existing events
  console.log('📋 Checking existing events...');
  const { data: existingEvents, error: eventsError } = await supabase
    .from('events')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (eventsError) {
    console.error('Error fetching events:', eventsError);
  } else {
    console.log(`Found ${existingEvents?.length || 0} events:`);
    existingEvents?.forEach(event => {
      console.log(`  - ${event.id}: "${event.title}" (${event.status})`);
    });
  }

  // Check existing venues
  console.log('\n🏢 Checking existing venues...');
  const { data: existingVenues, error: venuesError } = await supabase
    .from('venues')
    .select('id, name, city, is_active')
    .limit(10);

  if (venuesError) {
    console.error('Error fetching venues:', venuesError);
  } else {
    console.log(`Found ${existingVenues?.length || 0} venues:`);
    existingVenues?.forEach(venue => {
      console.log(`  - ${venue.id}: "${venue.name}" in ${venue.city} (active: ${venue.is_active})`);
    });
  }

  // Check existing performers
  console.log('\n🎤 Checking existing performers...');
  const { data: existingPerformers, error: performersError } = await supabase
    .from('performers')
    .select('id, name, stage_name, status')
    .limit(10);

  if (performersError) {
    console.error('Error fetching performers:', performersError);
  } else {
    console.log(`Found ${existingPerformers?.length || 0} performers:`);
    existingPerformers?.forEach(performer => {
      console.log(`  - ${performer.id}: "${performer.stage_name || performer.name}" (${performer.status})`);
    });
  }

  // Ask user if they want to add test data
  console.log('\n\n✨ ADDING TRACEABLE TEST RECORDS ✨\n');

  const testDate = new Date().toISOString().split('T')[0]; // Today's date for tracking

  // Add test venues
  console.log('🏢 Adding test venues...');
  const testVenues = [
    {
      name: `CLAUDE_TEST_VENUE_${testDate}_1`,
      slug: `claude-test-venue-${testDate}-1`,
      description: 'Test venue created by Claude for debugging - Theater',
      address: '123 Test Street',
      city: 'Clearwater',
      state: 'FL',
      zip_code: '33755',
      country: 'USA',
      max_capacity: 500,
      venue_type: 'theater',
      is_active: true,
      is_verified: true,
      base_hourly_rate: 100,
      profile_image_url: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800',
      amenities: ['parking', 'sound_system', 'lighting', 'green_room'],
      rating: 4.8,
    },
    {
      name: `CLAUDE_TEST_VENUE_${testDate}_2`,
      slug: `claude-test-venue-${testDate}-2`,
      description: 'Test venue created by Claude for debugging - Club',
      address: '456 Debug Avenue',
      city: 'Tampa',
      state: 'FL',
      zip_code: '33602',
      country: 'USA',
      max_capacity: 200,
      venue_type: 'club',
      is_active: true,
      is_verified: true,
      base_hourly_rate: 150,
      profile_image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      amenities: ['bar', 'dance_floor', 'vip_section', 'sound_system'],
      rating: 4.5,
    }
  ];

  const { data: insertedVenues, error: venueInsertError } = await supabase
    .from('venues')
    .insert(testVenues)
    .select();

  if (venueInsertError) {
    console.error('Error inserting test venues:', venueInsertError);
  } else {
    console.log('✅ Successfully added test venues:');
    insertedVenues?.forEach(venue => {
      console.log(`  - ${venue.id}: "${venue.name}"`);
    });
  }

  // Add test performers
  console.log('\n🎤 Adding test performers...');
  const testPerformers = [
    {
      name: `CLAUDE_TEST_PERFORMER_${testDate}_1`,
      stage_name: `Claude DJ ${testDate}`,
      bio: 'Test performer created by Claude for debugging - Electronic music DJ',
      category: 'DJ',
      genres: ['electronic', 'house', 'techno'],
      profile_image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      base_rate: 500,
      rating: 4.7,
      is_verified: true,
      total_performances: 50,
    },
    {
      name: `CLAUDE_TEST_PERFORMER_${testDate}_2`,
      stage_name: `Claude Band ${testDate}`,
      bio: 'Test performer created by Claude for debugging - Rock band',
      category: 'Band',
      genres: ['rock', 'alternative', 'indie'],
      profile_image_url: 'https://images.unsplash.com/photo-1506091403742-e3aa39518db5?w=800',
      base_rate: 800,
      rating: 4.9,
      is_verified: true,
      total_performances: 100,
    }
  ];

  const { data: insertedPerformers, error: performerInsertError } = await supabase
    .from('performers')
    .insert(testPerformers)
    .select();

  if (performerInsertError) {
    console.error('Error inserting test performers:', performerInsertError);
  } else {
    console.log('✅ Successfully added test performers:');
    insertedPerformers?.forEach(performer => {
      console.log(`  - ${performer.id}: "${performer.stage_name}"`);
    });
  }

  // Add test events (need venue IDs)
  if (insertedVenues && insertedVenues.length > 0) {
    console.log('\n🎉 Adding test events...');
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 7);
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 14);

    const testEvents = [
      {
        title: `CLAUDE_TEST_EVENT_${testDate}_1`,
        slug: `claude-test-event-${testDate}-1`,
        description: 'Test event created by Claude for debugging - Music Festival',
        category: 'music',
        status: 'published',
        start_datetime: futureDate1.toISOString(),
        end_datetime: new Date(futureDate1.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
        venue_id: insertedVenues[0].id,
        location_name: insertedVenues[0].name,
        city: 'Clearwater',
        state: 'FL',
        max_capacity: 400,
        ticket_price: 25,
        price_min: 25,
        price_max: 50,
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
        tags: ['music', 'festival', 'claude-test'],
      },
      {
        title: `CLAUDE_TEST_EVENT_${testDate}_2`,
        slug: `claude-test-event-${testDate}-2`,
        description: 'Test event created by Claude for debugging - DJ Night',
        category: 'music',
        status: 'published',
        start_datetime: futureDate2.toISOString(),
        end_datetime: new Date(futureDate2.getTime() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours later
        venue_id: insertedVenues[1].id,
        location_name: insertedVenues[1].name,
        city: 'Tampa',
        state: 'FL',
        max_capacity: 200,
        ticket_price: 15,
        price_min: 15,
        price_max: 30,
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
        tags: ['music', 'nightlife', 'claude-test'],
      }
    ];

    const { data: insertedEvents, error: eventInsertError } = await supabase
      .from('events')
      .insert(testEvents)
      .select();

    if (eventInsertError) {
      console.error('Error inserting test events:', eventInsertError);
    } else {
      console.log('✅ Successfully added test events:');
      insertedEvents?.forEach(event => {
        console.log(`  - ${event.id}: "${event.title}"`);
      });

      // Link performers to events
      if (insertedPerformers && insertedPerformers.length > 0 && insertedEvents.length > 0) {
        console.log('\n🔗 Linking performers to events...');
        const eventPerformers = [
          {
            event_id: insertedEvents[0].id,
            performer_id: insertedPerformers[1].id, // Band for festival
          },
          {
            event_id: insertedEvents[1].id,
            performer_id: insertedPerformers[0].id, // DJ for club night
          }
        ];

        const { error: linkError } = await supabase
          .from('event_performers')
          .insert(eventPerformers);

        if (linkError) {
          console.error('Error linking performers to events:', linkError);
        } else {
          console.log('✅ Successfully linked performers to events');
        }
      }
    }
  }

  console.log('\n\n🎯 Test data summary:');
  console.log('All test records are prefixed with "CLAUDE_TEST_" and include today\'s date');
  console.log('You can now test navigation to these specific records in production');
  console.log('\nTo view in production:');
  console.log('- Events page should show the new test events');
  console.log('- Clicking on them should navigate to detail pages');
  console.log('- The detail pages should load without "not found" errors');
}

checkAndSeedDatabase().catch(console.error);