const { createClient } = require('@supabase/supabase-js');

async function createEventPerformersDirect() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔧 Creating event-performer relationships...');
    
    // Get events and performers
    const { data: events } = await supabase
      .from('events')
      .select('id, title, category')
      .limit(10);
    
    const { data: performers } = await supabase
      .from('performers')
      .select('id, name, category')
      .limit(10);
    
    if (!events || !performers || events.length === 0 || performers.length === 0) {
      console.log('❌ No events or performers found');
      return;
    }
    
    console.log(`📊 Found ${events.length} events, ${performers.length} performers`);
    
    // Create relationships one by one to avoid RLS issues
    let successCount = 0;
    
    for (let i = 0; i < Math.min(events.length, 5); i++) {
      const event = events[i];
      
      // Select 1-2 performers for each event
      const performersToLink = performers.slice(i % performers.length, (i % performers.length) + 2);
      
      for (const performer of performersToLink) {
        try {
          const { error } = await supabase
            .from('event_performers')
            .insert({
              event_id: event.id,
              performer_id: performer.id
            });
          
          if (error) {
            console.log(`⚠️  Could not link "${event.title}" to "${performer.name}": ${error.message}`);
          } else {
            console.log(`✅ Linked "${event.title}" to "${performer.name}"`);
            successCount++;
          }
        } catch (err) {
          console.log(`⚠️  Error linking "${event.title}" to "${performer.name}": ${err.message}`);
        }
      }
    }
    
    console.log(`\n📊 Successfully created ${successCount} event-performer relationships`);
    
    // Verify relationships
    const { data: relationships } = await supabase
      .from('event_performers')
      .select('event_id, performer_id, events(title), performers(name)')
      .limit(5);
    
    if (relationships && relationships.length > 0) {
      console.log('\n✅ Verified relationships:');
      relationships.forEach((rel, index) => {
        console.log(`  ${index + 1}. "${rel.events?.title || 'Event'}" → "${rel.performers?.name || 'Performer'}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createEventPerformersDirect().catch(console.error);
