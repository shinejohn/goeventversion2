import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function checkReviewsTables() {
  console.log('Checking for review tables...\n');
  
  // Try different table names
  const tables = ['venue_reviews', 'reviews', 'event_reviews', 'performer_reviews'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.log(`❌ ${table}: Table does not exist`);
        } else {
          console.log(`⚠️  ${table}: Error - ${error.message}`);
        }
      } else {
        console.log(`✅ ${table}: Table exists! Found ${data?.length || 0} records`);
      }
    } catch (e) {
      console.log(`❌ ${table}: Unexpected error`);
    }
  }
}

checkReviewsTables();