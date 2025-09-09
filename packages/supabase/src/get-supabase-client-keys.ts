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
  
  const url = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
  const publicKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY ??
        import.meta.env.VITE_SUPABASE_ANON_KEY ??
        'placeholder-key';
  
  console.log('Final URL being used:', url);
  console.log('Final publicKey being used:', publicKey.substring(0, 20) + '...');
  console.log('Using fallback URL?', url === 'https://placeholder.supabase.co');
  console.log('Using fallback key?', publicKey === 'placeholder-key');
  console.log('=== END getSupabaseClientKeys DEBUG ===');
  
  return z
    .object({
      url: z.string().min(1),
      publicKey: z.string().min(1),
    })
    .parse({
      url,
      publicKey,
    });
}
