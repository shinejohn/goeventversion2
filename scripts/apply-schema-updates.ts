#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

// Use the Management API endpoint for executing SQL
async function executeSQLStatements(statements: string[]) {
  console.log('🚀 Applying database schema updates...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const sql = statements[i].trim();
    if (!sql || sql.startsWith('--')) continue;
    
    const preview = sql.split('\n')[0].substring(0, 80);
    process.stdout.write(`[${i + 1}/${statements.length}] ${preview}...`);
    
    try {
      // Use the Supabase Management API
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query_wrapper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ query_text: sql })
      });
      
      if (!response.ok) {
        // Try alternative approach - direct REST API
        const altResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({ query: sql })
        });
        
        if (!altResponse.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
      }
      
      successCount++;
      console.log(' ✅');
    } catch (error: any) {
      errorCount++;
      console.log(' ❌', error.message);
    }
  }
  
  console.log(`\n✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
}

// Since we can't execute raw SQL via the JS client, let's use the data API to create tables
async function applySchemaUpdates() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  // First, let's check what we can do with the service role
  console.log('🔍 Checking current database state...\n');
  
  // Check for missing tables
  const tablesToCheck = ['sponsors', 'organizers', 'event_series', 'ticket_types'];
  const missingTables = [];
  
  for (const table of tablesToCheck) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error?.message?.includes('does not exist')) {
      missingTables.push(table);
      console.log(`❌ Table '${table}' is missing`);
    } else {
      console.log(`✅ Table '${table}' exists`);
    }
  }
  
  if (missingTables.length === 0) {
    console.log('\n✅ All required tables exist!');
    return;
  }
  
  console.log(`\n❌ Missing ${missingTables.length} tables`);
  console.log('\n📋 Creating SQL migration file...');
  
  // Since we can't execute DDL statements directly through the JS client,
  // let's create a migration file that can be applied via Supabase CLI
  const migrationSQL = `
-- Auto-generated migration to add missing tables

${missingTables.includes('sponsors') ? `
-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON sponsors FOR SELECT TO authenticated USING (true);
` : ''}

${missingTables.includes('organizers') ? `
-- Create organizers table
CREATE TABLE IF NOT EXISTS organizers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON organizers FOR SELECT TO authenticated USING (true);
` : ''}

${missingTables.includes('event_series') ? `
-- Create event_series table
CREATE TABLE IF NOT EXISTS event_series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  series_type VARCHAR(100),
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(100),
  logo_url TEXT,
  banner_image_url TEXT,
  website_url TEXT,
  sponsor_id UUID REFERENCES sponsors(id),
  organizer_id UUID REFERENCES organizers(id),
  primary_venue_id UUID REFERENCES venues(id),
  total_events INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE event_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON event_series FOR SELECT TO authenticated USING (is_active = true);
` : ''}

${missingTables.includes('ticket_types') ? `
-- Create ticket_types table
CREATE TABLE IF NOT EXISTS ticket_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  series_id UUID REFERENCES event_series(id),
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  early_bird_price DECIMAL(10, 2),
  early_bird_deadline TIMESTAMP WITH TIME ZONE,
  max_quantity INTEGER,
  available_quantity INTEGER,
  min_purchase INTEGER DEFAULT 1,
  max_purchase INTEGER,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  benefits TEXT[],
  restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT ticket_type_scope CHECK (
    (event_id IS NOT NULL AND series_id IS NULL) OR 
    (event_id IS NULL AND series_id IS NOT NULL)
  )
);
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ticket types" ON ticket_types FOR SELECT TO authenticated USING (is_active = true);
` : ''}

-- Add missing columns to events table
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS sponsor_id UUID REFERENCES sponsors(id),
  ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES organizers(id),
  ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES event_series(id),
  ADD COLUMN IF NOT EXISTS series_order INTEGER,
  ADD COLUMN IF NOT EXISTS series_day INTEGER,
  ADD COLUMN IF NOT EXISTS is_meeting BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS meeting_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS requires_rsvp BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS rsvp_deadline TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS has_multiple_stages BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_activities BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS event_layout_url TEXT,
  ADD COLUMN IF NOT EXISTS parking_info TEXT,
  ADD COLUMN IF NOT EXISTS admission_info TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_sponsor_id ON events(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_series_id ON events(series_id);
`;

  // Write migration file
  const fs = await import('fs/promises');
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
  const migrationPath = `./apps/web/supabase/migrations/${timestamp}_add_missing_tables.sql`;
  
  await fs.writeFile(migrationPath, migrationSQL);
  console.log(`✅ Created migration file: ${migrationPath}`);
  
  console.log('\n📝 Next steps:');
  console.log('1. Run: npx supabase migration up --db-url "postgresql://..."');
  console.log('   OR');
  console.log('2. Copy the SQL from add-missing-tables.sql and run in Supabase SQL Editor');
  console.log('   https://supabase.com/dashboard/project/gbcjlsnbamjchdtgrquu/sql/new');
}

applySchemaUpdates().catch(console.error);