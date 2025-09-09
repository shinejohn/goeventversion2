import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import type { Route } from '~/types/app/routes/check-tables/+types/route';

export async function loader({ request }: Route.LoaderArgs) {
  console.log('=== CHECK TABLES ROUTE ===');
  
  const client = getSupabaseServerClient(request);
  
  // List of tables we expect to have data
  const tablesToCheck = [
    'events',
    'venues',
    'performers',
    'accounts',
    'users',
    'profiles'
  ];
  
  const results: Record<string, any> = {};
  
  // Check each table
  for (const table of tablesToCheck) {
    try {
      const { count, error, data } = await client
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(1);
      
      results[table] = {
        exists: !error || !error.message.includes('relation'),
        count: count || 0,
        error: error?.message || null,
        sample: data?.[0] || null,
        hasData: (count || 0) > 0
      };
      
      console.log(`Table ${table}:`, results[table]);
    } catch (err: any) {
      results[table] = {
        exists: false,
        count: 0,
        error: err.message,
        sample: null,
        hasData: false
      };
    }
  }
  
  // Also check what tables actually exist using a different approach
  let allTables: string[] = [];
  try {
    // This query lists all tables in the public schema
    const { data, error } = await client
      .from('accounts') // Use any known table
      .select('id')
      .limit(0); // We don't need data, just testing connection
      
    if (!error) {
      console.log('Database connection successful');
    }
  } catch (err) {
    console.error('Database connection error:', err);
  }
  
  return {
    tables: results,
    timestamp: new Date().toISOString(),
    connection: {
      url: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set',
      key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
    }
  };
}

export default function CheckTables({ loaderData }: Route.ComponentArgs) {
  const { tables, timestamp, connection } = loaderData;
  
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Database Tables Check</h1>
      
      {/* Connection Status */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <p>Supabase URL: {connection.url}</p>
        <p>Supabase Key: {connection.key}</p>
      </div>
      
      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(tables).map(([tableName, info]) => (
          <div 
            key={tableName}
            className={`bg-white p-4 rounded-lg shadow ${
              info.exists && info.hasData 
                ? 'border-2 border-green-500' 
                : info.exists 
                ? 'border-2 border-yellow-500'
                : 'border-2 border-red-500'
            }`}
          >
            <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
              {tableName}
              <span className={`text-sm ${
                info.exists && info.hasData 
                  ? 'text-green-600' 
                  : info.exists 
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {info.exists && info.hasData ? '✅' : info.exists ? '⚠️' : '❌'}
              </span>
            </h3>
            
            <div className="text-sm space-y-1">
              <p>Exists: {info.exists ? 'Yes' : 'No'}</p>
              <p>Row Count: {info.count}</p>
              {info.error && (
                <p className="text-red-600 text-xs mt-2">
                  Error: {info.error}
                </p>
              )}
              {info.sample && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">
                    View sample data
                  </summary>
                  <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(info.sample, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        Checked at: {timestamp}
      </div>
    </div>
  );
}