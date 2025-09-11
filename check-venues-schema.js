const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkVenuesSchema() {
  console.log('🔍 Checking venues table schema...');
  
  try {
    // Get a sample venue to see the actual structure
    const { data: venues, error } = await supabase
      .from('venues')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching venues:', error);
      return;
    }
    
    if (venues && venues.length > 0) {
      console.log('✅ Venues table structure:');
      console.log(JSON.stringify(venues[0], null, 2));
    } else {
      console.log('ℹ️ No venues found, checking table structure...');
      
      // Try to insert a minimal venue to see what columns are required
      const { data: testVenue, error: insertError } = await supabase
        .from('venues')
        .insert({
          name: 'Test Venue',
          description: 'Test description',
          address: '123 Test St',
          city: 'Test City',
          state: 'FL',
          zip_code: '12345',
          capacity: 100
        })
        .select();
      
      if (insertError) {
        console.error('❌ Error inserting test venue:', insertError);
      } else {
        console.log('✅ Test venue inserted successfully:', testVenue);
      }
    }
    
  } catch (error) {
    console.error('💥 Error checking venues schema:', error);
  }
}

checkVenuesSchema();
