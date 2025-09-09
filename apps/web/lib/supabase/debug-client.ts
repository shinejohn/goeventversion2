// Debug wrapper to log Supabase client initialization
export function debugSupabaseInit() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('=== SUPABASE DEBUG INFO ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VITE_SUPABASE_URL:', url);
  console.log('VITE_SUPABASE_URL type:', typeof url);
  console.log('VITE_SUPABASE_URL length:', url?.length);
  console.log('VITE_SUPABASE_URL starts with https:', url?.startsWith('https://'));
  console.log('VITE_SUPABASE_URL includes placeholder:', url?.includes('placeholder'));
  console.log('VITE_SUPABASE_ANON_KEY exists:', !!anonKey);
  console.log('VITE_SUPABASE_ANON_KEY length:', anonKey?.length);
  console.log('VITE_SUPABASE_ANON_KEY is placeholder:', anonKey === 'placeholder-key');
  console.log('=== END SUPABASE DEBUG ===');
  
  return { url, anonKey };
}