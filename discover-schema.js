const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function discoverVenuesSchema() {
  console.log('🏢 Discovering venues schema...');
  
  const tests = [
    {
      venue_type: 'indoor',
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Test Venue',
      description: 'Test description',
      slug: 'test-venue-1'
    },
    {
      venue_type: 1, // Try integer
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Test Venue 2',
      description: 'Test description',
      slug: 'test-venue-2'
    }
  ];
  
  for (const test of tests) {
    const { data, error } = await supabase
      .from('venues')
      .insert(test)
      .select();
      
    if (error) {
      console.log(`❌ Failed with venue_type ${test.venue_type}:`, error.message);
    } else {
      console.log(`✅ Success with venue_type ${test.venue_type}:`, data[0]);
      
      // Clean up
      await supabase.from('venues').delete().eq('id', data[0].id);
      break;
    }
  }
}

async function discoverEventsSchema() {
  console.log('\n🎭 Discovering events schema...');
  
  const tests = [
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      title: 'Test Event',
      description: 'Test description',
      slug: 'test-event-1'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Test Event',
      description: 'Test description', 
      slug: 'test-event-2'
    }
  ];
  
  for (const test of tests) {
    const { data, error } = await supabase
      .from('events')
      .insert(test)
      .select();
      
    if (error) {
      console.log(`❌ Failed with fields ${Object.keys(test).join(', ')}:`, error.message);
    } else {
      console.log(`✅ Success with fields ${Object.keys(test).join(', ')}:`, data[0]);
      
      // Clean up
      await supabase.from('events').delete().eq('id', data[0].id);
      break;
    }
  }
}

async function discoverPerformersSchema() {
  console.log('\n🎤 Discovering performers schema...');
  
  const tests = [
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Test Performer',
      description: 'Test description',
      slug: 'test-performer-1'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000002',
      name: 'Test Performer',
      description: 'Test description',
      slug: 'test-performer-2'
    }
  ];
  
  for (const test of tests) {
    const { data, error } = await supabase
      .from('performers')
      .insert(test)
      .select();
      
    if (error) {
      console.log(`❌ Failed with fields ${Object.keys(test).join(', ')}:`, error.message);
    } else {
      console.log(`✅ Success with fields ${Object.keys(test).join(', ')}:`, data[0]);
      
      // Clean up
      await supabase.from('performers').delete().eq('id', data[0].id);
      break;
    }
  }
}

async function main() {
  await discoverVenuesSchema();
  await discoverEventsSchema();
  await discoverPerformersSchema();
}

main().catch(console.error);