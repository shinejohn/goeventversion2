#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface PageAnalysis {
  path: string;
  hasLoader: boolean;
  hasSupabaseClient: boolean;
  queryTables: string[];
  isMagicPatterns: boolean;
  componentUsed: string | null;
  status: 'connected' | 'static' | 'partial';
}

async function analyzePages() {
  const routesDir = path.join(process.cwd(), 'apps/web/app/routes');
  const files = await glob('**/*.{tsx,ts}', { 
    cwd: routesDir,
    ignore: ['**/*.d.ts', '**/_*.{tsx,ts}']
  });

  const results: PageAnalysis[] = [];

  for (const file of files) {
    const filePath = path.join(routesDir, file);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    
    // Check for loader/data fetching
    const hasLoader = content.includes('export async function loader') || 
                     content.includes('export const loader');
    
    // Check for Supabase client
    const hasSupabaseClient = content.includes('getSupabaseServerClient') ||
                             content.includes('useSupabase') ||
                             content.includes('createBrowserClient');
    
    // Find table queries
    const tableMatches = content.matchAll(/\.from\(['"`](\w+)['"`]\)/g);
    const queryTables = Array.from(tableMatches, m => m[1]);
    
    // Check if it's a Magic Patterns page
    const isMagicPatterns = content.includes('createMagicPatternsRoute') ||
                           content.includes('components/magic-patterns');
    
    // Find component used
    let componentUsed = null;
    const componentMatch = content.match(/import\s+{\s*(\w+)\s*}\s+from\s+['"`].*magic-patterns.*['"`]/);
    if (componentMatch) {
      componentUsed = componentMatch[1];
    }
    
    // Determine status
    let status: 'connected' | 'static' | 'partial' = 'static';
    if (hasLoader && hasSupabaseClient && queryTables.length > 0) {
      status = 'connected';
    } else if (hasLoader || hasSupabaseClient || queryTables.length > 0) {
      status = 'partial';
    }
    
    results.push({
      path: file,
      hasLoader,
      hasSupabaseClient,
      queryTables: [...new Set(queryTables)],
      isMagicPatterns,
      componentUsed,
      status
    });
  }
  
  // Generate report
  console.log('# Database Connection Inventory Report\n');
  console.log(`Total routes analyzed: ${results.length}\n`);
  
  const connected = results.filter(r => r.status === 'connected');
  const partial = results.filter(r => r.status === 'partial');
  const static = results.filter(r => r.status === 'static');
  const magicPatterns = results.filter(r => r.isMagicPatterns);
  
  console.log('## Summary:');
  console.log(`- ✅ Fully connected to database: ${connected.length} (${Math.round(connected.length / results.length * 100)}%)`);
  console.log(`- ⚠️  Partially connected: ${partial.length} (${Math.round(partial.length / results.length * 100)}%)`);
  console.log(`- ❌ Static pages: ${static.length} (${Math.round(static.length / results.length * 100)}%)`);
  console.log(`- 🎨 Magic Patterns pages: ${magicPatterns.length}\n`);
  
  console.log('## Fully Connected Pages (with working database access):');
  connected.forEach(page => {
    console.log(`\n### ${page.path}`);
    console.log(`- Tables: ${page.queryTables.join(', ') || 'none'}`);
    if (page.isMagicPatterns) {
      console.log(`- Magic Patterns Component: ${page.componentUsed}`);
    }
  });
  
  console.log('\n## Partially Connected Pages (incomplete database setup):');
  partial.forEach(page => {
    console.log(`\n### ${page.path}`);
    console.log(`- Has loader: ${page.hasLoader ? '✅' : '❌'}`);
    console.log(`- Has Supabase client: ${page.hasSupabaseClient ? '✅' : '❌'}`);
    console.log(`- Tables queried: ${page.queryTables.join(', ') || 'none'}`);
    if (page.isMagicPatterns) {
      console.log(`- Magic Patterns Component: ${page.componentUsed}`);
    }
  });
  
  console.log('\n## Static Pages (no database connection):');
  const staticMagicPatterns = static.filter(p => p.isMagicPatterns);
  const staticRegular = static.filter(p => !p.isMagicPatterns);
  
  console.log('\n### Magic Patterns Static Pages:');
  staticMagicPatterns.forEach(page => {
    console.log(`- ${page.path} (Component: ${page.componentUsed})`);
  });
  
  console.log('\n### Regular Static Pages:');
  staticRegular.forEach(page => {
    console.log(`- ${page.path}`);
  });
  
  // Table usage summary
  const allTables = connected.flatMap(p => p.queryTables)
    .concat(partial.flatMap(p => p.queryTables));
  const tableUsage = allTables.reduce((acc, table) => {
    acc[table] = (acc[table] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n## Database Tables Usage:');
  Object.entries(tableUsage)
    .sort((a, b) => b[1] - a[1])
    .forEach(([table, count]) => {
      console.log(`- ${table}: ${count} queries`);
    });
}

analyzePages().catch(console.error);