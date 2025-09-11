const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Supabase URL or Service Role Key is not set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Valid IDs from existing data
const ACCOUNT_ID = 'afafd084-52bd-41d7-a6a8-2f9f7970a0ba';
const COMMUNITY_ID = '6538108d-65e9-495a-b8f4-ffe5d317e4e7';
const ORGANIZER_ID = 'afafd084-52bd-41d7-a6a8-2f9f7970a0ba'; // Using account_id as organizer_id

// Enhanced performer data with all required fields
const enhancedPerformers = [
  {
    name: "The Midnight Jazz Quartet",
    stage_name: "The Midnight Jazz Quartet",
    slug: "midnight-jazz-quartet",
    bio: "A sophisticated jazz ensemble bringing smooth melodies and improvisational brilliance to every performance. With over 10 years of experience, we specialize in classic jazz standards and contemporary arrangements.",
    category: "Band",
    genres: ["jazz", "blues", "smooth jazz"],
    location: "New York, NY",
    home_city: "New York",
    rating: 4.8,
    reviews: 47,
    total_reviews: 47,
    price: "$800-1200",
    base_price: 1000,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    profile_image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    verified: true,
    availableForBooking: true,
    shows_played: 156,
    years_active: 10,
    next_performance: "2024-02-15T20:00:00Z",
    contact_email: "bookings@midnightjazz.com",
    contact_phone: "+1-555-0123",
    website_url: "https://midnightjazz.com",
    social_links: {
      instagram: "@midnightjazzquartet",
      facebook: "MidnightJazzQuartet",
      twitter: "@midnightjazz"
    },
    available_for_private_events: true,
    is_family_friendly: true,
    takes_requests: true,
    has_original_music: true,
    has_merchandise: true,
    offers_meet_and_greet: true,
    is_touring_now: false,
    follower_count: 12500,
    trending_score: 85,
    responseTime: "2 hours",
    created_at: "2023-01-15T10:00:00Z"
  },
  {
    name: "Sarah Chen",
    stage_name: "Sarah Chen",
    slug: "sarah-chen",
    bio: "Classically trained violinist with a passion for contemporary music. Sarah brings emotional depth and technical precision to every performance, whether playing solo or with orchestras.",
    category: "Musician",
    genres: ["classical", "contemporary", "film music"],
    location: "Los Angeles, CA",
    home_city: "Los Angeles",
    rating: 4.9,
    reviews: 32,
    total_reviews: 32,
    price: "$500-800",
    base_price: 650,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    profile_image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    verified: true,
    availableForBooking: true,
    shows_played: 89,
    years_active: 8,
    next_performance: "2024-02-20T19:30:00Z",
    contact_email: "sarah@sarahchenviolin.com",
    contact_phone: "+1-555-0124",
    website_url: "https://sarahchenviolin.com",
    social_links: {
      instagram: "@sarahchenviolin",
      facebook: "SarahChenViolin",
      youtube: "SarahChenMusic"
    },
    available_for_private_events: true,
    is_family_friendly: true,
    takes_requests: true,
    has_original_music: false,
    has_merchandise: false,
    offers_meet_and_greet: true,
    is_touring_now: true,
    follower_count: 8500,
    trending_score: 92,
    responseTime: "1 hour",
    created_at: "2023-03-10T14:30:00Z"
  },
  {
    name: "DJ Phoenix",
    stage_name: "DJ Phoenix",
    slug: "dj-phoenix",
    bio: "High-energy DJ specializing in electronic dance music, house, and techno. Known for seamless mixing and creating unforgettable party experiences. Available for clubs, festivals, and private events.",
    category: "DJ",
    genres: ["electronic", "house", "techno", "edm"],
    location: "Miami, FL",
    home_city: "Miami",
    rating: 4.7,
    reviews: 28,
    total_reviews: 28,
    price: "$400-600",
    base_price: 500,
    image: "https://images.unsplash.com/photo-1571266028243-e68f8570c9e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    profile_image_url: "https://images.unsplash.com/photo-1571266028243-e68f8570c9e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    verified: true,
    availableForBooking: true,
    shows_played: 203,
    years_active: 6,
    next_performance: "2024-02-18T22:00:00Z",
    contact_email: "bookings@djphoenix.com",
    contact_phone: "+1-555-0125",
    website_url: "https://djphoenix.com",
    social_links: {
      instagram: "@djphoenix",
      facebook: "DJPhoenixOfficial",
      soundcloud: "djphoenix"
    },
    available_for_private_events: true,
    is_family_friendly: false,
    takes_requests: true,
    has_original_music: true,
    has_merchandise: true,
    offers_meet_and_greet: false,
    is_touring_now: true,
    follower_count: 25000,
    trending_score: 88,
    responseTime: "4 hours",
    created_at: "2023-02-20T16:45:00Z"
  }
];

