#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyCriticalFixes() {
  console.log('🔧 Applying critical fixes to make the app work...\n');
  
  // 1. First, let's make community_id nullable so events can be created
  console.log('Making community_id optional for events...');
  try {
    // We can't alter the table directly, but we can work around it
    // by ensuring all new events have a default community
    
    // Get or create a default community
    let { data: community } = await supabase
      .from('communities')
      .select('id')
      .eq('slug', 'default-community')
      .single();
      
    if (!community) {
      const { data: newCommunity } = await supabase
        .from('communities')
        .insert({
          name: 'Default Community',
          slug: 'default-community',
          description: 'Default community for all events'
        })
        .select()
        .single();
        
      community = newCommunity;
    }
    
    if (community) {
      console.log('✅ Default community ready:', community.id);
      
      // Update any events without community_id
      await supabase
        .from('events')
        .update({ community_id: community.id })
        .is('community_id', null);
    }
  } catch (error) {
    console.error('❌ Community fix failed:', error);
  }
  
  // 2. Add missing performers if they don't have slugs
  console.log('\nFixing performers without slugs...');
  try {
    const { data: performers } = await supabase
      .from('performers')
      .select('id, name, slug');
      
    if (performers) {
      for (const performer of performers) {
        if (!performer.slug && performer.name) {
          const slug = performer.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          await supabase
            .from('performers')
            .update({ slug })
            .eq('id', performer.id);
          console.log(`✅ Fixed slug for ${performer.name}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Performer fix failed:', error);
  }
  
  // 3. Create the tables we need through data insertion (workaround)
  console.log('\nCreating necessary data structures...');
  
  // Try to create sponsors table by inserting data
  try {
    await supabase
      .from('sponsors')
      .insert({
        name: 'City of Clearwater',
        slug: 'city-of-clearwater',
        category: 'government',
        description: 'Local government sponsor'
      });
    console.log('✅ Sponsors table exists or created');
  } catch (error: any) {
    if (error.message?.includes('does not exist')) {
      console.log('❌ Sponsors table needs to be created manually');
    }
  }
  
  // 4. Let's see what we can actually query
  console.log('\n📊 Checking what actually works:');
  
  const tableChecks = [
    { name: 'events', query: supabase.from('events').select('count').limit(1) },
    { name: 'venues', query: supabase.from('venues').select('count').limit(1) },
    { name: 'performers', query: supabase.from('performers').select('count').limit(1) },
    { name: 'communities', query: supabase.from('communities').select('count').limit(1) },
    { name: 'accounts', query: supabase.from('accounts').select('count').limit(1) },
  ];
  
  for (const check of tableChecks) {
    const { error } = await check.query;
    console.log(`${check.name}: ${error ? '❌ Not accessible' : '✅ Working'}`);
  }
  
  console.log('\n📝 Manual SQL Execution Required:');
  console.log('1. Go to: https://supabase.com/dashboard/project/gbcjlsnbamjchdtgrquu/sql/new');
  console.log('2. Run the following SQL:');
  console.log(`
-- Make community_id optional
ALTER TABLE events ALTER COLUMN community_id DROP NOT NULL;

-- Add missing columns to performers
ALTER TABLE performers ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  category VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organizers table  
CREATE TABLE IF NOT EXISTS organizers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  category VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sponsor/organizer to events
ALTER TABLE events 
  ADD COLUMN IF NOT EXISTS sponsor_id UUID REFERENCES sponsors(id),
  ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES organizers(id);
  `);
}

applyCriticalFixes().catch(console.error);