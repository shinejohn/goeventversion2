const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getHubId() {
  try {
    const { data: hubs, error } = await supabase
      .from('community_hubs')
      .select('id, name, slug')
      .limit(1);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    if (hubs && hubs.length > 0) {
      console.log('Hub found:');
      console.log('ID:', hubs[0].id);
      console.log('Name:', hubs[0].name);
      console.log('Slug:', hubs[0].slug);
      console.log('\nTest URL: http://localhost:3000/hub/' + hubs[0].id);
    } else {
      console.log('No hubs found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

getHubId();