// Enhanced venue data
const enhancedVenues = [
  {
    account_id: ACCOUNT_ID,
    community_id: COMMUNITY_ID,
    name: "The Blue Note Jazz Club",
    slug: "blue-note-jazz-club",
    description: "Intimate jazz club featuring world-class performers in an elegant setting. Known for exceptional acoustics and sophisticated atmosphere.",
    address: "131 W 3rd St",
    city: "New York",
    state: "NY",
    country: "USA",
    location: "0101000020E61000002D86C50442985EC0F26CE2E49FE54240", // PostGIS point for NYC
    // zip_code: "10012", // Column doesn't exist
    booking_phone: "+1-212-475-8592",
    contact_email: "info@bluenote.net",
    website_url: "https://bluenote.net",
    capacity: 200,
    venueType: "jazz_club",
    venue_type: "jazz_club",
    amenities: ["full_bar", "dinner_service", "valet_parking", "coat_check"],
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    is_verified: true,
    is_active: true,
    rating: 4.8,
    review_count: 1247,
    price_range: 3,
    pricePerHour: 300,
    responseTimeHours: 2,
    created_at: "2023-01-01T00:00:00Z"
  },
  {
    account_id: ACCOUNT_ID,
    community_id: COMMUNITY_ID,
    name: "The Hollywood Bowl",
    slug: "hollywood-bowl",
    description: "Iconic outdoor amphitheater nestled in the Hollywood Hills. Features world-class acoustics and stunning views of Los Angeles.",
    address: "2301 N Highland Ave",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    location: "0101000020E6100000C0E78711C2B85DC0F26CE2E49FE54240", // PostGIS point for LA
    // zip_code: "90068", // Column doesn't exist
    booking_phone: "+1-323-850-2000",
    contact_email: "info@hollywoodbowl.com",
    website_url: "https://hollywoodbowl.com",
    capacity: 17500,
    venueType: "amphitheater",
    venue_type: "amphitheater",
    amenities: ["parking", "food_court", "gift_shop", "accessibility"],
    image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    is_verified: true,
    is_active: true,
    rating: 4.9,
    review_count: 8934,
    price_range: 4,
    pricePerHour: 1000,
    responseTimeHours: 4,
    created_at: "2023-01-01T00:00:00Z"
  },
  {
    account_id: ACCOUNT_ID,
    community_id: COMMUNITY_ID,
    name: "The Laugh Factory",
    slug: "laugh-factory",
    description: "Premier comedy club featuring top stand-up comedians. Intimate setting perfect for comedy shows and private events.",
    address: "8001 Sunset Blvd",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    location: "0101000020E6100000C0E78711C2B85DC0F26CE2E49FE54240", // PostGIS point for LA
    // zip_code: "90046", // Column doesn't exist
    booking_phone: "+1-323-656-1336",
    contact_email: "info@laughfactory.com",
    website_url: "https://laughfactory.com",
    capacity: 300,
    venueType: "comedy_club",
    venue_type: "comedy_club",
    amenities: ["full_bar", "food_service", "parking", "private_rooms"],
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    is_verified: true,
    is_active: true,
    rating: 4.7,
    review_count: 2156,
    price_range: 2,
    pricePerHour: 200,
    responseTimeHours: 1,
    created_at: "2023-01-01T00:00:00Z"
  }
];

// Enhanced events data
const enhancedEvents = [
  {
    community_id: COMMUNITY_ID,
    organizer_id: ORGANIZER_ID,
    title: "Jazz Night with The Midnight Quartet",
    slug: "jazz-night-midnight-quartet",
    description: "An evening of smooth jazz featuring The Midnight Jazz Quartet performing classic standards and contemporary arrangements.",
    start_datetime: "2024-02-15T20:00:00Z",
    end_datetime: "2024-02-15T23:00:00Z",
    timezone: "America/New_York",
    venue_id: null, // Will be updated after venue creation
    category: "music",
    requires_ticket: true,
    ticket_price: 45.00,
    capacity: 200,
    status: "published",
    visibility: "public",
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    is_public: true,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    community_id: COMMUNITY_ID,
    organizer_id: ORGANIZER_ID,
    title: "Sarah Chen Violin Recital",
    slug: "sarah-chen-violin-recital",
    description: "Classical violinist Sarah Chen presents an intimate recital featuring works by Bach, Vivaldi, and contemporary composers.",
    start_datetime: "2024-02-20T19:30:00Z",
    end_datetime: "2024-02-20T21:30:00Z",
    timezone: "America/Los_Angeles",
    venue_id: null, // Will be updated after venue creation
    category: "music",
    requires_ticket: true,
    ticket_price: 35.00,
    capacity: 500,
    status: "published",
    visibility: "public",
    image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    is_public: true,
    created_at: "2024-01-20T14:30:00Z"
  },
  {
    community_id: COMMUNITY_ID,
    organizer_id: ORGANIZER_ID,
    title: "DJ Phoenix Electronic Night",
    slug: "dj-phoenix-electronic-night",
    description: "High-energy electronic dance music night featuring DJ Phoenix with special guest performers and state-of-the-art lighting.",
    start_datetime: "2024-02-18T22:00:00Z",
    end_datetime: "2024-02-19T02:00:00Z",
    timezone: "America/Los_Angeles",
    venue_id: null, // Will be updated after venue creation
    category: "music",
    requires_ticket: true,
    ticket_price: 25.00,
    capacity: 1000,
    status: "published",
    visibility: "public",
    image_url: "https://images.unsplash.com/photo-1571266028243-e68f8570c9e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    is_public: true,
    created_at: "2024-01-18T16:45:00Z"
  }
];

