#!/usr/bin/env node

/**
 * Quick Import Fixer
 * 
 * Based on the analysis, all component imports are correct paths
 * The issue is that components exist but TypeScript can't find them
 * This suggests the issue is with index exports, not import paths
 */

const fs = require('fs');
const path = require('path');

const fixes = [
  // The main issues are likely index.ts exports for directory-based imports
  {
    directory: 'apps/web/app/components/magic-patterns/pages/help',
    file: 'help.tsx',
    createIndexTs: true
  },
  {
    directory: 'apps/web/app/components/magic-patterns/pages/hubs',
    file: 'index.tsx',
    createIndexTs: true
  }
];

console.log('🔧 Quick Import Fixer\n');

// Check if we need to create index.ts files for directory imports
console.log('📋 Checking for missing index.ts exports...\n');

const dirsNeedingIndex = [
  'apps/web/app/components/magic-patterns/pages/help',
  'apps/web/app/components/magic-patterns/pages/hubs',
];

let fixCount = 0;

for (const dir of dirsNeedingIndex) {
  const indexPath = path.join(dir, 'index.ts');
  
  if (!fs.existsSync(indexPath)) {
    // Find the main component file
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const componentFile = files.find(f => f.endsWith('.tsx') && f !== 'index.tsx');
      
      if (componentFile) {
        const componentName = componentFile.replace('.tsx', '');
        const exportContent = `export { default } from './${componentName}';\n`;
        
        fs.writeFileSync(indexPath, exportContent);
        console.log(`✅ Created ${indexPath}`);
        console.log(`   Export: ${exportContent.trim()}\n`);
        fixCount++;
      }
    }
  } else {
    console.log(`ℹ️  ${indexPath} already exists\n`);
  }
}

// Remove unnecessary type imports from files that don't have loaders/actions
console.log('🗑️  Removing unnecessary type imports...\n');

const unnecessaryTypeImports = [
  'apps/web/app/routes/book/performer.tsx',
  'apps/web/app/routes/calendars/marketplace.tsx',
  'apps/web/app/routes/social/messages.tsx',
  'apps/web/app/routes/social/notifications.tsx',
  'apps/web/app/routes/tickets/buy.tsx'
];

for (const filePath of unnecessaryTypeImports) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remove the type import line
    content = content.replace(/import\s+type\s+{\s*Route\s*}\s+from\s+['"'][^'"]*\+types[^'"]*['"];?\s*\n?/g, '');
    
    // Also remove Route type usage if it exists
    content = content.replace(/:\s*Route\.\w+/g, '');
    content = content.replace(/props:\s*Route\.\w+/g, '');
    content = content.replace(/<Route\.\w+>/g, '');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Removed type import: ${filePath}`);
      fixCount++;
    }
  }
}

console.log('\n' + '='.repeat(60));
console.log(`🎉 Applied ${fixCount} fixes!`);
console.log('\nNext steps:');
console.log('1. Run: cd apps/web && pnpm react-router typegen');
console.log('2. Run: cd apps/web && pnpm typecheck');
console.log('3. Remaining errors should be actual TS issues, not import issues');