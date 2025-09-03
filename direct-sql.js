const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function executeSQL() {
  console.log('🔄 Starting database update...\n');

  // Step 1: Create community_hubs table
  console.log('1️⃣ Creating community_hubs table...');
  try {
    const { error } = await supabase.rpc('exec_sql', {
      query: `CREATE TABLE IF NOT EXISTS public.community_hubs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        slug VARCHAR(255) UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );`
    });
    
    if (error && !error.message.includes('already exists')) {
      throw error;
    }
    console.log('✅ Community hubs table ready\n');
  } catch (err) {
    console.log(`⚠️  ${err.message}\n`);
  }

  // Step 2: Add missing columns to venues
  console.log('2️⃣ Adding missing columns to venues...');
  const venueColumns = [
    'image_url TEXT',
    'city VARCHAR(100)',
    'state VARCHAR(100)', 
    'country VARCHAR(100)',
    'max_capacity INTEGER',
    'is_active BOOLEAN DEFAULT true',
    'contact_email VARCHAR(320)'
  ];

  for (const col of venueColumns) {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        query: `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS ${col};`
      });
      if (error && !error.message.includes('already exists')) {
        throw error;
      }
    } catch (err) {
      console.log(`⚠️  ${err.message}`);
    }
  }
  console.log('✅ Venues table updated\n');

  // Step 3: Add missing columns to events  
  console.log('3️⃣ Adding missing columns to events...');
  const eventColumns = [
    'image_url TEXT',
    'start_date TIMESTAMPTZ',
    'end_date TIMESTAMPTZ',
    'status VARCHAR(50) DEFAULT \'published\'',
    'venue_id UUID',
    'is_public BOOLEAN DEFAULT true'
  ];

  for (const col of eventColumns) {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        query: `ALTER TABLE public.events ADD COLUMN IF NOT EXISTS ${col};`
      });
      if (error && !error.message.includes('already exists')) {
        throw error;
      }
    } catch (err) {
      console.log(`⚠️  ${err.message}`);
    }
  }
  console.log('✅ Events table updated\n');

  // Step 4: Add stage_name to performers
  console.log('4️⃣ Adding stage_name to performers...');
  try {
    const { error } = await supabase.rpc('exec_sql', {
      query: `ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS stage_name VARCHAR(255);`
    });
    if (error && !error.message.includes('already exists')) {
      throw error;
    }
    console.log('✅ Performers table updated\n');
  } catch (err) {
    console.log(`⚠️  ${err.message}\n`);
  }

  // Step 5: Insert default community
  console.log('5️⃣ Inserting default community...');
  try {
    const { error } = await supabase.rpc('exec_sql', {
      query: `INSERT INTO public.community_hubs (id, name, description, slug) VALUES 
      ('00000000-0000-0000-0000-000000000001', 'Default Community', 'Default community for testing', 'default-community')
      ON CONFLICT (id) DO NOTHING;`
    });
    if (error && !error.message.includes('duplicate key')) {
      throw error;
    }
    console.log('✅ Default community inserted\n');
  } catch (err) {
    console.log(`⚠️  ${err.message}\n`);
  }

  console.log('🎉 Schema updates complete! Ready for data insertion.');
}

executeSQL().catch(console.error);