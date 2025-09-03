const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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

async function executeSQL(sql, description) {
  console.log(`🔧 ${description}...`);
  
  const { data, error } = await supabase.rpc('exec_sql', { 
    sql: sql 
  });
  
  if (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  } else {
    console.log(`✅ ${description} completed`);
    return true;
  }
}

async function applyMagicPatternsSchema() {
  console.log('🌟 Applying Magic Patterns schema to production database...');
  
  // First, let's add missing columns to existing tables
  const alterCommands = [
    // Add missing columns to venues
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE;`,
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS image_url varchar(1000);`,
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS venue_type venue_type DEFAULT 'indoor';`,
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS address text;`,
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS city varchar(100);`,
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS state varchar(100);`,
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS country varchar(100);`,
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS postal_code varchar(20);`,
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS max_capacity integer;`,
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;`,
    `ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;`,
    
    // Add missing columns to events  
    `ALTER TABLE public.events ADD COLUMN IF NOT EXISTS title varchar(255);`,
    `ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url varchar(1000);`,
    `ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category event_category DEFAULT 'other';`,
    `ALTER TABLE public.events ADD COLUMN IF NOT EXISTS start_date timestamptz;`,
    `ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_date timestamptz;`,
    `ALTER TABLE public.events ADD COLUMN IF NOT EXISTS venue_id uuid REFERENCES public.venues(id);`,
    `ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;`,
    
    // Add missing columns to performers
    `ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS stage_name varchar(255);`,
    `ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS bio text;`,
    `ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS category performer_category DEFAULT 'other';`,
    `ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS profile_image_url varchar(1000);`,
    `ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE;`,
    `ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS is_available boolean DEFAULT true;`
  ];
  
  // Create missing enums first
  const enumCommands = [
    `CREATE TYPE IF NOT EXISTS venue_type AS ENUM ('indoor', 'outdoor', 'hybrid', 'virtual', 'mobile');`,
    `CREATE TYPE IF NOT EXISTS event_category AS ENUM ('music', 'sports', 'business', 'entertainment', 'arts', 'food_drink', 'community', 'education', 'health', 'technology', 'other');`,
    `CREATE TYPE IF NOT EXISTS performer_category AS ENUM ('musician', 'band', 'dj', 'comedian', 'speaker', 'dancer', 'magician', 'variety', 'other');`
  ];
  
  // Execute enum creation
  for (const command of enumCommands) {
    await executeSQL(command, 'Creating enum types');
  }
  
  // Execute table alterations
  for (const command of alterCommands) {
    await executeSQL(command, 'Adding missing columns');
  }
  
  // Create the complete Magic Patterns tables that don't exist yet
  const newTables = `
    -- Community hubs table
    CREATE TABLE IF NOT EXISTS public.community_hubs (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
      name varchar(255) NOT NULL,
      description text,
      slug varchar(255) UNIQUE NOT NULL,
      visibility hub_visibility DEFAULT 'public',
      member_limit integer,
      current_members integer DEFAULT 0,
      logo_url varchar(1000),
      banner_url varchar(1000),
      is_verified boolean DEFAULT false,
      is_active boolean DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      created_by uuid REFERENCES auth.users(id),
      updated_by uuid REFERENCES auth.users(id)
    );
    
    CREATE TYPE IF NOT EXISTS hub_visibility AS ENUM ('public', 'private', 'invite_only');
    
    -- Bookings table
    CREATE TABLE IF NOT EXISTS public.bookings (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
      event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
      venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
      performer_id uuid REFERENCES public.performers(id) ON DELETE SET NULL,
      booking_number varchar(50) UNIQUE NOT NULL,
      status booking_status DEFAULT 'pending',
      event_date timestamptz NOT NULL,
      guest_count integer NOT NULL,
      total_amount decimal(10,2) NOT NULL,
      client_name varchar(255) NOT NULL,
      client_email varchar(320) NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      created_by uuid REFERENCES auth.users(id),
      updated_by uuid REFERENCES auth.users(id)
    );
    
    CREATE TYPE IF NOT EXISTS booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'refunded');
    
    -- Reviews table
    CREATE TABLE IF NOT EXISTS public.reviews (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
      entity_type review_entity_type NOT NULL,
      entity_id uuid NOT NULL,
      rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
      title varchar(255),
      content text,
      is_verified boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      created_by uuid REFERENCES auth.users(id),
      updated_by uuid REFERENCES auth.users(id)
    );
    
    CREATE TYPE IF NOT EXISTS review_entity_type AS ENUM ('event', 'venue', 'performer', 'booking');
    
    -- Messages table
    CREATE TABLE IF NOT EXISTS public.messages (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      message_type message_type DEFAULT 'direct',
      subject varchar(255),
      content text NOT NULL,
      is_read boolean DEFAULT false,
      read_at timestamptz,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
    
    CREATE TYPE IF NOT EXISTS message_type AS ENUM ('direct', 'booking_inquiry', 'booking_update', 'system', 'notification');
    
    -- Favorites table
    CREATE TABLE IF NOT EXISTS public.favorites (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
      entity_type favorite_entity_type NOT NULL,
      entity_id uuid NOT NULL,
      created_at timestamptz DEFAULT now(),
      UNIQUE(account_id, entity_type, entity_id)
    );
    
    CREATE TYPE IF NOT EXISTS favorite_entity_type AS ENUM ('event', 'venue', 'performer', 'hub');
  `;
  
  await executeSQL(newTables, 'Creating new Magic Patterns tables');
  
  console.log('✅ Magic Patterns schema application completed!');
}

async function main() {
  await applyMagicPatternsSchema();
}

main().catch(console.error);