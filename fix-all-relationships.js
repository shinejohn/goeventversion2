const { createClient } = require('@supabase/supabase-js');

async function fixAllRelationships() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔧 Fixing all relationships...');
    
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
      .select('id, name, category, account_id')
      .limit(20);
    
    if (performersError) {
      console.error('❌ Error querying performers:', performersError);
      return;
    }
    
    // Get all venues
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name, account_id')
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
    
    // 1. Create event-performer relationships
    console.log('\n🔧 Creating event-performer relationships...');
    const eventPerformerRelations = [];
    
    events.forEach((event, index) => {
      // Assign performers based on event category
      let performerIds = [];
      
      if (event.category === 'music') {
        // Music events get 1-3 performers
        const musicPerformers = performers.filter(p => p.category === 'music' || p.name.includes('Jazz') || p.name.includes('Music'));
        const numPerformers = Math.min(2, musicPerformers.length);
        performerIds = musicPerformers.slice(0, numPerformers).map(p => p.id);
      } else if (event.category === 'entertainment') {
        // Entertainment events get comedy performers
        const comedyPerformers = performers.filter(p => p.name.includes('Comedy') || p.name.includes('Laugh'));
        performerIds = comedyPerformers.slice(0, 1).map(p => p.id);
      } else {
        // Other events get random performers
        const numPerformers = Math.min(1, performers.length);
        performerIds = performers.slice(index % performers.length, (index % performers.length) + numPerformers).map(p => p.id);
      }
      
      performerIds.forEach(performerId => {
        eventPerformerRelations.push({
          event_id: event.id,
          performer_id: performerId
        });
      });
    });
    
    // Insert event-performer relationships
    for (const relation of eventPerformerRelations) {
      const { error } = await supabase
        .from('event_performers')
        .insert(relation);
      
      if (error) {
        console.error(`❌ Error inserting event-performer relation:`, error);
      } else {
        console.log(`✅ Linked event to performer`);
      }
    }
    
    // 2. Update performers with account_id relationships
    console.log('\n🔧 Updating performers with account relationships...');
    for (let i = 0; i < performers.length; i++) {
      const performer = performers[i];
      if (!performer.account_id) {
        // Generate a fake account_id for now (in real app, this would be linked to user accounts)
        const fakeAccountId = `performer-account-${performer.id.slice(0, 8)}`;
        
        const { error } = await supabase
          .from('performers')
          .update({ account_id: fakeAccountId })
          .eq('id', performer.id);
        
        if (error) {
          console.error(`❌ Error updating performer ${performer.name}:`, error);
        } else {
          console.log(`✅ Updated performer "${performer.name}" with account_id`);
        }
      }
    }
    
    // 3. Update venues with account_id relationships
    console.log('\n🔧 Updating venues with account relationships...');
    for (let i = 0; i < venues.length; i++) {
      const venue = venues[i];
      if (!venue.account_id) {
        // Generate a fake account_id for now (in real app, this would be linked to user accounts)
        const fakeAccountId = `venue-account-${venue.id.slice(0, 8)}`;
        
        const { error } = await supabase
          .from('venues')
          .update({ account_id: fakeAccountId })
          .eq('id', venue.id);
        
        if (error) {
          console.error(`❌ Error updating venue ${venue.name}:`, error);
        } else {
          console.log(`✅ Updated venue "${venue.name}" with account_id`);
        }
      }
    }
    
    // 4. Create sample tickets linked to events
    console.log('\n🔧 Creating sample tickets linked to events...');
    const sampleTickets = [];
    
    events.slice(0, 5).forEach((event, index) => {
      sampleTickets.push({
        ticket_number: `TICKET-${event.id.slice(0, 8).toUpperCase()}-${index + 1}`,
        user_id: `user-${index + 1}`,
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
    
    console.log('\n🎉 All relationships fixed!');
    
    // Verify the relationships
    console.log('\n🔍 Verifying relationships...');
    
    // Check event-performer relationships
    const { data: eventPerformers } = await supabase
      .from('event_performers')
      .select('event_id, performer_id, performers(name)')
      .limit(5);
    
    if (eventPerformers && eventPerformers.length > 0) {
      console.log('✅ Event-performer relationships created:');
      eventPerformers.forEach((rel, index) => {
        console.log(`  ${index + 1}. Event ${rel.event_id} → Performer ${rel.performers?.name || rel.performer_id}`);
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
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAllRelationships().catch(console.error);
