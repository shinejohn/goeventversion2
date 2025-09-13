const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function testEventDetail() {
  console.log('🔍 Testing event detail query...');
  
  const eventId = '4ddfb41a-991f-4098-9965-f498a3d06a2f';
  
  try {
    // Test the exact query from the loader
    console.log('📊 Testing main event query...');
    const { data: event, error: eventError } = await client
      .from('events')
      .select(`
        *,
        venues(*)
      `)
      .eq('id', eventId)
      .single();
    
    console.log('Event query result:');
    console.log('  Error:', eventError?.message || 'None');
    console.log('  Event found:', !!event);
    if (event) {
      console.log('  Event title:', event.title);
      console.log('  Event status:', event.status);
      console.log('  Venue data:', event.venues ? 'Found' : 'Missing');
    }
    
    // Test event_performers query
    console.log('\n📊 Testing event_performers query...');
    const { data: eventPerformersData, error: performersError } = await client
      .from('event_performers')
      .select(`
        *,
        performer:performers(*)
      `)
      .eq('event_id', eventId);
    
    console.log('Event performers query result:');
    console.log('  Error:', performersError?.message || 'None');
    console.log('  Relationships found:', eventPerformersData?.length || 0);
    
    // Test similar events query
    console.log('\n📊 Testing similar events query...');
    const { data: similarEvents, error: similarError } = await client
      .from('events')
      .select(`
        *,
        venues(*)
      `)
      .eq('category', event?.category || 'music')
      .neq('id', eventId)
      .limit(3);
    
    console.log('Similar events query result:');
    console.log('  Error:', similarError?.message || 'None');
    console.log('  Similar events found:', similarEvents?.length || 0);
    
  } catch (error) {
    console.error('❌ Error testing event detail:', error.message);
  }
}

testEventDetail().catch(console.error);
