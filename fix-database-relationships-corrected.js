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
      .select('id, title, venue_id, organizer_id, community_id, status')
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
      .select('id, name, is_personal_account')
      .limit(10);
    
    console.log(`✅ Found ${events?.length || 0} events`);
    console.log(`✅ Found ${venues?.length || 0} venues`);
    console.log(`✅ Found ${performers?.length || 0} performers`);
    console.log(`✅ Found ${accounts?.length || 0} accounts`);
    
    // Check for relationship mismatches
    console.log('\n🔍 RELATIONSHIP ANALYSIS:');
    
    // Check if events have valid venue_ids
    const { data: eventsWithVenues } = await supabase
      .from('events')
      .select('id, title, venue_id')
      .not('venue_id', 'is', null);
    
    const { data: allVenues } = await supabase
      .from('venues')
      .select('id');
    
    const venueIds = allVenues?.map(v => v.id) || [];
    const invalidVenueRefs = eventsWithVenues?.filter(e => !venueIds.includes(e.venue_id)) || [];
    
    console.log(`📊 Events with venue references: ${eventsWithVenues?.length || 0}`);
    console.log(`📊 Total venues available: ${venueIds.length}`);
    console.log(`❌ Events with invalid venue references: ${invalidVenueRefs.length}`);
    
    if (invalidVenueRefs.length > 0) {
      console.log('   Invalid venue references:');
      invalidVenueRefs.forEach(event => {
        console.log(`   - Event "${event.title}" references non-existent venue ${event.venue_id}`);
      });
    }
    
    // Fix invalid venue references
    if (invalidVenueRefs.length > 0 && venueIds.length > 0) {
      console.log('\n🔧 Fixing invalid venue references...');
      for (const event of invalidVenueRefs) {
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
    
    // Check if events have valid organizer_ids
    const { data: eventsWithOrganizers } = await supabase
      .from('events')
      .select('id, title, organizer_id')
      .not('organizer_id', 'is', null);
    
    const { data: allAccounts } = await supabase
      .from('accounts')
      .select('id');
    
    const accountIds = allAccounts?.map(a => a.id) || [];
    const invalidOrganizerRefs = eventsWithOrganizers?.filter(e => !accountIds.includes(e.organizer_id)) || [];
    
    console.log(`📊 Events with organizer references: ${eventsWithOrganizers?.length || 0}`);
    console.log(`📊 Total accounts available: ${accountIds.length}`);
    console.log(`❌ Events with invalid organizer references: ${invalidOrganizerRefs.length}`);
    
    if (invalidOrganizerRefs.length > 0) {
      console.log('   Invalid organizer references:');
      invalidOrganizerRefs.forEach(event => {
        console.log(`   - Event "${event.title}" references non-existent organizer ${event.organizer_id}`);
      });
    }
    
    // Fix invalid organizer references
    if (invalidOrganizerRefs.length > 0 && accountIds.length > 0) {
      console.log('\n🔧 Fixing invalid organizer references...');
      for (const event of invalidOrganizerRefs) {
        const randomAccountId = accountIds[Math.floor(Math.random() * accountIds.length)];
        
        const { error } = await supabase
          .from('events')
          .update({ organizer_id: randomAccountId })
          .eq('id', event.id);
        
        if (error) {
          console.log(`⚠️  Failed to update event ${event.title}:`, error.message);
        } else {
          console.log(`✅ Updated event ${event.title} with organizer ${randomAccountId}`);
        }
      }
    }
    
    // Create event-performer relationships
    await createEventPerformerRelationships();
    
    // Create tickets for events
    await createTicketsForEvents();
    
    // Create sample bookings
    await createSampleBookings();
    
    console.log('\n✅ Database relationships fixed!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

async function createEventPerformerRelationships() {
  console.log('\n🔗 Creating event-performer relationships...');
  
  const { data: events } = await supabase
    .from('events')
    .select('id, title, category')
    .limit(10);
  
  const { data: performers } = await supabase
    .from('performers')
    .select('id, name, category')
    .limit(10);
  
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

async function createTicketsForEvents() {
  console.log('\n🎫 Creating tickets for events...');
  
  const { data: events } = await supabase
    .from('events')
    .select('id, title, price_min, price_max')
    .limit(10);
  
  if (!events) return;
  
  for (const event of events) {
    const basePrice = event.price_min || event.price_max || 25.00;
    
    const tickets = [
      {
        event_id: event.id,
        ticket_type: 'General Admission',
        quantity: 100,
        price_per_ticket: basePrice,
        total_price: basePrice,
        purchase_date: new Date().toISOString(),
        delivery_method: 'digital',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        event_id: event.id,
        ticket_type: 'VIP',
        quantity: 20,
        price_per_ticket: basePrice * 2,
        total_price: basePrice * 2,
        purchase_date: new Date().toISOString(),
        delivery_method: 'digital',
        status: 'available',
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
        console.log(`✅ Created ticket: ${ticket.ticket_type} for ${event.title}`);
      }
    }
  }
}

async function createSampleBookings() {
  console.log('\n📋 Creating sample bookings...');
  
  const { data: events } = await supabase
    .from('events')
    .select('id, title, venue_id, start_datetime')
    .limit(5);
  
  const { data: performers } = await supabase
    .from('performers')
    .select('id, name')
    .limit(5);
  
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id')
    .limit(1);
  
  if (!events || !performers || !accounts) return;
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const performer = performers[i % performers.length];
    const account = accounts[0];
    
    const booking = {
      event_id: event.id,
      venue_id: event.venue_id,
      performer_id: performer.id,
      user_id: account.id,
      booking_reference: `BK-${Date.now()}-${i}`,
      event_name: event.title,
      event_type: 'music',
      event_date: event.start_datetime,
      start_time: '20:00:00',
      end_time: '23:00:00',
      guest_count: 50,
      contact_person_name: 'Event Organizer',
      contact_person_email: 'organizer@example.com',
      base_price: 1000.00,
      total: 1000.00,
      payment_status: 'paid',
      booking_status: 'confirmed',
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('bookings')
      .upsert(booking);
    
    if (error) {
      console.log(`⚠️  Failed to create booking for ${event.title}:`, error.message);
    } else {
      console.log(`✅ Created booking: ${booking.booking_reference} for ${event.title}`);
    }
  }
}

fixDatabaseRelationships().catch(console.error);
