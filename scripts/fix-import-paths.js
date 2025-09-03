#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all new route files
const routeFiles = glob.sync('apps/web/app/routes/**/index.tsx')
  .concat(glob.sync('apps/web/app/routes/**/$*.tsx'))
  .filter(file => !file.includes('_components'));

console.log(`Fixing imports in ${routeFiles.length} route files...`);

routeFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Remove .tsx from imports
    if (content.includes('.tsx')) {
      content = content.replace(/from '([^']+)\.tsx'/g, "from '$1'");
      modified = true;
    }
    
    // Remove json import if not used
    if (content.includes('json, redirect') && !content.includes('json(') && !content.includes('redirect(')) {
      content = content.replace(/import { json, redirect } from 'react-router';\s*/, '');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`✓ Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${file}: ${error.message}`);
  }
});

console.log('✅ Done fixing import paths');