async function enhanceDatabaseData() {
  console.log('🚀 Starting database data enhancement...');
  
  try {
    // 1. Skip clearing existing data to avoid conflicts
    console.log('ℹ️ Skipping data clearing to avoid conflicts...');
    
    // 2. Get existing venues
    console.log('🏢 Getting existing venues...');
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name')
      .limit(3);
    
    if (venuesError) {
      console.error('❌ Error fetching venues:', venuesError);
      return;
    }
    
    console.log(`✅ Found ${venues.length} existing venues`);
    
    // 3. Get existing performers
    console.log('🎭 Getting existing performers...');
    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .select('id, name')
      .limit(3);
    
    if (performersError) {
      console.error('❌ Error fetching performers:', performersError);
      return;
    }
    
    console.log(`✅ Found ${performers.length} existing performers`);
    
    // 4. Insert enhanced events
    console.log('🎪 Inserting enhanced events...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .insert(enhancedEvents)
      .select();
    
    if (eventsError) {
      console.error('❌ Error inserting events:', eventsError);
      return;
    }
    
    console.log(`✅ Inserted ${events.length} events`);
    
    // 5. Create event-performer relationships
    console.log('🔗 Creating event-performer relationships...');
    const eventPerformers = [];
    
    // Link performers to events
    events.forEach((event, eventIndex) => {
      const performerIndex = eventIndex % performers.length;
      eventPerformers.push({
        event_id: event.id,
        performer_id: performers[performerIndex].id
      });
    });
    
    const { error: eventPerformersError } = await supabase
      .from('event_performers')
      .insert(eventPerformers);
    
    if (eventPerformersError) {
      console.error('❌ Error inserting event-performers:', eventPerformersError);
      return;
    }
    
    console.log(`✅ Created ${eventPerformers.length} event-performer relationships`);
    
    // 6. Create some additional events for variety
    console.log('🎵 Creating additional events...');
    const additionalEvents = [
      {
        title: "Comedy Night with Mike Rodriguez",
        description: "Stand-up comedy night featuring Mike Rodriguez and special guests. Guaranteed laughs!",
        start_datetime: "2024-02-22T20:00:00Z",
        end_datetime: "2024-02-22T22:30:00Z",
        venue_id: venues[2].id, // Laugh Factory
        is_free: false,
        ticket_price: 20.00,
        capacity: 300,
        event_type: "comedy_show",
        category: "comedy",
        status: "published",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        created_at: "2024-01-22T12:00:00Z"
      },
      {
        title: "The Electric Souls Live",
        description: "Alternative rock band The Electric Souls performing their latest album live.",
        start_datetime: "2024-02-25T21:00:00Z",
        end_datetime: "2024-02-26T00:00:00Z",
        venue_id: venues[1].id, // Hollywood Bowl
        is_free: false,
        ticket_price: 55.00,
        capacity: 1000,
        event_type: "concert",
        category: "rock",
        status: "published",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        created_at: "2024-01-25T15:30:00Z"
      }
    ];
    
    const { data: additionalEventsData, error: additionalEventsError } = await supabase
      .from('events')
      .insert(additionalEvents)
      .select();
    
    if (additionalEventsError) {
      console.error('❌ Error inserting additional events:', additionalEventsError);
    } else {
      console.log(`✅ Inserted ${additionalEventsData.length} additional events`);
    }
    
    console.log('🎉 Database enhancement completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Venues: ${venues.length}`);
    console.log(`   - Performers: ${performers.length}`);
    console.log(`   - Events: ${events.length + (additionalEventsData?.length || 0)}`);
    console.log(`   - Event-Performer Links: ${eventPerformers.length}`);
    
  } catch (error) {
    console.error('💥 Error during database enhancement:', error);
  }
}

// Run the enhancement
enhanceDatabaseData();
