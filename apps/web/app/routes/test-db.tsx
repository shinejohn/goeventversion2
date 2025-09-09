import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/test-db/+types/route';

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  
  // Debug logging
  console.log('=== TEST DB ROUTE ===');
  console.log('Client configured:', !!client);
  
  // Test 1: Check if we can connect to database
  const { data: authData, error: authError } = await client.auth.getUser();
  
  // Test 2: Try to fetch accounts data
  const { data: accounts, error: accountsError } = await client
    .from('accounts')
    .select('*')
    .limit(5);
    
  // Test 3: Check for users
  const { data: users, error: usersError, count } = await client
    .from('accounts')
    .select('*', { count: 'exact', head: true });
  
  return {
    auth: {
      user: authData?.user || null,
      error: authError?.message || null
    },
    accounts: {
      data: accounts || [],
      error: accountsError?.message || null,
      count: count || 0
    },
    dbStatus: {
      connected: !authError && !accountsError,
      hasData: (accounts?.length || 0) > 0
    }
  };
}

export default function TestDB(args: Route.ComponentArgs) {
  const { auth, accounts, dbStatus } = args.loaderData;
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
      
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${dbStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              Database Connection: {dbStatus.connected ? 'Connected' : 'Failed'}
            </p>
            <p className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${dbStatus.hasData ? 'bg-green-500' : 'bg-yellow-500'}`} />
              Has Data: {dbStatus.hasData ? 'Yes' : 'No data found'}
            </p>
          </div>
        </div>
        
        {/* Auth Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          {auth.error ? (
            <div className="text-red-600">
              <p>Auth Error: {auth.error}</p>
            </div>
          ) : auth.user ? (
            <div className="text-green-600">
              <p>Logged in as: {auth.user.email}</p>
              <p className="text-sm text-gray-600">ID: {auth.user.id}</p>
            </div>
          ) : (
            <p className="text-gray-600">Not authenticated</p>
          )}
        </div>
        
        {/* Accounts Data */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Accounts Table</h2>
          {accounts.error ? (
            <div className="text-red-600">
              <p>Error: {accounts.error}</p>
            </div>
          ) : accounts.count === 0 ? (
            <div className="text-yellow-600">
              <p>No accounts found in database.</p>
              <p className="text-sm mt-2">You may need to:</p>
              <ul className="list-disc list-inside text-sm">
                <li>Sign up for a new account</li>
                <li>Run database seed script</li>
                <li>Check RLS policies</li>
              </ul>
            </div>
          ) : (
            <div>
              <p className="text-green-600 mb-4">Found {accounts.count} accounts total</p>
              <div className="space-y-2">
                {accounts.data.map((account: any) => (
                  <div key={account.id} className="border p-3 rounded">
                    <p className="font-semibold">{account.name}</p>
                    <p className="text-sm text-gray-600">ID: {account.id}</p>
                    <p className="text-sm text-gray-600">
                      Type: {account.is_personal_account ? 'Personal' : 'Team'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <a 
              href="/auth/signup" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign Up
            </a>
            <a 
              href="/auth/login" 
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}