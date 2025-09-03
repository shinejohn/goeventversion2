const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function testAndInsertData() {
  console.log('🔄 Testing database connection and inserting data...\n');

  // Test connection by checking venues table
  console.log('1️⃣ Testing venues table...');
  try {
    const { data, error } = await supabase.from('venues').select('*').limit(1);
    if (error) {
      console.log('❌ Venues table error:', error.message);
    } else {
      console.log('✅ Venues table accessible');
      console.log('Current columns:', Object.keys(data[0] || {}));
    }
  } catch (err) {
    console.log('❌ Venues error:', err.message);
  }

  // Try to insert venues directly
  console.log('\n2️⃣ Inserting venue data...');
  const venueData = [
    {
      community_id: '00000000-0000-0000-0000-000000000001',
      name: 'Madison Square Garden',
      description: 'Famous arena in New York City',
      slug: 'madison-square-garden',
      venue_type: 1,
      address: '4 Pennsylvania Plaza, New York, NY 10001'
    },
    {
      community_id: '00000000-0000-0000-0000-000000000001', 
      name: 'Hollywood Bowl',
      description: 'Iconic outdoor amphitheater',
      slug: 'hollywood-bowl',
      venue_type: 2,
      address: '2301 N Highland Ave, Los Angeles, CA 90068'
    }
  ];

  try {
    const { data, error } = await supabase.from('venues').insert(venueData);
    if (error) {
      console.log('❌ Insert error:', error.message);
      console.log('Error details:', error.details);
    } else {
      console.log('✅ Venues inserted successfully');
    }
  } catch (err) {
    console.log('❌ Insert error:', err.message);
  }

  // Test events table
  console.log('\n3️⃣ Testing events table...');
  try {
    const { data, error } = await supabase.from('events').select('*').limit(1);
    if (error) {
      console.log('❌ Events table error:', error.message);
    } else {
      console.log('✅ Events table accessible');
      console.log('Current columns:', Object.keys(data[0] || {}));
    }
  } catch (err) {
    console.log('❌ Events error:', err.message);
  }

  // Test performers table
  console.log('\n4️⃣ Testing performers table...');
  try {
    const { data, error } = await supabase.from('performers').select('*').limit(1);
    if (error) {
      console.log('❌ Performers table error:', error.message);
    } else {
      console.log('✅ Performers table accessible');
      console.log('Current columns:', Object.keys(data[0] || {}));
    }
  } catch (err) {
    console.log('❌ Performers error:', err.message);
  }
}

testAndInsertData().catch(console.error);