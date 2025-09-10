import { createClient } from '@supabase/supabase-js';

// Production credentials
const PRODUCTION_SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const PRODUCTION_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(PRODUCTION_SUPABASE_URL, PRODUCTION_SERVICE_ROLE_KEY);

async function addClaudeTestData() {
  console.log('✨ Adding Claude test data to production database ✨\n');
  
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
  // Add test venues with minimal fields
  console.log('🏢 Adding test venues...');
  const testVenues = [
    {
      name: `CLAUDE_TEST_VENUE_${timestamp}_THEATER`,
      slug: `claude-test-venue-${timestamp}-theater`,
      description: 'Test venue created by Claude - Theater in Clearwater',
      address: '789 Claude Test Blvd',
      city: 'Clearwater',
      state: 'FL',
      max_capacity: 500,
      venue_type: 'theater',
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800',
    },
    {
      name: `CLAUDE_TEST_VENUE_${timestamp}_CLUB`,
      slug: `claude-test-venue-${timestamp}-club`,
      description: 'Test venue created by Claude - Night Club in Tampa',
      address: '456 Claude Debug Ave',
      city: 'Tampa',
      state: 'FL',
      max_capacity: 300,
      venue_type: 'club',
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    }
  ];

  const { data: venues, error: venueError } = await supabase
    .from('venues')
    .insert(testVenues)
    .select();

  if (venueError) {
    console.error('❌ Error adding venues:', venueError);
  } else if (venues) {
    console.log('✅ Successfully added venues:');
    venues.forEach(v => console.log(`   - ${v.id}: ${v.name}`));
  }

  // Add test performers with minimal fields
  console.log('\n🎤 Adding test performers...');
  const testPerformers = [
    {
      name: `CLAUDE_TEST_PERFORMER_${timestamp}_DJ`,
      stage_name: `Claude Test DJ ${timestamp}`,
      bio: 'Test DJ created by Claude for debugging',
      genre: 'Electronic',
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      rating: 4.5,
    },
    {
      name: `CLAUDE_TEST_PERFORMER_${timestamp}_BAND`,
      stage_name: `Claude Test Band ${timestamp}`,
      bio: 'Test band created by Claude for debugging',
      genre: 'Rock',
      image_url: 'https://images.unsplash.com/photo-1506091403742-e3aa39518db5?w=800',
      rating: 4.8,
    }
  ];

  const { data: performers, error: performerError } = await supabase
    .from('performers')
    .insert(testPerformers)
    .select();

  if (performerError) {
    console.error('❌ Error adding performers:', performerError);
  } else if (performers) {
    console.log('✅ Successfully added performers:');
    performers.forEach(p => console.log(`   - ${p.id}: ${p.stage_name || p.name}`));
  }

  // Add test events
  if (venues && venues.length > 0) {
    console.log('\n🎉 Adding test events...');
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 14);
    
    const testEvents = [
      {
        title: `CLAUDE_TEST_EVENT_${timestamp}_FESTIVAL`,
        slug: `claude-test-event-${timestamp}-festival`,
        description: 'Test festival event created by Claude for debugging',
        category: 'Music',
        status: 'published',
        start_datetime: nextWeek.toISOString(),
        end_datetime: new Date(nextWeek.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        venue_id: venues[0].id,
        location_name: venues[0].name,
        city: 'Clearwater',
        state: 'FL',
        max_capacity: 400,
        image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
        price_min: 25,
        price_max: 75,
      },
      {
        title: `CLAUDE_TEST_EVENT_${timestamp}_DJNIGHT`,
        slug: `claude-test-event-${timestamp}-djnight`,
        description: 'Test DJ night created by Claude for debugging',
        category: 'Nightlife',
        status: 'published',
        start_datetime: twoWeeks.toISOString(),
        end_datetime: new Date(twoWeeks.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        venue_id: venues[1].id,
        location_name: venues[1].name,
        city: 'Tampa',
        state: 'FL',
        max_capacity: 200,
        image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
        price_min: 15,
        price_max: 30,
      }
    ];

    const { data: events, error: eventError } = await supabase
      .from('events')
      .insert(testEvents)
      .select();

    if (eventError) {
      console.error('❌ Error adding events:', eventError);
    } else if (events) {
      console.log('✅ Successfully added events:');
      events.forEach(e => console.log(`   - ${e.id}: ${e.title}`));
      
      // Link performers to events if both exist
      if (performers && performers.length > 0) {
        console.log('\n🔗 Linking performers to events...');
        const links = [
          { event_id: events[0].id, performer_id: performers[1].id },
          { event_id: events[1].id, performer_id: performers[0].id }
        ];
        
        const { error: linkError } = await supabase
          .from('event_performers')
          .insert(links);
          
        if (linkError) {
          console.error('❌ Error linking performers:', linkError);
        } else {
          console.log('✅ Successfully linked performers to events');
        }
      }
    }
  }
  
  console.log('\n\n🎯 Summary:');
  console.log(`All test data is prefixed with "CLAUDE_TEST_${timestamp}"`)
  console.log('You can now:');
  console.log('1. Visit https://goeventversion2-production.up.railway.app/events');
  console.log('2. Look for events starting with CLAUDE_TEST');
  console.log('3. Click on them to test if detail pages work');
  console.log('4. The URLs should work without "not found" errors');
}

addClaudeTestData()
  .then(() => console.log('\n✅ Script completed'))
  .catch(error => console.error('\n❌ Script failed:', error));