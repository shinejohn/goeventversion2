#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directory containing routes
const routesDir = path.join(__dirname, 'apps', 'web', 'app', 'routes');

let filesProcessed = 0;
let filesModified = 0;

// Function to recursively find all .tsx files
function findTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findTsxFiles(fullPath, files);
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  });
  
  return files;
}

// Function to add React import if missing
function addReactImport(filePath) {
  filesProcessed++;
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if React is already imported
  if (content.includes("import React") || content.includes("import * as React") || content.includes("from 'react'")) {
    console.log(`✓ ${path.relative(__dirname, filePath)} - React already imported`);
    return;
  }
  
  // Add React import at the beginning
  const newContent = `import React from 'react';\n` + content;
  fs.writeFileSync(filePath, newContent);
  filesModified++;
  console.log(`✅ ${path.relative(__dirname, filePath)} - Added React import`);
}

// Main execution
console.log('🔍 Searching for .tsx files in routes directory...\n');

try {
  const tsxFiles = findTsxFiles(routesDir);
  console.log(`Found ${tsxFiles.length} .tsx files\n`);
  
  tsxFiles.forEach(file => {
    addReactImport(file);
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`- Files processed: ${filesProcessed}`);
  console.log(`- Files modified: ${filesModified}`);
  console.log(`- Files already had React: ${filesProcessed - filesModified}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}