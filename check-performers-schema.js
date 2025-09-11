const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkPerformersSchema() {
  console.log('🔍 Checking performers table schema...');
  
  try {
    // Get a sample performer to see the actual structure
    const { data: performers, error } = await supabase
      .from('performers')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching performers:', error);
      return;
    }
    
    if (performers && performers.length > 0) {
      console.log('✅ Performers table structure:');
      console.log(JSON.stringify(performers[0], null, 2));
    } else {
      console.log('ℹ️ No performers found, checking table structure...');
      
      // Try to insert a minimal performer to see what columns are required
      const { data: testPerformer, error: insertError } = await supabase
        .from('performers')
        .insert({
          name: 'Test Performer',
          stage_name: 'Test Performer',
          bio: 'Test bio',
          category: 'musician',
          genres: ['jazz'],
          instruments: ['guitar'],
          location: 'Test City, FL',
          rating: 4.5,
          reviews: 10
        })
        .select();
      
      if (insertError) {
        console.error('❌ Error inserting test performer:', insertError);
      } else {
        console.log('✅ Test performer inserted successfully:', testPerformer);
      }
    }
    
  } catch (error) {
    console.error('💥 Error checking performers schema:', error);
  }
}

checkPerformersSchema();
