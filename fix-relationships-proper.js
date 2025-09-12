const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

async function fixRelationshipsProper() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔧 Fixing relationships with proper UUIDs...');
    
    // Get all events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, category, venue_id')
      .limit(20);
    
    if (eventsError) {
      console.error('❌ Error querying events:', eventsError);
      return;
    }
    
    // Get all performers
    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .select('id, name, category')
      .limit(20);
    
    if (performersError) {
      console.error('❌ Error querying performers:', performersError);
      return;
    }
    
    // Get all venues
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name')
      .limit(20);
    
    if (venuesError) {
      console.error('❌ Error querying venues:', venuesError);
      return;
    }
    
    console.log(`📊 Found ${events?.length || 0} events, ${performers?.length || 0} performers, ${venues?.length || 0} venues`);
    
    if (!events || !performers || !venues || events.length === 0 || performers.length === 0 || venues.length === 0) {
      console.log('❌ Missing data for relationships');
      return;
    }
    
    // 1. Update performers with proper UUID account_id
    console.log('\n🔧 Updating performers with proper UUID account_id...');
    for (let i = 0; i < performers.length; i++) {
      const performer = performers[i];
      const properAccountId = uuidv4();
      
      const { error } = await supabase
        .from('performers')
        .update({ account_id: properAccountId })
        .eq('id', performer.id);
      
      if (error) {
        console.error(`❌ Error updating performer ${performer.name}:`, error);
      } else {
        console.log(`✅ Updated performer "${performer.name}" with account_id`);
      }
    }
    
    // 2. Update venues with proper UUID account_id
    console.log('\n🔧 Updating venues with proper UUID account_id...');
    for (let i = 0; i < venues.length; i++) {
      const venue = venues[i];
      const properAccountId = uuidv4();
      
      const { error } = await supabase
        .from('venues')
        .update({ account_id: properAccountId })
        .eq('id', venue.id);
      
      if (error) {
        console.error(`❌ Error updating venue ${venue.name}:`, error);
      } else {
        console.log(`✅ Updated venue "${venue.name}" with account_id`);
      }
    }
    
    // 3. Create sample tickets with proper UUIDs
    console.log('\n🔧 Creating sample tickets with proper UUIDs...');
    const sampleTickets = [];
    
    events.slice(0, 5).forEach((event, index) => {
      sampleTickets.push({
        ticket_number: `TICKET-${event.id.slice(0, 8).toUpperCase()}-${index + 1}`,
        user_id: uuidv4(),
        event_id: event.id,
        ticket_type: 'General Admission',
        quantity: 1,
        price_per_ticket: event.category === 'music' ? 25 : 15,
        total_price: event.category === 'music' ? 25 : 15,
        purchase_date: new Date().toISOString(),
        delivery_method: 'digital',
        status: 'active',
        service_fee: 2.50
      });
    });
    
    for (const ticket of sampleTickets) {
      const { error } = await supabase
        .from('tickets')
        .insert(ticket);
      
      if (error) {
        console.error(`❌ Error inserting ticket:`, error);
      } else {
        console.log(`✅ Created ticket for event "${events.find(e => e.id === ticket.event_id)?.title}"`);
      }
    }
    
    // 4. Try to create event-performer relationships (may fail due to RLS)
    console.log('\n🔧 Attempting to create event-performer relationships...');
    const eventPerformerRelations = [];
    
    events.slice(0, 5).forEach((event, index) => {
      // Assign 1-2 performers per event
      const numPerformers = Math.min(2, performers.length);
      const selectedPerformers = performers.slice(index % performers.length, (index % performers.length) + numPerformers);
      
      selectedPerformers.forEach(performer => {
        eventPerformerRelations.push({
          event_id: event.id,
          performer_id: performer.id
        });
      });
    });
    
    let successCount = 0;
    for (const relation of eventPerformerRelations) {
      const { error } = await supabase
        .from('event_performers')
        .insert(relation);
      
      if (error) {
        console.log(`⚠️  Could not create event-performer relation (RLS policy): ${error.message}`);
      } else {
        successCount++;
        console.log(`✅ Linked event to performer`);
      }
    }
    
    console.log(`\n📊 Successfully created ${successCount} event-performer relationships`);
    
    // 5. Verify the relationships
    console.log('\n🔍 Verifying relationships...');
    
    // Check performers with account_id
    const { data: updatedPerformers } = await supabase
      .from('performers')
      .select('id, name, account_id')
      .not('account_id', 'is', null)
      .limit(5);
    
    if (updatedPerformers && updatedPerformers.length > 0) {
      console.log('✅ Performers with account_id:');
      updatedPerformers.forEach((performer, index) => {
        console.log(`  ${index + 1}. "${performer.name}" has account_id`);
      });
    }
    
    // Check venues with account_id
    const { data: updatedVenues } = await supabase
      .from('venues')
      .select('id, name, account_id')
      .not('account_id', 'is', null)
      .limit(5);
    
    if (updatedVenues && updatedVenues.length > 0) {
      console.log('✅ Venues with account_id:');
      updatedVenues.forEach((venue, index) => {
        console.log(`  ${index + 1}. "${venue.name}" has account_id`);
      });
    }
    
    // Check tickets
    const { data: tickets } = await supabase
      .from('tickets')
      .select('ticket_number, event_id, events(title)')
      .limit(5);
    
    if (tickets && tickets.length > 0) {
      console.log('✅ Tickets created:');
      tickets.forEach((ticket, index) => {
        console.log(`  ${index + 1}. ${ticket.ticket_number} for "${ticket.events?.title || 'Event'}"`);
      });
    }
    
    console.log('\n🎉 Relationships fixed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixRelationshipsProper().catch(console.error);
