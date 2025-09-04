// apps/web/app/routes/admin/seed-database.tsx
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/admin/seed-database/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Check if user is authenticated (basic check)
  const { data: user } = await client.auth.getUser();
  if (!user.user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log('🌱 Starting database seeding...');
    
    // First, get or create an account
    let accountId: string;
    const { data: accounts } = await client
      .from('accounts')
      .select('id')
      .eq('is_personal_account', false)
      .limit(1);
    
    if (accounts && accounts.length > 0) {
      accountId = accounts[0].id;
      console.log('Using existing account:', accountId);
    } else {
      // Create a team account
      const { data: newAccount, error: accountError } = await client
        .from('accounts')
        .insert({
          name: 'GoEventCity Demo',
          is_personal_account: false,
          primary_owner_user_id: user.user.id
        })
        .select()
        .single();
      
      if (accountError || !newAccount) {
        throw new Error(`Failed to create account: ${accountError?.message}`);
      }
      
      accountId = newAccount.id;
      console.log('Created new account:', accountId);
    }

    // Seed venues
    const venues = [
      {
        account_id: accountId,
        name: 'Madison Square Garden',
        description: 'Famous arena in New York City hosting major concerts and sports events',
        venue_type: 'indoor',
        address: '4 Pennsylvania Plaza',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        max_capacity: 20000,
        image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
        base_hourly_rate: 25000,
        contact_email: 'bookings@msg.com',
        slug: 'madison-square-garden',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'Hollywood Bowl',
        description: 'Iconic outdoor amphitheater in Los Angeles',
        venue_type: 'outdoor',
        address: '2301 N Highland Ave',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        postal_code: '90068',
        latitude: 34.1122,
        longitude: -118.3399,
        max_capacity: 17500,
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        base_hourly_rate: 15000,
        contact_email: 'events@hollywoodbowl.com',
        slug: 'hollywood-bowl',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'The Beacon Theatre',
        description: 'Historic Upper West Side theater in Manhattan',
        venue_type: 'indoor',
        address: '2124 Broadway',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10023',
        latitude: 40.7794,
        longitude: -73.9825,
        max_capacity: 2894,
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        base_hourly_rate: 5000,
        contact_email: 'info@beacontheatre.com',
        slug: 'beacon-theatre',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'Red Rocks Amphitheatre',
        description: 'Natural rock formation venue in Colorado',
        venue_type: 'outdoor',
        address: '18300 W Alameda Pkwy',
        city: 'Morrison',
        state: 'CO',
        country: 'USA',
        postal_code: '80465',
        latitude: 39.6654,
        longitude: -105.2057,
        max_capacity: 9525,
        image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
        base_hourly_rate: 12000,
        contact_email: 'events@redrocks.com',
        slug: 'red-rocks-amphitheatre',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'The Fillmore',
        description: 'Historic music venue in San Francisco',
        venue_type: 'indoor',
        address: '1805 Geary Blvd',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postal_code: '94115',
        latitude: 37.7849,
        longitude: -122.4329,
        max_capacity: 1150,
        image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
        base_hourly_rate: 3000,
        contact_email: 'booking@thefillmore.com',
        slug: 'the-fillmore',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'Austin City Limits Live',
        description: 'Premier music venue in Austin',
        venue_type: 'indoor',
        address: '310 Willie Nelson Blvd',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        postal_code: '78701',
        latitude: 30.2630,
        longitude: -97.7441,
        max_capacity: 2750,
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        base_hourly_rate: 4500,
        contact_email: 'info@acllive.com',
        slug: 'austin-city-limits-live',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'Chicago Theatre',
        description: 'Historic landmark theater in downtown Chicago',
        venue_type: 'indoor',
        address: '175 N State St',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        postal_code: '60601',
        latitude: 41.8854,
        longitude: -87.6279,
        max_capacity: 3600,
        image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
        base_hourly_rate: 6000,
        contact_email: 'events@chicagotheatre.com',
        slug: 'chicago-theatre',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'The Gorge Amphitheatre',
        description: 'Scenic outdoor venue overlooking Columbia River',
        venue_type: 'outdoor',
        address: '754 Silica Rd NW',
        city: 'Quincy',
        state: 'WA',
        country: 'USA',
        postal_code: '98848',
        latitude: 47.0987,
        longitude: -119.9931,
        max_capacity: 27500,
        image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
        base_hourly_rate: 18000,
        contact_email: 'info@gorgeamphitheatre.net',
        slug: 'the-gorge-amphitheatre',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'The Ryman Auditorium',
        description: 'Mother Church of Country Music in Nashville',
        venue_type: 'indoor',
        address: '116 Rep John Lewis Way N',
        city: 'Nashville',
        state: 'TN',
        country: 'USA',
        postal_code: '37219',
        latitude: 36.1612,
        longitude: -86.7775,
        max_capacity: 2362,
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        base_hourly_rate: 4000,
        contact_email: 'events@ryman.com',
        slug: 'ryman-auditorium',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'House of Blues Houston',
        description: 'Intimate music venue with authentic blues atmosphere',
        venue_type: 'indoor',
        address: '1204 Caroline St',
        city: 'Houston',
        state: 'TX',
        country: 'USA',
        postal_code: '77002',
        latitude: 29.7542,
        longitude: -95.3615,
        max_capacity: 1100,
        image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
        base_hourly_rate: 2800,
        contact_email: 'booking@houseofblues.com',
        slug: 'house-of-blues-houston',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'The Greek Theatre Berkeley',
        description: 'Historic outdoor amphitheater in Berkeley Hills',
        venue_type: 'outdoor',
        address: '2001 Gayley Rd',
        city: 'Berkeley',
        state: 'CA',
        country: 'USA',
        postal_code: '94720',
        latitude: 37.8719,
        longitude: -122.2585,
        max_capacity: 8500,
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        base_hourly_rate: 8500,
        contact_email: 'info@thegreektheatre.com',
        slug: 'the-greek-theatre-berkeley',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      },
      {
        account_id: accountId,
        name: 'Warehouse Live Houston',
        description: 'Multi-room concert venue in downtown Houston',
        venue_type: 'indoor',
        address: '813 St Emanuel St',
        city: 'Houston',
        state: 'TX',
        country: 'USA',
        postal_code: '77003',
        latitude: 29.7428,
        longitude: -95.3467,
        max_capacity: 3500,
        image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
        base_hourly_rate: 3500,
        contact_email: 'bookings@warehouselive.com',
        slug: 'warehouse-live-houston',
        is_verified: true,
        is_active: true,
        created_by: user.user.id
      }
    ];

    console.log('🏢 Seeding venues...');
    let venueIds: string[] = [];
    
    for (let venue of venues) {
      const { data, error } = await client
        .from('venues')
        .insert(venue)
        .select('id')
        .single();
      
      if (error) {
        console.error('Error inserting venue:', venue.name, error);
      } else {
        console.log('✅ Inserted venue:', venue.name);
        venueIds.push(data.id);
      }
    }

    return { 
      success: true, 
      message: `Successfully seeded ${venueIds.length} venues`, 
      accountId,
      venueIds 
    };

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw new Response(JSON.stringify({ 
      success: false, 
      message: `Database seeding failed: ${error.message}` 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export default function SeedDatabase({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Seeding Results</h1>
      
      {loaderData.success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Success!</strong> {loaderData.message}
          {loaderData.accountId && (
            <p className="mt-2">Account ID: {loaderData.accountId}</p>
          )}
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error!</strong> {loaderData.message}
        </div>
      )}
    </div>
  );
}