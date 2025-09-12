const { createClient } = require('@supabase/supabase-js');

// Use Railway environment variables
const supabaseUrl = 'https://goeventversion2-production.up.railway.app';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZXZlbnR2ZXJzaW9uMi1wcm9kdWN0aW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzQwMDAsImV4cCI6MjA1MTU1MDAwMH0.placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeRelationships() {
  console.log('🔍 Analyzing database relationships and test data...\n');
  
  try {
    // Check events table structure and sample data
    console.log('📅 EVENTS TABLE:');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, venue_id, organizer_id, community_id, start_datetime, end_datetime, status')
      .limit(5);
    
    if (eventsError) {
      console.log('❌ Events error:', eventsError.message);
    } else {
      console.log('✅ Events found:', events.length);
      events.forEach(event => {
        console.log(`  - ${event.title} (ID: ${event.id})`);
        console.log(`    venue_id: ${event.venue_id}`);
        console.log(`    organizer_id: ${event.organizer_id}`);
        console.log(`    community_id: ${event.community_id}`);
        console.log(`    status: ${event.status}`);
        console.log(`    dates: ${event.start_datetime} to ${event.end_datetime}`);
        console.log('');
      });
    }
    
    console.log('🏢 VENUES TABLE:');
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name, account_id, venueType, location')
      .limit(5);
    
    if (venuesError) {
      console.log('❌ Venues error:', venuesError.message);
    } else {
      console.log('✅ Venues found:', venues.length);
      venues.forEach(venue => {
        console.log(`  - ${venue.name} (ID: ${venue.id})`);
        console.log(`    account_id: ${venue.account_id}`);
        console.log(`    venueType: ${venue.venueType}`);
        console.log(`    location: ${venue.location}`);
        console.log('');
      });
    }
    
    console.log('🎭 PERFORMERS TABLE:');
    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .select('id, name, account_id, category, bio')
      .limit(5);
    
    if (performersError) {
      console.log('❌ Performers error:', performersError.message);
    } else {
      console.log('✅ Performers found:', performers.length);
      performers.forEach(performer => {
        console.log(`  - ${performer.name} (ID: ${performer.id})`);
        console.log(`    account_id: ${performer.account_id}`);
        console.log(`    category: ${performer.category}`);
        console.log('');
      });
    }
    
    console.log('🎫 TICKETS TABLE:');
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('id, event_id, name, price, available_quantity')
      .limit(5);
    
    if (ticketsError) {
      console.log('❌ Tickets error:', ticketsError.message);
    } else {
      console.log('✅ Tickets found:', tickets.length);
      tickets.forEach(ticket => {
        console.log(`  - ${ticket.name} (ID: ${ticket.id})`);
        console.log(`    event_id: ${ticket.event_id}`);
        console.log(`    price: $${ticket.price}`);
        console.log(`    available: ${ticket.available_quantity}`);
        console.log('');
      });
    }
    
    console.log('🔗 EVENT_PERFORMERS TABLE:');
    const { data: eventPerformers, error: epError } = await supabase
      .from('event_performers')
      .select('event_id, performer_id')
      .limit(5);
    
    if (epError) {
      console.log('❌ Event-Performers error:', epError.message);
    } else {
      console.log('✅ Event-Performers found:', eventPerformers.length);
      eventPerformers.forEach(ep => {
        console.log(`  - Event ${ep.event_id} -> Performer ${ep.performer_id}`);
      });
    }
    
    console.log('👥 ACCOUNTS TABLE:');
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('id, name, personal_account')
      .limit(5);
    
    if (accountsError) {
      console.log('❌ Accounts error:', accountsError.message);
    } else {
      console.log('✅ Accounts found:', accounts.length);
      accounts.forEach(account => {
        console.log(`  - ${account.name} (ID: ${account.id}, personal: ${account.personal_account})`);
      });
    }
    
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
    
    // Check if tickets have valid event_ids
    const { data: ticketsWithEvents } = await supabase
      .from('tickets')
      .select('id, name, event_id')
      .not('event_id', 'is', null);
    
    const { data: allEvents } = await supabase
      .from('events')
      .select('id');
    
    const eventIds = allEvents?.map(e => e.id) || [];
    const invalidEventRefs = ticketsWithEvents?.filter(t => !eventIds.includes(t.event_id)) || [];
    
    console.log(`📊 Tickets with event references: ${ticketsWithEvents?.length || 0}`);
    console.log(`📊 Total events available: ${eventIds.length}`);
    console.log(`❌ Tickets with invalid event references: ${invalidEventRefs.length}`);
    
    if (invalidEventRefs.length > 0) {
      console.log('   Invalid event references:');
      invalidEventRefs.forEach(ticket => {
        console.log(`   - Ticket "${ticket.name}" references non-existent event ${ticket.event_id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

analyzeRelationships().catch(console.error);
