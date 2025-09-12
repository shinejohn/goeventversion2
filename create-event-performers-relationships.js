const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function createEventPerformersRelationships() {
  console.log('🔗 Creating event-performer relationships...');
  
  // Get all events
  const { data: events, error: eventsError } = await client
    .from('events')
    .select('id, title, category')
    .limit(10);
  
  if (eventsError) {
    console.error('Error fetching events:', eventsError);
    return;
  }
  
  console.log(`📊 Found ${events.length} events`);
  
  // Get all performers
  const { data: performers, error: performersError } = await client
    .from('performers')
    .select('id, stage_name, category');
  
  if (performersError) {
    console.error('Error fetching performers:', performersError);
    return;
  }
  
  console.log(`📊 Found ${performers.length} performers`);
  
  // Create relationships for each event
  for (const event of events) {
    console.log(`\n🎭 Processing event: ${event.title} (${event.category})`);
    
    // Find suitable performers based on event category
    let suitablePerformers = [];
    
    if (event.category === 'music') {
      suitablePerformers = performers.filter(p => 
        p.category === 'musician' || 
        p.stage_name?.includes('Jazz') || 
        p.stage_name?.includes('Music') ||
        p.stage_name?.includes('Band') ||
        p.stage_name?.includes('Quartet')
      ).slice(0, 2);
    } else if (event.category === 'entertainment') {
      suitablePerformers = performers.filter(p => 
        p.stage_name?.includes('Comedy') || 
        p.stage_name?.includes('Laugh') ||
        p.stage_name?.includes('Improv')
      ).slice(0, 1);
    } else {
      // Other events get random performers
      suitablePerformers = performers.slice(0, 1);
    }
    
    console.log(`  Found ${suitablePerformers.length} suitable performers`);
    
    // Create event_performers relationships
    for (const performer of suitablePerformers) {
      const relationshipData = {
        event_id: event.id,
        performer_id: performer.id,
        is_headliner: true, // or false for opener
        performance_order: 1,
        set_duration_minutes: 60,
        compensation: 500.00,
        created_at: new Date().toISOString()
      };
      
      const { error: insertError } = await client
        .from('event_performers')
        .insert(relationshipData);
      
      if (insertError) {
        console.error(`  ❌ Error creating relationship for ${performer.stage_name}:`, insertError.message);
      } else {
        console.log(`  ✅ Created relationship: ${performer.stage_name}`);
      }
    }
  }
  
  console.log('\n🎉 Event-performer relationships creation complete!');
}

createEventPerformersRelationships().catch(console.error);
