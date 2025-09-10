import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addMissingFields() {
  console.log('🎲 Feeling lucky! Let\'s add those missing fields...\n');
  
  try {
    // Test connection first
    console.log('🔌 Testing connection...');
    const { data: testData, error: testError } = await supabase
      .from('events')
      .select('id')
      .limit(1)
      .single();
      
    if (testError) {
      console.error('❌ Connection test failed:', testError);
      return;
    }
    
    console.log('✅ Connected successfully!\n');
    
    // Since we can't run ALTER TABLE through the API, let's at least verify what's missing
    console.log('📋 Checking current state of events table...');
    
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .limit(1)
      .single();
      
    if (event) {
      const fields = Object.keys(event);
      console.log(`\nCurrent event fields (${fields.length} total):`);
      
      const missingFields = [
        'age_restriction',
        'ticket_price',
        'ticket_url', 
        'highlights',
        'series_id',
        'account_id',
        'is_featured'
      ];
      
      console.log('\nChecking for missing fields:');
      missingFields.forEach(field => {
        const exists = fields.includes(field);
        console.log(`  ${field}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
      });
      
      // Check if account_id exists (might be there from organizer_id)
      if (event.organizer_id && !event.account_id) {
        console.log('\n  Note: organizer_id exists, could map to account_id');
      }
    }
    
    console.log('\n🚨 Important: To add the missing fields, you need to:');
    console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/gbcjlsnbamjchdtgrquu');
    console.log('2. Navigate to Table Editor > events table');
    console.log('3. Add the missing columns manually, OR');
    console.log('4. Use SQL Editor with the migration script\n');
    
    console.log('📄 SQL script location: scripts/add-missing-ui-fields.sql');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addMissingFields();