const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getOrganizerId() {
  console.log('🔍 Getting valid organizer_id...');
  
  try {
    // Get a valid organizer_id
    const { data: organizers, error: organizersError } = await supabase
      .from('organizers')
      .select('id')
      .limit(1);
    
    if (organizersError) {
      console.error('❌ Error fetching organizers:', organizersError);
      return;
    }
    
    if (organizers && organizers.length > 0) {
      console.log('✅ Valid organizer_id:', organizers[0].id);
      return organizers[0].id;
    } else {
      console.log('ℹ️ No organizers found, creating one...');
      
      // Create a test organizer
      const { data: newOrganizer, error: createError } = await supabase
        .from('organizers')
        .insert({
          name: 'Test Organizer',
          email: 'test@organizer.com',
          phone: '+1-555-0123'
        })
        .select();
      
      if (createError) {
        console.error('❌ Error creating organizer:', createError);
        return null;
      }
      
      console.log('✅ Created organizer:', newOrganizer[0].id);
      return newOrganizer[0].id;
    }
    
  } catch (error) {
    console.error('💥 Error getting organizer ID:', error);
    return null;
  }
}

getOrganizerId();
