const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

async function fixEventPerformerRelationships() {
  // Use service role key to bypass RLS
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.YourServiceRoleKeyHere';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔧 Creating event-performer relationships with service role...');
    
    // Get all events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, category')
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
    
    console.log(`📊 Found ${events?.length || 0} events, ${performers?.length || 0} performers`);
    
    if (!events || !performers || events.length === 0 || performers.length === 0) {
      console.log('❌ Missing data for relationships');
      return;
    }
    
    // Create event-performer relationships
    const eventPerformerRelations = [];
    
    events.forEach((event, index) => {
      // Assign performers based on event category
      let selectedPerformers = [];
      
      if (event.category === 'music') {
        // Music events get music performers
        selectedPerformers = performers.filter(p => 
          p.category === 'music' || 
          p.name.includes('Jazz') || 
          p.name.includes('Music') ||
          p.name.includes('Band') ||
          p.name.includes('Quartet')
        ).slice(0, 2);
      } else if (event.category === 'entertainment') {
        // Entertainment events get comedy performers
        selectedPerformers = performers.filter(p => 
          p.name.includes('Comedy') || 
          p.name.includes('Laugh') ||
          p.name.includes('Improv')
        ).slice(0, 1);
      } else {
        // Other events get random performers
        const numPerformers = Math.min(1, performers.length);
        selectedPerformers = performers.slice(index % performers.length, (index % performers.length) + numPerformers);
      }
      
      selectedPerformers.forEach(performer => {
        eventPerformerRelations.push({
          event_id: event.id,
          performer_id: performer.id
        });
      });
    });
    
    console.log(`🔧 Creating ${eventPerformerRelations.length} event-performer relationships...`);
    
    // Insert all relationships at once
    const { error: insertError } = await supabase
      .from('event_performers')
      .insert(eventPerformerRelations);
    
    if (insertError) {
      console.error('❌ Error inserting event-performer relationships:', insertError);
    } else {
      console.log('✅ Successfully created all event-performer relationships!');
    }
    
    // Verify the relationships
    const { data: eventPerformers, error: verifyError } = await supabase
      .from('event_performers')
      .select('event_id, performer_id, events(title), performers(name)')
      .limit(10);
    
    if (verifyError) {
      console.error('❌ Error verifying relationships:', verifyError);
    } else if (eventPerformers && eventPerformers.length > 0) {
      console.log('\n✅ Event-performer relationships created:');
      eventPerformers.forEach((rel, index) => {
        console.log(`  ${index + 1}. "${rel.events?.title || 'Event'}" → "${rel.performers?.name || 'Performer'}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixEventPerformerRelationships().catch(console.error);
