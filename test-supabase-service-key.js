const { createClient } = require('@supabase/supabase-js');

// Test with the service role key provided by the user
const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkZGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjk3NDg3MSwiZXhwIjoyMDUyNTUwODcxfQ.8QZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq';

async function testSupabaseServiceKey() {
  try {
    console.log('🔍 Testing Supabase service key...');
    
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Test basic connection
    console.log('📡 Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('roles')
      .select('name, hierarchy_level')
      .limit(5);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError.message);
      return;
    }
    
    console.log('✅ Database connection successful');
    console.log('📋 Current roles in database:');
    testData.forEach(role => {
      console.log(`  - ${role.name} (level ${role.hierarchy_level})`);
    });
    
    // Check if our user types exist
    const userTypes = ['fan', 'performer', 'venue_manager', 'influencer', 'admin'];
    const existingTypes = testData.map(r => r.name);
    const missingTypes = userTypes.filter(type => !existingTypes.includes(type));
    
    if (missingTypes.length > 0) {
      console.log('❌ Missing user types:', missingTypes);
      
      // Try to create the missing user types
      console.log('🔧 Creating missing user types...');
      
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .upsert([
          { name: 'fan', hierarchy_level: 10 },
          { name: 'performer', hierarchy_level: 8 },
          { name: 'venue_manager', hierarchy_level: 6 },
          { name: 'influencer', hierarchy_level: 4 },
          { name: 'admin', hierarchy_level: 2 }
        ], { onConflict: 'name' });
      
      if (rolesError) {
        console.error('❌ Error creating roles:', rolesError.message);
      } else {
        console.log('✅ User type roles created successfully');
      }
      
      // Add role permissions
      console.log('🔧 Creating role permissions...');
      const permissions = [
        // Fan permissions
        { role: 'fan', permission: 'events.view' },
        { role: 'fan', permission: 'venues.view' },
        { role: 'fan', permission: 'performers.view' },
        { role: 'fan', permission: 'shop.purchase' },
        
        // Performer permissions
        { role: 'performer', permission: 'events.view' },
        { role: 'performer', permission: 'events.create' },
        { role: 'performer', permission: 'events.manage' },
        { role: 'performer', permission: 'venues.view' },
        { role: 'performer', permission: 'performers.view' },
        { role: 'performer', permission: 'performers.create' },
        { role: 'performer', permission: 'performers.manage' },
        { role: 'performer', permission: 'shop.purchase' },
        
        // Venue Manager permissions
        { role: 'venue_manager', permission: 'events.view' },
        { role: 'venue_manager', permission: 'events.create' },
        { role: 'venue_manager', permission: 'events.manage' },
        { role: 'venue_manager', permission: 'venues.view' },
        { role: 'venue_manager', permission: 'venues.create' },
        { role: 'venue_manager', permission: 'venues.manage' },
        { role: 'venue_manager', permission: 'performers.view' },
        { role: 'venue_manager', permission: 'shop.purchase' },
        
        // Influencer permissions
        { role: 'influencer', permission: 'events.view' },
        { role: 'influencer', permission: 'events.create' },
        { role: 'influencer', permission: 'venues.view' },
        { role: 'influencer', permission: 'performers.view' },
        { role: 'influencer', permission: 'communities.create' },
        { role: 'influencer', permission: 'communities.manage' },
        { role: 'influencer', permission: 'calendars.create' },
        { role: 'influencer', permission: 'calendars.manage' },
        { role: 'influencer', permission: 'shop.purchase' },
        
        // Admin permissions
        { role: 'admin', permission: 'events.view' },
        { role: 'admin', permission: 'events.create' },
        { role: 'admin', permission: 'events.manage' },
        { role: 'admin', permission: 'venues.view' },
        { role: 'admin', permission: 'venues.create' },
        { role: 'admin', permission: 'venues.manage' },
        { role: 'admin', permission: 'performers.view' },
        { role: 'admin', permission: 'performers.create' },
        { role: 'admin', permission: 'performers.manage' },
        { role: 'admin', permission: 'communities.view' },
        { role: 'admin', permission: 'communities.create' },
        { role: 'admin', permission: 'communities.manage' },
        { role: 'admin', permission: 'calendars.view' },
        { role: 'admin', permission: 'calendars.create' },
        { role: 'admin', permission: 'calendars.manage' },
        { role: 'admin', permission: 'shop.view' },
        { role: 'admin', permission: 'shop.manage' },
        { role: 'admin', permission: 'users.manage' },
        { role: 'admin', permission: 'settings.manage' }
      ];
      
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_permissions')
        .upsert(permissions, { onConflict: 'role,permission' });
      
      if (permissionsError) {
        console.error('❌ Error creating permissions:', permissionsError.message);
      } else {
        console.log('✅ Role permissions created successfully');
      }
      
    } else {
      console.log('✅ All user types found in database');
    }
    
    // Check if user_profiles table exists
    console.log('🔍 Checking user_profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ user_profiles table error:', profilesError.message);
    } else {
      console.log('✅ user_profiles table exists');
    }
    
    // Check if accounts_memberships table exists
    console.log('🔍 Checking accounts_memberships table...');
    const { data: membershipsData, error: membershipsError } = await supabase
      .from('accounts_memberships')
      .select('*')
      .limit(1);
    
    if (membershipsError) {
      console.error('❌ accounts_memberships table error:', membershipsError.message);
    } else {
      console.log('✅ accounts_memberships table exists');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSupabaseServiceKey();

