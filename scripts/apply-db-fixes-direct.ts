#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySchemaFixes() {
  console.log('🚀 Applying database schema fixes...\n');
  
  const operations = [
    {
      name: 'Create performers table',
      fn: async () => {
        const { error } = await supabase.rpc('query', {
          query: `
            CREATE TABLE IF NOT EXISTS performers (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name VARCHAR(255),
              stage_name VARCHAR(255),
              category VARCHAR(100),
              genres TEXT[],
              bio TEXT,
              profile_image_url TEXT,
              image_url TEXT,
              rating DECIMAL(3, 2),
              average_rating DECIMAL(3, 2),
              is_verified BOOLEAN DEFAULT false,
              city VARCHAR(100),
              address TEXT,
              total_performances INTEGER DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
          `
        });
        return { error };
      }
    },
    {
      name: 'Add missing event columns',
      fn: async () => {
        // First check what columns exist
        const { data: columns } = await supabase
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_name', 'events')
          .eq('table_schema', 'public');
        
        const existingColumns = columns?.map(c => c.column_name) || [];
        
        // Add missing columns one by one
        const columnsToAdd = [
          { name: 'genre', type: 'VARCHAR(100)' },
          { name: 'address', type: 'TEXT' },
          { name: 'tags', type: 'TEXT[]' },
          { name: 'city', type: 'VARCHAR(100)' },
          { name: 'state', type: 'VARCHAR(100)' },
          { name: 'max_capacity', type: 'INTEGER' },
          { name: 'profile_image_url', type: 'TEXT' }
        ];
        
        for (const column of columnsToAdd) {
          if (!existingColumns.includes(column.name)) {
            await supabase.rpc('query', {
              query: `ALTER TABLE events ADD COLUMN ${column.name} ${column.type}`
            });
          }
        }
        
        return { error: null };
      }
    },
    {
      name: 'Create bookings table',
      fn: async () => {
        const { error } = await supabase.rpc('query', {
          query: `
            CREATE TABLE IF NOT EXISTS bookings (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID REFERENCES auth.users(id),
              event_id UUID REFERENCES events(id),
              venue_id UUID REFERENCES venues(id),
              title VARCHAR(255),
              name VARCHAR(255),
              category VARCHAR(100),
              start_date TIMESTAMP WITH TIME ZONE,
              end_date TIMESTAMP WITH TIME ZONE,
              address TEXT,
              city VARCHAR(100),
              image_url TEXT,
              profile_image_url TEXT,
              stage_name VARCHAR(255),
              status VARCHAR(50) DEFAULT 'pending',
              payment_status VARCHAR(50) DEFAULT 'pending',
              total_amount DECIMAL(10, 2),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
          `
        });
        return { error };
      }
    }
  ];
  
  // Execute operations
  for (const op of operations) {
    process.stdout.write(`${op.name}...`);
    try {
      const result = await op.fn();
      if (result.error) {
        console.log(' ❌', result.error.message);
      } else {
        console.log(' ✅');
      }
    } catch (error: any) {
      console.log(' ❌', error.message);
    }
  }
  
  console.log('\n✅ Basic schema fixes applied!');
  console.log('\nFor complete fixes, please run the full SQL script in Supabase dashboard:');
  console.log('https://supabase.com/dashboard/project/gbcjlsnbamjchdtgrquu/sql/new');
}

// Test basic connectivity first
async function testConnection() {
  console.log('Testing database connection...');
  
  const { data, error } = await supabase
    .from('events')
    .select('id')
    .limit(1);
    
  if (error) {
    console.error('Connection failed:', error);
    return false;
  }
  
  console.log('✅ Connection successful!\n');
  return true;
}

async function main() {
  const connected = await testConnection();
  if (!connected) {
    console.log('\nPlease check your service role key and try again.');
    return;
  }
  
  await applySchemaFixes();
}

main().catch(console.error);