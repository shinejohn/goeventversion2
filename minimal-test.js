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

async function main() {
  console.log('Testing minimal venue insert...');
  
  // Try with just a name
  const { data, error } = await supabase
    .from('venues')
    .insert([{
      name: 'Test Venue'
    }])
    .select();
    
  if (error) {
    console.error('Error with name only:', error.message);
    
    // Try with name and required field
    const { data: data2, error: error2 } = await supabase
      .from('venues')
      .insert([{
        name: 'Test Venue',
        description: 'A test venue'
      }])
      .select();
      
    if (error2) {
      console.error('Error with name and description:', error2.message);
    } else {
      console.log('Success with name and description:', data2);
    }
  } else {
    console.log('Success with name only:', data);
  }
}

main().catch(console.error);