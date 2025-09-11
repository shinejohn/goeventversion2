const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getValidIds() {
  console.log('🔍 Getting valid account_id and community_id...');
  
  try {
    // Get a valid account_id
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('id')
      .limit(1);
    
    if (accountsError) {
      console.error('❌ Error fetching accounts:', accountsError);
      return;
    }
    
    // Get a valid community_id
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('id')
      .limit(1);
    
    if (communitiesError) {
      console.error('❌ Error fetching communities:', communitiesError);
      return;
    }
    
    console.log('✅ Valid account_id:', accounts[0]?.id);
    console.log('✅ Valid community_id:', communities[0]?.id);
    
    return {
      account_id: accounts[0]?.id,
      community_id: communities[0]?.id
    };
    
  } catch (error) {
    console.error('💥 Error getting valid IDs:', error);
  }
}

getValidIds();
