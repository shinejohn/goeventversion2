import { createClient } from '@supabase/supabase-js';

// Production credentials
const PRODUCTION_SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const PRODUCTION_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(PRODUCTION_SUPABASE_URL, PRODUCTION_SERVICE_ROLE_KEY);

async function populateTestData() {
  console.log('🚀 Starting to populate test data...\n');

  try {
    // ========================================
    // 1. UPDATE EVENTS WITH CORRECTED FIELDS
    // ========================================
    console.log('📅 Updating Events with test data...');
    
    // Get a few events to update
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id')
      .limit(3);
      
    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return;
    }
    
    if (events && events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        const eventUpdate = {
          // Existing fields with correct names
          age_restriction: i === 0 ? '21+' : i === 1 ? '18+' : 'All Ages',
          price_min: 25 + (i * 10), // $25, $35, $45
          
          // Fields that will be added in migration
          // latitude: 40.7128 + (i * 0.01),
          // longitude: -74.0060 + (i * 0.01),
          // ticket_url: `https://tickets.example.com/event/${events[i].id}`,
          // highlights: ['Live Music', 'Food & Drinks', 'Meet & Greet'],
        };
        
        const { error } = await supabase
          .from('events')
          .update(eventUpdate)
          .eq('id', events[i].id);
          
        if (error) {
          console.error(`Error updating event ${i}:`, error);
        } else {
          console.log(`✅ Updated event ${i} with test data`);
        }
      }
    }
    
    // ========================================
    // 2. UPDATE VENUES WITH CORRECTED FIELDS
    // ========================================
    console.log('\n🏛️ Updating Venues with test data...');
    
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id')
      .limit(3);
      
    if (venuesError) {
      console.error('Error fetching venues:', venuesError);
      return;
    }
    
    if (venues && venues.length > 0) {
      for (let i = 0; i < venues.length; i++) {
        const venueUpdate = {
          // Existing fields with correct names
          image_url: `https://picsum.photos/800/600?random=${i + 100}`,
          pricePerHour: 100 + (i * 50), // $100, $150, $200
          max_capacity: 100 + (i * 50), // 100, 150, 200
          
          // Fields that will be added in migration
          // latitude: 40.7580 + (i * 0.01),
          // longitude: -73.9855 + (i * 0.01),
          // parking_info: {
          //   type: i === 0 ? 'garage' : i === 1 ? 'lot' : 'street',
          //   capacity: i === 0 ? 200 : i === 1 ? 100 : 0,
          //   cost: i === 0 ? '$20/day' : i === 1 ? '$15/day' : 'Free',
          //   distance: i === 0 ? '50 feet' : i === 1 ? '100 feet' : 'Adjacent'
          // },
          // transit_options: [
          //   { type: 'subway', lines: ['A', 'C', 'E'], distance: '2 blocks' },
          //   { type: 'bus', lines: ['M15', 'M20'], distance: '1 block' }
          // ],
        };
        
        const { error } = await supabase
          .from('venues')
          .update(venueUpdate)
          .eq('id', venues[i].id);
          
        if (error) {
          console.error(`Error updating venue ${i}:`, error);
        } else {
          console.log(`✅ Updated venue ${i} with test data`);
        }
      }
    }
    
    // ========================================
    // 3. UPDATE PERFORMERS WITH CORRECTED FIELDS
    // ========================================
    console.log('\n🎭 Updating Performers with test data...');
    
    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .select('id')
      .limit(3);
      
    if (performersError) {
      console.error('Error fetching performers:', performersError);
      return;
    }
    
    if (performers && performers.length > 0) {
      for (let i = 0; i < performers.length; i++) {
        const performerUpdate = {
          // Existing fields with correct names
          image: `https://picsum.photos/400/400?random=${i + 200}`,
          social_links: {
            instagram: `@testperformer${i}`,
            facebook: `testperformer${i}`,
            twitter: `@testperf${i}`,
            youtube: `testperformer${i}channel`
          },
          base_price: 200 + (i * 100), // $200, $300, $400
          shows_played: 50 + (i * 25), // 50, 75, 100
          years_active: 3 + i, // 3, 4, 5 years
          responseTime: i === 0 ? '1 hour' : i === 1 ? '2 hours' : '24 hours',
          
          // Fields that will be added in migration
          // technical_requirements: 'Professional sound system, 2 wireless microphones, stage lighting',
          // media_gallery: [
          //   { type: 'image', url: `https://picsum.photos/800/600?random=${i + 300}`, caption: 'Live performance' },
          //   { type: 'video', url: 'https://youtube.com/watch?v=example', caption: 'Demo reel' }
          // ],
        };
        
        const { error } = await supabase
          .from('performers')
          .update(performerUpdate)
          .eq('id', performers[i].id);
          
        if (error) {
          console.error(`Error updating performer ${i}:`, error);
        } else {
          console.log(`✅ Updated performer ${i} with test data`);
        }
      }
    }
    
    // ========================================
    // 4. CREATE TEST DATA THAT WE CAN TRACE
    // ========================================
    console.log('\n🎯 Creating traceable test data...');
    
    // Create a test event with all fields populated
    const testEventData = {
      title: 'CLAUDE TEST EVENT - Summer Festival 2025',
      slug: 'claude-test-summer-festival-2025',
      description: 'This is a test event created by Claude AI to verify field mappings',
      category: 'music',
      status: 'published',
      start_datetime: '2025-06-15T18:00:00',
      end_datetime: '2025-06-15T23:00:00',
      
      // Existing fields with CORRECT names
      age_restriction: '21+', // NOT age_restrictions
      price_min: 45, // This is what UI calls ticket_price
      price_max: 125,
      
      // Location fields
      city: 'New York',
      state: 'NY',
      address: '123 Test Street',
      
      // Other existing fields
      image_url: 'https://picsum.photos/800/600?random=claude-event',
      max_capacity: 500,
      is_featured: true,
      
      // Fields we'll add later
      // latitude: 40.7128,
      // longitude: -74.0060,
      // ticket_url: 'https://tickets.example.com/claude-test',
      // highlights: ['Test Feature 1', 'Test Feature 2', 'Test Feature 3'],
    };
    
    const { data: newEvent, error: newEventError } = await supabase
      .from('events')
      .insert([testEventData])
      .select()
      .single();
      
    if (newEventError) {
      console.error('Error creating test event:', newEventError);
    } else {
      console.log('✅ Created traceable test event:', newEvent.title);
      console.log('   ID:', newEvent.id);
    }
    
    // Create a test venue
    const testVenueData = {
      name: 'CLAUDE TEST VENUE - Grand Theater',
      slug: 'claude-test-grand-theater',
      description: 'Test venue created by Claude AI for field verification',
      venue_type: 'theater',
      
      // Existing fields with CORRECT names
      image_url: 'https://picsum.photos/800/600?random=claude-venue', // NOT profile_image_url
      pricePerHour: 250, // NOT base_hourly_rate
      max_capacity: 300, // NOT capacity
      
      // Location
      address: '456 Test Avenue',
      city: 'Brooklyn',
      state: 'NY',
      
      // Other existing fields
      is_active: true,
      is_verified: true,
      amenities: ['WiFi', 'Parking', 'Catering', 'Sound System'],
      
      // Fields we'll add later
      // latitude: 40.6782,
      // longitude: -73.9442,
      // parking_info: { type: 'garage', capacity: 100, cost: '$25/day', distance: 'Adjacent' },
      // transit_options: [{ type: 'subway', lines: ['L', 'G'], distance: '1 block' }],
    };
    
    const { data: newVenue, error: newVenueError } = await supabase
      .from('venues')
      .insert([testVenueData])
      .select()
      .single();
      
    if (newVenueError) {
      console.error('Error creating test venue:', newVenueError);
    } else {
      console.log('✅ Created traceable test venue:', newVenue.name);
      console.log('   ID:', newVenue.id);
    }
    
    // Create a test performer
    const testPerformerData = {
      name: 'CLAUDE TEST PERFORMER',
      stage_name: 'DJ Claude AI',
      category: 'dj',
      bio: 'Test performer created by Claude AI for database field testing',
      
      // Existing fields with CORRECT names
      image: 'https://picsum.photos/400/400?random=claude-performer', // NOT profile_image_url
      social_links: { // NOT social_media
        instagram: '@djclaudeai',
        facebook: 'djclaudeai',
        twitter: '@djclaudeai'
      },
      base_price: 500, // NOT base_rate
      shows_played: 100, // NOT total_performances
      years_active: 5, // NOT years_experience
      responseTime: '1 hour', // NOT average_response_time
      
      // Other existing fields
      verified: true,
      rating: 4.8,
      available_for_private_events: true,
      genres: ['Electronic', 'House', 'Techno'],
      
      // Fields we'll add later
      // technical_requirements: 'CDJ-3000s, DJM-900NXS2 mixer, monitor speakers',
      // media_gallery: [{ type: 'image', url: 'https://example.com/gallery1.jpg' }],
    };
    
    const { data: newPerformer, error: newPerformerError } = await supabase
      .from('performers')
      .insert([testPerformerData])
      .select()
      .single();
      
    if (newPerformerError) {
      console.error('Error creating test performer:', newPerformerError);
    } else {
      console.log('✅ Created traceable test performer:', newPerformer.stage_name);
      console.log('   ID:', newPerformer.id);
    }
    
    // ========================================
    // 5. SUMMARY
    // ========================================
    console.log('\n📊 Test Data Population Summary:');
    console.log('- Updated existing events with correct field values');
    console.log('- Updated existing venues with correct field values');
    console.log('- Updated existing performers with correct field values');
    console.log('- Created traceable test records (look for "CLAUDE TEST" prefix)');
    console.log('\n✨ Test data population complete!');
    
    console.log('\n🔍 You can now test by searching for:');
    console.log('- Events: "CLAUDE TEST EVENT"');
    console.log('- Venues: "CLAUDE TEST VENUE"');
    console.log('- Performers: "CLAUDE TEST PERFORMER" or "DJ Claude AI"');
    
  } catch (error) {
    console.error('❌ Error populating test data:', error);
  }
}

// Run the population
populateTestData();