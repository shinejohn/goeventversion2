import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function testSimpleQueries() {
  console.log('🧪 Testing simplified queries that get ALL fields...\n');
  
  // Test 1: Events list with all venue fields
  console.log('1️⃣ Testing events list query...');
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*, venues!venue_id(*)')
      .limit(2);
      
    if (error) {
      console.error('❌ Events query failed:', error);
    } else {
      console.log(`✅ Events loaded: ${events?.length} events`);
      if (events && events[0]) {
        console.log('\nFirst event has:');
        console.log(`  - ${Object.keys(events[0]).length} fields`);
        console.log(`  - Venue: ${events[0].venues?.name || 'No venue'}`);
        if (events[0].venues) {
          console.log(`  - Venue has ${Object.keys(events[0].venues).length} fields`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
  
  // Test 2: Event detail with everything
  console.log('\n\n2️⃣ Testing event detail query...');
  try {
    // Get a sample event
    const { data: sampleEvent } = await supabase
      .from('events')
      .select('id')
      .limit(1)
      .single();
      
    if (sampleEvent) {
      const { data: event, error } = await supabase
        .from('events')
        .select('*, venues!venue_id(*)')
        .eq('id', sampleEvent.id)
        .single();
        
      if (error) {
        console.error('❌ Event detail failed:', error);
      } else {
        console.log('✅ Event detail loaded!');
        console.log(`  - Event has ${Object.keys(event).length} fields`);
        console.log('  - All new fields included:');
        console.log(`    • age_restriction: ${event.age_restriction}`);
        console.log(`    • ticket_price: ${event.ticket_price}`);
        console.log(`    • highlights: ${Array.isArray(event.highlights) ? event.highlights.length + ' items' : 'none'}`);
        console.log(`    • is_featured: ${event.is_featured}`);
      }
      
      // Test performers query
      console.log('\n3️⃣ Testing performers query...');
      const { data: performers, error: perfError } = await supabase
        .from('event_performers')
        .select('*, performer:performers!performer_id(*)')
        .eq('event_id', sampleEvent.id);
        
      if (perfError) {
        console.error('❌ Performers failed:', perfError);
      } else {
        console.log(`✅ Performers loaded: ${performers?.length} performers`);
        if (performers && performers[0]?.performer) {
          console.log(`  - Performer has ${Object.keys(performers[0].performer).length} fields`);
          console.log(`  - Including image: ${performers[0].performer.image ? '✅' : '❌'}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
  
  console.log('\n✨ With simplified queries:');
  console.log('  - We get ALL fields automatically');
  console.log('  - Missing fields just return as null/undefined');
  console.log('  - No more query failures from wrong field names!');
}

testSimpleQueries();