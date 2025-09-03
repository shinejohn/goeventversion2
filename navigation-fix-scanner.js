#!/usr/bin/env node

/**
 * Navigation Fix Scanner
 * 
 * Identifies and fixes navigation issues:
 * 1. Missing module imports
 * 2. Type declaration errors
 * 3. Route configuration mismatches
 * 4. Dead routes pointing to non-existent components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NavigationFixScanner {
  constructor() {
    this.issues = {
      missingModules: [],
      typeErrors: [],
      routeMismatches: [],
      deadRoutes: []
    };
    
    // Map of routes to their expected component files
    this.routeMap = new Map();
    
    // Components referenced in disabled App.tsx
    this.appTsxComponents = new Set();
  }

  async scan() {
    console.log('🔍 Navigation Fix Scanner\n');
    
    // 1. Parse disabled App.tsx to get all component references
    await this.parseAppTsx();
    
    // 2. Scan all route files
    await this.scanRoutes();
    
    // 3. Check if components actually exist
    await this.verifyComponents();
    
    // 4. Check for type declaration issues
    await this.checkTypeDeclarations();
    
    // 5. Generate fixes
    this.generateFixes();
  }

  // Parse the disabled App.tsx to understand component structure
  async parseAppTsx() {
    console.log('📋 Parsing App.tsx for component inventory...\n');
    
    const appTsxPath = './apps/web/app/components/magic-patterns/App.tsx.disabled';
    if (fs.existsSync(appTsxPath)) {
      const content = fs.readFileSync(appTsxPath, 'utf8');
      
      // Extract all imports
      const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]([^'"]+)['"]/g;
      let match;
      
      while ((match = importRegex.exec(content)) !== null) {
        const componentName = match[1].trim();
        const importPath = match[2];
        
        if (importPath.startsWith('./pages/')) {
          this.appTsxComponents.add({
            name: componentName,
            path: importPath.replace('./', '')
          });
        }
      }
      
      console.log(`Found ${this.appTsxComponents.size} components in App.tsx\n`);
    }
  }

  // Scan all route files
  async scanRoutes() {
    console.log('📂 Scanning route files...\n');
    
    const routesDir = './apps/web/app/routes';
    this.scanDirectory(routesDir);
    
    console.log(`Found ${this.routeMap.size} route files\n`);
  }

  scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('_')) {
        this.scanDirectory(fullPath);
      } else if (file.endsWith('.tsx') && !file.startsWith('_')) {
        this.analyzeRouteFile(fullPath);
      }
    }
  }

  analyzeRouteFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for Magic Patterns imports
    const importRegex = /import\s*(?:{[^}]*}|\w+)\s*from\s*['"]([^'"]+magic-patterns[^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      const routeName = path.relative('./apps/web/app/routes', filePath);
      
      this.routeMap.set(routeName, {
        file: filePath,
        imports: importPath,
        exists: null // Will check later
      });
      
      // Check if it's a "Cannot find module" candidate
      if (importPath.includes('~/components/magic-patterns/')) {
        const componentPath = importPath.replace('~/', './apps/web/');
        const fullPath = componentPath + '.tsx';
        
        if (!fs.existsSync(fullPath)) {
          // Try without .tsx
          if (!fs.existsSync(componentPath)) {
            this.issues.missingModules.push({
              route: routeName,
              import: importPath,
              expectedPath: fullPath
            });
          }
        }
      }
    }
  }

  // Verify components exist
  async verifyComponents() {
    console.log('✅ Verifying component existence...\n');
    
    const pagesDir = './apps/web/app/components/magic-patterns/pages';
    const existingPages = new Set();
    
    // Get all existing pages
    this.collectPages(pagesDir, existingPages);
    
    // Check each route's import
    for (const [route, info] of this.routeMap) {
      const importPath = info.imports;
      const pageName = importPath.split('/').pop();
      
      if (!existingPages.has(pageName)) {
        this.issues.deadRoutes.push({
          route,
          import: importPath,
          suggestion: this.findSimilarPage(pageName, existingPages)
        });
      }
    }
  }

  collectPages(dir, pagesSet, prefix = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.collectPages(fullPath, pagesSet, prefix + file + '/');
      } else if (file.endsWith('.tsx')) {
        pagesSet.add(prefix + file.replace('.tsx', ''));
      }
    }
  }

  findSimilarPage(pageName, existingPages) {
    // Simple similarity check
    for (const page of existingPages) {
      if (page.toLowerCase().includes(pageName.toLowerCase()) ||
          pageName.toLowerCase().includes(page.toLowerCase())) {
        return page;
      }
    }
    return null;
  }

  // Check for type declaration issues
  async checkTypeDeclarations() {
    console.log('🔍 Checking type declarations...\n');
    
    try {
      // Run tsc and capture output
      const output = execSync('cd apps/web && pnpm tsc --noEmit 2>&1 || true', {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10
      });
      
      // Parse TypeScript errors
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes('TS2307: Cannot find module')) {
          const match = line.match(/Cannot find module '([^']+)'/);
          if (match && match[1].includes('magic-patterns')) {
            this.issues.typeErrors.push({
              module: match[1],
              file: line.split('(')[0].trim()
            });
          }
        }
      }
    } catch (e) {
      // Errors are expected
    }
  }

  // Generate fixes
  generateFixes() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 NAVIGATION ISSUES REPORT');
    console.log('='.repeat(60));

    // Missing modules
    if (this.issues.missingModules.length > 0) {
      console.log('\n❌ MISSING MODULES:');
      for (const issue of this.issues.missingModules) {
        console.log(`\n  Route: ${issue.route}`);
        console.log(`  Import: ${issue.import}`);
        console.log(`  Fix: Check if file exists at ${issue.expectedPath}`);
      }
    }

    // Dead routes
    if (this.issues.deadRoutes.length > 0) {
      console.log('\n❌ DEAD ROUTES (importing non-existent components):');
      for (const issue of this.issues.deadRoutes) {
        console.log(`\n  Route: ${issue.route}`);
        console.log(`  Trying to import: ${issue.import}`);
        if (issue.suggestion) {
          console.log(`  Suggestion: Maybe you meant '${issue.suggestion}'?`);
        }
      }
    }

    // Type errors
    if (this.issues.typeErrors.length > 0) {
      console.log('\n❌ TYPE DECLARATION ERRORS:');
      const uniqueModules = new Set(this.issues.typeErrors.map(e => e.module));
      for (const module of uniqueModules) {
        console.log(`  - ${module}`);
      }
    }

    // Generate fix script
    this.generateFixScript();
  }

  generateFixScript() {
    console.log('\n\n🛠️  AUTOMATED FIXES:\n');

    // Check for common issues
    const fixes = [];

    // 1. Check if we need index.ts exports
    console.log('1. Check for missing index.ts exports:');
    console.log('   find ./apps/web/app/components/magic-patterns/pages -type d -exec bash -c \'[ ! -f "$0/index.ts" ] && echo "Missing index.ts in $0"\' {} \\;');

    // 2. Fix import paths
    console.log('\n2. Common import path fixes:');
    
    for (const issue of this.issues.missingModules) {
      const importPath = issue.import;
      
      // If it's looking for a directory, might need index.ts
      if (importPath.endsWith('/index') || !importPath.includes('.')) {
        const basePath = importPath.replace('~/components/magic-patterns/pages/', '');
        console.log(`   - Check if ${basePath}/index.tsx exists`);
        console.log(`   - Or create export: echo "export { default } from './${basePath}';" > apps/web/app/components/magic-patterns/pages/${basePath}/index.ts`);
      }
    }

    // 3. Route fixes
    console.log('\n3. Route file fixes:');
    for (const issue of this.issues.deadRoutes) {
      if (issue.suggestion) {
        console.log(`   - In ${issue.route}: change import from '${issue.import.split('/').pop()}' to '${issue.suggestion}'`);
      }
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      issues: this.issues,
      routeMap: Array.from(this.routeMap.entries())
    };
    
    fs.writeFileSync('navigation-issues-report.json', JSON.stringify(report, null, 2));
    console.log('\n\n📄 Detailed report saved to: navigation-issues-report.json');
  }
}

// Quick navigation health check
class QuickNavCheck {
  static async check() {
    console.log('⚡ Quick Navigation Health Check\n');
    
    // Count different types of issues
    const checks = [
      {
        name: 'Routes importing from magic-patterns',
        command: 'find ./apps/web/app/routes -name "*.tsx" -exec grep -l "magic-patterns" {} \\; | wc -l'
      },
      {
        name: 'Magic Patterns pages',
        command: 'find ./apps/web/app/components/magic-patterns/pages -name "*.tsx" | wc -l'
      },
      {
        name: 'TypeScript "Cannot find module" errors',
        command: 'cd apps/web && pnpm tsc --noEmit 2>&1 | grep -c "TS2307.*magic-patterns" || echo 0'
      }
    ];

    for (const check of checks) {
      try {
        const result = execSync(check.command, { encoding: 'utf8' }).trim();
        console.log(`${check.name}: ${result}`);
      } catch (e) {
        console.log(`${check.name}: Error`);
      }
    }

    console.log('\nRun full scan: node navigation-fix-scanner.js');
  }
}

// Main
if (require.main === module) {
  const arg = process.argv[2];
  
  if (arg === '--quick') {
    QuickNavCheck.check();
  } else {
    const scanner = new NavigationFixScanner();
    scanner.scan().catch(console.error);
  }
}

module.exports = NavigationFixScanner;