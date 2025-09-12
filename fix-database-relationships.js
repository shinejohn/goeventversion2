const { createClient } = require('@supabase/supabase-js');

// Use the correct Supabase URL and service role key
const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDatabaseRelationships() {
  console.log('🔧 Fixing database relationships and test data...\n');
  
  try {
    // First, let's check what data we have
    console.log('📊 Checking current data...');
    
    const { data: events } = await supabase
      .from('events')
      .select('id, title, venue_id, organizer_id, community_id')
      .limit(10);
    
    const { data: venues } = await supabase
      .from('venues')
      .select('id, name, account_id')
      .limit(10);
    
    const { data: performers } = await supabase
      .from('performers')
      .select('id, name, account_id, category')
      .limit(10);
    
    const { data: accounts } = await supabase
      .from('accounts')
      .select('id, name, personal_account')
      .limit(10);
    
    console.log(`✅ Found ${events?.length || 0} events`);
    console.log(`✅ Found ${venues?.length || 0} venues`);
    console.log(`✅ Found ${performers?.length || 0} performers`);
    console.log(`✅ Found ${accounts?.length || 0} accounts`);
    
    if (!events || events.length === 0) {
      console.log('❌ No events found. Creating sample events...');
      await createSampleEvents();
    }
    
    if (!venues || venues.length === 0) {
      console.log('❌ No venues found. Creating sample venues...');
      await createSampleVenues();
    }
    
    if (!performers || performers.length === 0) {
      console.log('❌ No performers found. Creating sample performers...');
      await createSamplePerformers();
    }
    
    if (!accounts || accounts.length === 0) {
      console.log('❌ No accounts found. Creating sample accounts...');
      await createSampleAccounts();
    }
    
    // Now fix relationships
    await fixEventVenueRelationships();
    await fixEventPerformerRelationships();
    await fixTicketEventRelationships();
    await createSampleBookings();
    
    console.log('\n✅ Database relationships fixed!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

async function createSampleAccounts() {
  console.log('👥 Creating sample accounts...');
  
  // Use existing account ID from the working script
  const existingAccountId = 'afafd084-52bd-41d7-a6a8-2f9f7970a0ba';
  
  const accounts = [
    {
      id: existingAccountId,
      name: 'Event Organizer Account',
      personal_account: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  for (const account of accounts) {
    const { error } = await supabase
      .from('accounts')
      .upsert(account);
    
    if (error) {
      console.log(`⚠️  Account ${account.name} error:`, error.message);
    } else {
      console.log(`✅ Created account: ${account.name}`);
    }
  }
}

async function createSampleVenues() {
  console.log('🏢 Creating sample venues...');
  
  const venues = [
    {
      id: 'venue-1',
      name: 'Downtown Music Hall',
      account_id: 'afafd084-52bd-41d7-a6a8-2f9f7970a0ba',
      venueType: 'concert_hall',
      location: 'New York, NY',
      capacity: 500,
      description: 'A beautiful concert hall in downtown',
      address: '123 Music Street, New York, NY 10001',
      phone: '+1-555-0123',
      email: 'info@downtownmusichall.com',
      website: 'https://downtownmusichall.com',
      amenities: ['parking', 'bar', 'dressing_rooms'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'venue-2',
      name: 'Riverside Theater',
      account_id: 'afafd084-52bd-41d7-a6a8-2f9f7970a0ba',
      venueType: 'theater',
      location: 'Los Angeles, CA',
      capacity: 300,
      description: 'Intimate theater by the river',
      address: '456 River Road, Los Angeles, CA 90210',
      phone: '+1-555-0456',
      email: 'bookings@riversidetheater.com',
      website: 'https://riversidetheater.com',
      amenities: ['parking', 'bar', 'dressing_rooms', 'catering'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  for (const venue of venues) {
    const { error } = await supabase
      .from('venues')
      .upsert(venue);
    
    if (error) {
      console.log(`⚠️  Venue ${venue.name} error:`, error.message);
    } else {
      console.log(`✅ Created venue: ${venue.name}`);
    }
  }
}

async function createSamplePerformers() {
  console.log('🎭 Creating sample performers...');
  
  const performers = [
    {
      id: 'performer-1',
      name: 'The Jazz Collective',
      account_id: 'afafd084-52bd-41d7-a6a8-2f9f7970a0ba',
      category: 'music',
      bio: 'A dynamic jazz ensemble bringing fresh sounds to the scene',
      genre: 'Jazz',
      experience_level: 'professional',
      hourly_rate: 200,
      availability: 'weekends',
      social_media: {
        instagram: '@jazzcollective',
        twitter: '@jazzcollective',
        website: 'https://jazzcollective.com'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'performer-2',
      name: 'Sarah Johnson',
      account_id: 'afafd084-52bd-41d7-a6a8-2f9f7970a0ba',
      category: 'music',
      bio: 'Singer-songwriter with a soulful voice',
      genre: 'Soul/Pop',
      experience_level: 'professional',
      hourly_rate: 150,
      availability: 'flexible',
      social_media: {
        instagram: '@sarahjohnsonmusic',
        twitter: '@sarahjohnson',
        website: 'https://sarahjohnsonmusic.com'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  for (const performer of performers) {
    const { error } = await supabase
      .from('performers')
      .upsert(performer);
    
    if (error) {
      console.log(`⚠️  Performer ${performer.name} error:`, error.message);
    } else {
      console.log(`✅ Created performer: ${performer.name}`);
    }
  }
}

async function createSampleEvents() {
  console.log('📅 Creating sample events...');
  
  const events = [
    {
      id: '4ddfb41a-991f-4098-9965-f498a3d06a2f',
      title: 'Jazz Night at Downtown Music Hall',
      description: 'An evening of smooth jazz featuring The Jazz Collective',
      venue_id: 'venue-1',
      organizer_id: 'afafd084-52bd-41d7-a6a8-2f9f7970a0ba',
      community_id: 'community-1',
      start_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      end_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
      category: 'music',
      status: 'published',
      location_name: 'Downtown Music Hall',
      capacity: 500,
      price: 25.00,
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'event-2',
      title: 'Sarah Johnson Live Performance',
      description: 'Intimate acoustic performance by Sarah Johnson',
      venue_id: 'venue-2',
      organizer_id: 'afafd084-52bd-41d7-a6a8-2f9f7970a0ba',
      community_id: 'community-2',
      start_datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      end_datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
      category: 'music',
      status: 'published',
      location_name: 'Riverside Theater',
      capacity: 300,
      price: 35.00,
      image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  for (const event of events) {
    const { error } = await supabase
      .from('events')
      .upsert(event);
    
    if (error) {
      console.log(`⚠️  Event ${event.title} error:`, error.message);
    } else {
      console.log(`✅ Created event: ${event.title}`);
    }
  }
}

async function fixEventVenueRelationships() {
  console.log('🔗 Fixing event-venue relationships...');
  
  // Get all events that need venue relationships
  const { data: events } = await supabase
    .from('events')
    .select('id, title, venue_id');
  
  const { data: venues } = await supabase
    .from('venues')
    .select('id');
  
  if (!events || !venues) return;
  
  const venueIds = venues.map(v => v.id);
  
  for (const event of events) {
    if (!event.venue_id || !venueIds.includes(event.venue_id)) {
      // Assign a random venue
      const randomVenueId = venueIds[Math.floor(Math.random() * venueIds.length)];
      
      const { error } = await supabase
        .from('events')
        .update({ venue_id: randomVenueId })
        .eq('id', event.id);
      
      if (error) {
        console.log(`⚠️  Failed to update event ${event.title}:`, error.message);
      } else {
        console.log(`✅ Updated event ${event.title} with venue ${randomVenueId}`);
      }
    }
  }
}

async function fixEventPerformerRelationships() {
  console.log('🔗 Creating event-performer relationships...');
  
  const { data: events } = await supabase
    .from('events')
    .select('id, title, category');
  
  const { data: performers } = await supabase
    .from('performers')
    .select('id, name, category');
  
  if (!events || !performers) return;
  
  for (const event of events) {
    // Find performers that match the event category
    const matchingPerformers = performers.filter(p => p.category === event.category);
    
    if (matchingPerformers.length > 0) {
      const performer = matchingPerformers[0]; // Take the first matching performer
      
      const { error } = await supabase
        .from('event_performers')
        .upsert({
          event_id: event.id,
          performer_id: performer.id,
          role: 'headliner',
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.log(`⚠️  Failed to create event-performer relationship for ${event.title}:`, error.message);
      } else {
        console.log(`✅ Created relationship: ${event.title} -> ${performer.name}`);
      }
    }
  }
}

async function fixTicketEventRelationships() {
  console.log('🎫 Creating tickets for events...');
  
  const { data: events } = await supabase
    .from('events')
    .select('id, title, price');
  
  if (!events) return;
  
  for (const event of events) {
    const tickets = [
      {
        event_id: event.id,
        name: 'General Admission',
        description: 'General admission ticket',
        price: event.price || 25.00,
        available_quantity: 100,
        max_quantity_per_order: 4,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        event_id: event.id,
        name: 'VIP',
        description: 'VIP ticket with premium seating',
        price: (event.price || 25.00) * 2,
        available_quantity: 20,
        max_quantity_per_order: 2,
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
    
    for (const ticket of tickets) {
      const { error } = await supabase
        .from('tickets')
        .upsert(ticket);
      
      if (error) {
        console.log(`⚠️  Failed to create ticket for ${event.title}:`, error.message);
      } else {
        console.log(`✅ Created ticket: ${ticket.name} for ${event.title}`);
      }
    }
  }
}

async function createSampleBookings() {
  console.log('📋 Creating sample bookings...');
  
  const { data: events } = await supabase
    .from('events')
    .select('id, title, venue_id')
    .limit(2);
  
  const { data: performers } = await supabase
    .from('performers')
    .select('id, name')
    .limit(2);
  
  if (!events || !performers) return;
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const performer = performers[i % performers.length];
    
    const booking = {
      event_id: event.id,
      venue_id: event.venue_id,
      performer_id: performer.id,
      account_id: 'afafd084-52bd-41d7-a6a8-2f9f7970a0ba',
      booking_number: `BK-${Date.now()}-${i}`,
      status: 'confirmed',
      event_date: event.start_datetime,
      guest_count: 50,
      total_amount: 1000.00,
      client_name: 'Event Organizer',
      client_email: 'organizer@example.com',
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('bookings')
      .upsert(booking);
    
    if (error) {
      console.log(`⚠️  Failed to create booking for ${event.title}:`, error.message);
    } else {
      console.log(`✅ Created booking: ${booking.booking_number} for ${event.title}`);
    }
  }
}

fixDatabaseRelationships().catch(console.error);
