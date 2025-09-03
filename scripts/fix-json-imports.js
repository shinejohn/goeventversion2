#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToFix = [
  '/apps/web/app/routes/book-it/venues/$id/book/index.tsx',
  '/apps/web/app/routes/auth/sign-up.tsx',
  '/apps/web/app/routes/contact/index.tsx',
  '/apps/web/app/routes/bookings/index.tsx',
  '/apps/web/app/routes/c.$communitySlug.tsx',
  '/apps/web/app/routes/partner/index.tsx',
  '/apps/web/app/routes/careers/index.tsx',
  '/apps/web/app/routes/advertise/index.tsx'
];

async function fixJsonImports() {
  console.log('🔧 Fixing json imports in route files...\n');
  
  for (const file of filesToFix) {
    const filePath = path.join(__dirname, '..', file);
    
    try {
      let content = await fs.readFile(filePath, 'utf-8');
      const originalContent = content;
      
      // Remove json from import statements
      content = content.replace(
        /import\s*\{([^}]*)\}\s*from\s*['"]react-router['"]/g,
        (match, imports) => {
          // Split imports and filter out 'json'
          const importList = imports
            .split(',')
            .map(i => i.trim())
            .filter(i => i !== 'json');
          
          if (importList.length === 0) {
            return ''; // Remove the entire import if only json was imported
          }
          
          return `import { ${importList.join(', ')} } from 'react-router'`;
        }
      );
      
      // Replace json({ ... }) with plain object returns
      content = content.replace(
        /return\s+json\s*\(\s*\{([^}]+)\}\s*\)/g,
        'return {$1}'
      );
      
      // Replace json({ ... }) with multiple lines
      content = content.replace(
        /return\s+json\s*\(\s*\{([\s\S]*?)\}\s*\);/g,
        'return {$1};'
      );
      
      if (content !== originalContent) {
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`✅ Fixed: ${file}`);
      } else {
        console.log(`⏭️  No changes needed: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log('\n✨ Json import fixes complete!');
}

fixJsonImports().catch(console.error);