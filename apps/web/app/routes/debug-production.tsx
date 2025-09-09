import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/debug-production/+types/route';

export async function loader({ request }: Route.LoaderArgs) {
  console.log('=== DEBUG PRODUCTION ROUTE ===');
  
  // Log environment variables (safely)
  const envVars = {
    hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    supabaseUrlPrefix: import.meta.env.VITE_SUPABASE_URL?.substring(0, 30) + '...',
    hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    nodeEnv: process.env.NODE_ENV,
    allViteKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
  };
  
  console.log('Environment check:', envVars);
  
  let supabaseStatus = { connected: false, error: null as any };
  let authStatus = { user: null as any, error: null as any };
  let dataTests = {
    accounts: { count: 0, error: null as any, sample: null as any },
    users: { count: 0, error: null as any }
  };
  
  try {
    const client = getSupabaseServerClient(request);
    supabaseStatus.connected = true;
    
    // Test auth
    const { data: authData, error: authError } = await client.auth.getUser();
    authStatus.user = authData?.user;
    authStatus.error = authError;
    
    // Test accounts table (with and without auth)
    const { data: accounts, error: accountsError, count: accountsCount } = await client
      .from('accounts')
      .select('id, name, is_personal_account', { count: 'exact' })
      .limit(5);
      
    dataTests.accounts.count = accountsCount || 0;
    dataTests.accounts.error = accountsError;
    dataTests.accounts.sample = accounts?.[0];
    
    // Test direct user query
    const { count: usersCount, error: usersError } = await client
      .from('accounts')
      .select('*', { count: 'exact', head: true })
      .eq('is_personal_account', true);
      
    dataTests.users.count = usersCount || 0;
    dataTests.users.error = usersError;
    
    console.log('Data tests:', dataTests);
    
  } catch (err) {
    supabaseStatus.error = err;
    console.error('Supabase connection error:', err);
  }
  
  return {
    timestamp: new Date().toISOString(),
    environment: envVars,
    supabase: supabaseStatus,
    auth: authStatus,
    data: dataTests
  };
}

export default function DebugProduction({ loaderData }: Route.ComponentArgs) {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Production Debug Information</h1>
      
      {/* Environment Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="space-y-2 text-sm font-mono">
          <p>Has VITE_SUPABASE_URL: {loaderData.environment.hasSupabaseUrl ? '✅' : '❌'}</p>
          <p>Has VITE_SUPABASE_ANON_KEY: {loaderData.environment.hasAnonKey ? '✅' : '❌'}</p>
          <p>Node Environment: {loaderData.environment.nodeEnv}</p>
          <p>VITE Keys Found: {loaderData.environment.allViteKeys.length}</p>
          {loaderData.environment.supabaseUrlPrefix && (
            <p>Supabase URL: {loaderData.environment.supabaseUrlPrefix}</p>
          )}
        </div>
      </div>
      
      {/* Supabase Connection */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Supabase Connection</h2>
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${loaderData.supabase.connected ? 'bg-green-500' : 'bg-red-500'}`} />
            Status: {loaderData.supabase.connected ? 'Connected' : 'Failed'}
          </p>
          {loaderData.supabase.error && (
            <p className="text-red-600 text-sm">Error: {JSON.stringify(loaderData.supabase.error)}</p>
          )}
        </div>
      </div>
      
      {/* Auth Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        {loaderData.auth.user ? (
          <div className="text-green-600">
            <p>Authenticated User: {loaderData.auth.user.email}</p>
            <p className="text-sm text-gray-600">ID: {loaderData.auth.user.id}</p>
          </div>
        ) : (
          <p className="text-gray-600">Not authenticated</p>
        )}
        {loaderData.auth.error && (
          <p className="text-red-600 text-sm mt-2">Error: {JSON.stringify(loaderData.auth.error)}</p>
        )}
      </div>
      
      {/* Data Access Tests */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Data Access Tests</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Accounts Table:</h3>
          <p>Total Count: {loaderData.data.accounts.count}</p>
          {loaderData.data.accounts.error ? (
            <p className="text-red-600 text-sm">Error: {JSON.stringify(loaderData.data.accounts.error)}</p>
          ) : loaderData.data.accounts.sample ? (
            <div className="text-sm bg-gray-50 p-2 rounded mt-2">
              <p>Sample Account:</p>
              <pre>{JSON.stringify(loaderData.data.accounts.sample, null, 2)}</pre>
            </div>
          ) : (
            <p className="text-yellow-600">No accounts found</p>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Personal Accounts:</h3>
          <p>Count: {loaderData.data.users.count}</p>
          {loaderData.data.users.error && (
            <p className="text-red-600 text-sm">Error: {JSON.stringify(loaderData.data.users.error)}</p>
          )}
        </div>
      </div>
      
      {/* Timestamp */}
      <div className="text-sm text-gray-600">
        Generated at: {loaderData.timestamp}
      </div>
    </div>
  );
}