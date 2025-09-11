const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getAnyValidId() {
  console.log('🔍 Getting any valid ID for organizer_id...');
  
  try {
    // Try to get an account ID to use as organizer_id
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('id')
      .limit(1);
    
    if (accountsError) {
      console.error('❌ Error fetching accounts:', accountsError);
      return;
    }
    
    if (accounts && accounts.length > 0) {
      console.log('✅ Using account_id as organizer_id:', accounts[0].id);
      return accounts[0].id;
    }
    
  } catch (error) {
    console.error('💥 Error getting any valid ID:', error);
  }
}

getAnyValidId();
