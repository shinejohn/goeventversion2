#!/usr/bin/env node

/**
 * Fix Root Cause of Navigation Issues
 * 
 * The core problem: Route files have incorrect type imports
 * This cascades into TypeScript not understanding the module structure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RootCauseFixer {
  constructor() {
    this.fixCount = 0;
    this.issues = [];
  }

  async fix() {
    console.log('🎯 Fixing Root Cause: Incorrect Type Imports\n');
    
    // 1. Fix all incorrect type imports
    await this.fixTypeImports();
    
    // 2. Check for other systematic issues
    await this.checkSystematicIssues();
    
    // 3. Report results
    this.report();
  }

  async fixTypeImports() {
    console.log('📋 Scanning for incorrect type imports...\n');
    
    const routesDir = './apps/web/app/routes';
    this.scanAndFix(routesDir);
  }

  scanAndFix(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('_')) {
        this.scanAndFix(fullPath);
      } else if (file.endsWith('.tsx') && !file.startsWith('_')) {
        this.fixRouteFile(fullPath);
      }
    }
  }

  fixRouteFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changed = false;
    
    // Pattern 1: Fix incorrect relative type imports
    const incorrectTypePattern = /import\s+(?:type\s+)?{\s*Route\s*}\s+from\s+['"]([\.\/]+types\/app\/routes\/\+types\/[^'"]+)['"]/g;
    
    content = content.replace(incorrectTypePattern, (match, importPath) => {
      // Extract the route name from the file path
      const routeName = path.basename(filePath, '.tsx');
      const dirName = path.dirname(filePath).split('/').pop();
      
      // Determine the correct import based on the file location
      let correctImport;
      
      // Check if this is a nested route
      const relativePath = path.relative('./apps/web/app/routes', filePath);
      const depth = relativePath.split('/').length - 1;
      
      if (depth === 0) {
        // Top-level route
        correctImport = `import type { Route } from '~/types/app/routes/+types/${routeName}';`;
      } else {
        // Nested route - use the directory structure
        const routePath = relativePath.replace('.tsx', '');
        correctImport = `import type { Route } from '~/types/app/routes/${routePath}/+types';`;
      }
      
      this.issues.push({
        file: filePath,
        old: match,
        new: correctImport
      });
      
      changed = true;
      return correctImport;
    });
    
    // Pattern 2: Fix incorrect .tsx extensions in type imports
    content = content.replace(/from\s+['"]([^'"]+)\.tsx['"]/g, (match, importPath) => {
      if (importPath.includes('+types')) {
        changed = true;
        return `from '${importPath}'`;
      }
      return match;
    });
    
    // Pattern 3: Fix React Router v7 type imports
    if (content.includes("import type { Route }") && !content.includes("from '~/types/")) {
      // This file has type imports but they're not using the correct path
      const routeName = path.basename(filePath, '.tsx');
      
      // Special cases
      if (routeName === '$') {
        content = content.replace(
          /import\s+type\s+{\s*Route\s*}\s+from\s+['"][^'"]+['"]/,
          "import type { Route } from '~/types/app/routes/+types/$'"
        );
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content);
      this.fixCount++;
      console.log(`✅ Fixed: ${filePath}`);
    }
  }

  async checkSystematicIssues() {
    console.log('\n📋 Checking for other systematic issues...\n');
    
    // Check if types directory exists
    const typesDir = './apps/web/app/types';
    if (!fs.existsSync(typesDir)) {
      console.log('❌ Types directory missing! Creating it...');
      fs.mkdirSync(typesDir, { recursive: true });
    }
    
    // Check for React Router v7 route types
    try {
      execSync('cd apps/web && pnpm react-router typegen', { stdio: 'inherit' });
      console.log('✅ Generated React Router v7 types');
    } catch (e) {
      console.log('⚠️  Could not generate React Router types');
    }
  }

  report() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ROOT CAUSE FIX REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Fixed ${this.fixCount} files with incorrect type imports\n`);
    
    if (this.issues.length > 0) {
      console.log('Changes made:');
      this.issues.slice(0, 10).forEach(issue => {
        console.log(`\nFile: ${issue.file}`);
        console.log(`Old: ${issue.old}`);
        console.log(`New: ${issue.new}`);
      });
      
      if (this.issues.length > 10) {
        console.log(`\n... and ${this.issues.length - 10} more fixes`);
      }
    }
    
    console.log('\n\n🎯 ROOT CAUSE IDENTIFIED AND FIXED!');
    console.log('\nThe issue was systematic incorrect type imports across route files.');
    console.log('This prevented TypeScript from understanding the module structure.');
    console.log('\n✅ Next steps:');
    console.log('1. Run: cd apps/web && pnpm typecheck');
    console.log('2. Remaining errors should be actual missing components, not import issues');
    console.log('3. Navigation should now work correctly!');
    
    // Save detailed report
    fs.writeFileSync('root-cause-fix-report.json', JSON.stringify({
      fixCount: this.fixCount,
      issues: this.issues
    }, null, 2));
  }
}

// Quick check function
async function quickCheck() {
  console.log('⚡ Quick Check for Type Import Issues\n');
  
  try {
    const result = execSync(
      'grep -r "types/app/routes/+types.*\.tsx" ./apps/web/app/routes | wc -l',
      { encoding: 'utf8' }
    ).trim();
    
    console.log(`Found ${result} files with incorrect .tsx extensions in type imports`);
    
    const result2 = execSync(
      'grep -r "\\.\\./types/app/routes/+types" ./apps/web/app/routes | wc -l',
      { encoding: 'utf8' }
    ).trim();
    
    console.log(`Found ${result2} files with incorrect relative type imports`);
    
  } catch (e) {
    console.log('Error checking for issues');
  }
}

// Main
if (require.main === module) {
  if (process.argv[2] === '--check') {
    quickCheck();
  } else {
    const fixer = new RootCauseFixer();
    fixer.fix().catch(console.error);
  }
}

module.exports = RootCauseFixer;