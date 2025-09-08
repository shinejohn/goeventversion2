#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAndFixTables() {
  console.log('🔍 Verifying database tables and data...\n');
  
  const checks = [
    {
      name: 'Events table',
      test: async () => {
        const { data, error } = await supabase.from('events').select('id, title, venue_id').limit(5);
        return { data, error, count: data?.length || 0 };
      }
    },
    {
      name: 'Venues table',
      test: async () => {
        const { data, error } = await supabase.from('venues').select('id, name').limit(5);
        return { data, error, count: data?.length || 0 };
      }
    },
    {
      name: 'Performers table',
      test: async () => {
        const { data, error } = await supabase.from('performers').select('id, name').limit(5);
        return { data, error, count: data?.length || 0 };
      }
    },
    {
      name: 'Sponsors table',
      test: async () => {
        const { data, error } = await supabase.from('sponsors').select('id, name').limit(5);
        return { data, error, count: data?.length || 0 };
      }
    },
    {
      name: 'Event Series table',
      test: async () => {
        const { data, error } = await supabase.from('event_series').select('id, name').limit(5);
        return { data, error, count: data?.length || 0 };
      }
    },
    {
      name: 'Ticket Types table',
      test: async () => {
        const { data, error } = await supabase.from('ticket_types').select('id, name').limit(5);
        return { data, error, count: data?.length || 0 };
      }
    },
    {
      name: 'Events with venues',
      test: async () => {
        const { data, error } = await supabase
          .from('events')
          .select('id, title, venue:venues(name)')
          .not('venue_id', 'is', null)
          .limit(5);
        return { data, error, count: data?.length || 0 };
      }
    }
  ];
  
  let missingTables = [];
  
  for (const check of checks) {
    process.stdout.write(`${check.name}...`);
    const result = await check.test();
    
    if (result.error) {
      console.log(` ❌ ${result.error.message}`);
      if (result.error.message.includes('relation') && result.error.message.includes('does not exist')) {
        missingTables.push(check.name);
      }
    } else {
      console.log(` ✅ (${result.count} records)`);
      if (result.count === 0) {
        console.log(`   ⚠️  No data found`);
      }
    }
  }
  
  console.log('\n=== Summary ===');
  if (missingTables.length > 0) {
    console.log('❌ Missing tables:', missingTables.join(', '));
    console.log('\nPlease run the SQL schema script in Supabase dashboard:');
    console.log('https://supabase.com/dashboard/project/gbcjlsnbamjchdtgrquu/sql/new');
    console.log('File: scripts/fix-database-schema.sql');
  } else {
    console.log('✅ All core tables exist!');
    console.log('\nNext: Run test data script to populate tables:');
    console.log('npx tsx scripts/add-comprehensive-test-data.ts');
  }
  
  // Check for events without venues (violates our rule)
  console.log('\n=== Checking Business Rules ===');
  const { data: orphanEvents } = await supabase
    .from('events')
    .select('id, title')
    .is('venue_id', null);
    
  if (orphanEvents && orphanEvents.length > 0) {
    console.log(`⚠️  Found ${orphanEvents.length} events without venues (violates rule)`);
    orphanEvents.forEach(e => console.log(`   - ${e.title}`));
  } else {
    console.log('✅ All events have venues');
  }
}

verifyAndFixTables().catch(console.error);