const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Use environment variables directly
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMissingTables() {
  try {
    console.log('🚀 Creating missing tables for calendar and community detail pages...');
    
    // Read the SQL file
    const sql = fs.readFileSync('create-missing-tables.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement.length === 0) continue;
      
      console.log(`📝 Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
          // Continue with next statement
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Exception in statement ${i + 1}:`, err.message);
        // Continue with next statement
      }
    }
    
    console.log('🎉 Table creation process completed!');
    
    // Test the tables by querying them
    console.log('\n🔍 Testing created tables...');
    
    const { data: calendars, error: calendarsError } = await supabase
      .from('calendars')
      .select('*')
      .limit(3);
    
    if (calendarsError) {
      console.error('❌ Error querying calendars:', calendarsError.message);
    } else {
      console.log('✅ Calendars table working:', calendars?.length || 0, 'records');
    }
    
    const { data: curatedCalendars, error: curatedError } = await supabase
      .from('curated_calendars')
      .select('*')
      .limit(3);
    
    if (curatedError) {
      console.error('❌ Error querying curated_calendars:', curatedError.message);
    } else {
      console.log('✅ Curated calendars table working:', curatedCalendars?.length || 0, 'records');
    }
    
    const { data: calendarEvents, error: eventsError } = await supabase
      .from('calendar_events')
      .select('*')
      .limit(3);
    
    if (eventsError) {
      console.error('❌ Error querying calendar_events:', eventsError.message);
    } else {
      console.log('✅ Calendar events table working:', calendarEvents?.length || 0, 'records');
    }
    
    console.log('\n🎯 Testing calendar detail page...');
    
    // Test the specific calendar that was failing
    const { data: jazzCalendar, error: jazzError } = await supabase
      .from('calendars')
      .select(`
        *,
        calendar_events (
          event_id,
          events (
            id,
            title,
            start_datetime,
            end_datetime
          )
        ),
        calendar_subscriptions (
          user_id
        )
      `)
      .eq('slug', 'jazz-events')
      .single();
    
    if (jazzError) {
      console.error('❌ Error querying jazz calendar:', jazzError.message);
    } else {
      console.log('✅ Jazz calendar found:', jazzCalendar?.name);
      console.log('   Events:', jazzCalendar?.calendar_events?.length || 0);
      console.log('   Subscribers:', jazzCalendar?.calendar_subscriptions?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

createMissingTables();
