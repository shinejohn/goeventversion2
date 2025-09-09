#!/usr/bin/env node

// This script generates a env config file at build time
// It reads from process.env which Railway should provide

const fs = require('fs');
const path = require('path');

console.log('=== GENERATING ENV CONFIG ===');
console.log('Available env vars:', Object.keys(process.env).filter(k => k.startsWith('VITE_')));

const config = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key',
  VITE_SUPABASE_PUBLIC_KEY: process.env.VITE_SUPABASE_PUBLIC_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key',
};

console.log('Generated config:', {
  VITE_SUPABASE_URL: config.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: config.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
});

const output = `// Auto-generated at build time
export const ENV_CONFIG = ${JSON.stringify(config, null, 2)};
`;

fs.writeFileSync(
  path.join(__dirname, '../lib/env-config.generated.ts'),
  output
);

console.log('✅ Generated env-config.generated.ts');
console.log('=== END ENV CONFIG GENERATION ===');