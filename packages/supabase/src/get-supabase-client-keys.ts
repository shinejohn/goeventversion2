import { z } from 'zod';

/**
 * Returns and validates the Supabase client keys from the environment.
 */
export function getSupabaseClientKeys() {
  // Debug logging
  console.log('=== getSupabaseClientKeys DEBUG ===');
  console.log('import.meta.env.VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('import.meta.env.VITE_SUPABASE_PUBLIC_KEY:', import.meta.env.VITE_SUPABASE_PUBLIC_KEY);
  console.log('import.meta.env.VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log('All env vars:', Object.keys(import.meta.env).filter(k => k.includes('SUPABASE')));
  
  const url = import.meta.env.VITE_SUPABASE_URL;
  const publicKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY ??
        import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Final URL being used:', url);
  console.log('Final publicKey being used:', publicKey ? publicKey.substring(0, 20) + '...' : 'NOT SET');
  console.log('Has URL:', !!url);
  console.log('Has publicKey:', !!publicKey);
  console.log('=== END getSupabaseClientKeys DEBUG ===');
  
  if (!url || !publicKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('URL:', url || 'NOT SET');
    console.error('Public Key:', publicKey ? 'SET' : 'NOT SET');
    throw new Error(
      'Missing required Supabase environment variables. ' +
      'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
    );
  }

  return z
    .object({
      url: z.string().url().min(1),
      publicKey: z.string().min(1),
    })
    .parse({
      url,
      publicKey,
    });
}
