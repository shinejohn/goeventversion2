const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment
const supabaseUrl = process.env.SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable not found');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyUserRoles() {
  try {
    console.log('🚀 Adding user type roles to database...');
    
    // Add our specific user types as roles
    console.log('📝 Adding user type roles...');
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
      console.error('❌ Error adding roles:', rolesError.message);
    } else {
      console.log('✅ User type roles added successfully');
    }
    
    // Add role permissions
    console.log('📝 Adding role permissions...');
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
      console.error('❌ Error adding permissions:', permissionsError.message);
    } else {
      console.log('✅ Role permissions added successfully');
    }
    
    console.log('\n🎉 User roles migration completed!');
    
    // Verify the roles were created
    console.log('\n🔍 Verifying roles were created...');
    const { data: roles, error: rolesError2 } = await supabase
      .from('roles')
      .select('name, hierarchy_level')
      .in('name', ['fan', 'performer', 'venue_manager', 'influencer', 'admin'])
      .order('hierarchy_level');
    
    if (rolesError2) {
      console.error('❌ Error verifying roles:', rolesError2.message);
    } else {
      console.log('✅ User type roles found:');
      roles.forEach(role => {
        console.log(`  - ${role.name} (level ${role.hierarchy_level})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyUserRoles();

