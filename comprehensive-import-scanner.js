#!/usr/bin/env node

/**
 * Comprehensive Import Scanner
 * 
 * Analyzes both type import errors and component import errors
 * and provides specific fixes for each
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ComprehensiveImportScanner {
  constructor() {
    this.typeErrors = [];
    this.componentErrors = [];
    this.routeComponents = new Map();
    this.availableComponents = new Map();
    this.fixes = [];
  }

  async scan() {
    console.log('🔍 Comprehensive Import Analysis\n');
    
    // 1. Map all available Magic Patterns components
    await this.mapAvailableComponents();
    
    // 2. Extract route imports
    await this.extractRouteImports();
    
    // 3. Run TypeScript check to get actual errors
    await this.getTypeScriptErrors();
    
    // 4. Generate fixes
    this.generateFixes();
    
    // 5. Show report
    this.showReport();
  }

  async mapAvailableComponents() {
    console.log('📋 Mapping available Magic Patterns components...\n');
    
    const pagesDir = './app/components/magic-patterns/pages';
    this.scanComponentDirectory(pagesDir, '');
    
    const componentsDir = './app/components/magic-patterns/components';
    this.scanComponentDirectory(componentsDir, '', 'components');
    
    console.log(`Found ${this.availableComponents.size} available components\n`);
  }

  scanComponentDirectory(dir, prefix = '', type = 'pages') {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.scanComponentDirectory(fullPath, prefix + file + '/', type);
      } else if (file.endsWith('.tsx') && !file.includes('.ssr-backup')) {
        const componentName = file.replace('.tsx', '');
        const componentPath = prefix + componentName;
        
        // Read the file to determine export type
        const content = fs.readFileSync(fullPath, 'utf8');
        const hasDefaultExport = content.includes('export default');
        const hasNamedExport = content.match(/export\s+(const|function|class)\s+(\w+)/);
        
        this.availableComponents.set(componentPath, {
          fullPath,
          name: componentName,
          hasDefaultExport,
          hasNamedExport: hasNamedExport ? hasNamedExport[2] : null,
          type
        });
      }
    }
  }

  async extractRouteImports() {
    console.log('🔍 Extracting route imports...\n');
    
    const routesDir = './app/routes';
    this.scanRouteDirectory(routesDir);
    
    console.log(`Analyzed ${this.routeComponents.size} route files\n`);
  }

  scanRouteDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('_')) {
        this.scanRouteDirectory(fullPath);
      } else if (file.endsWith('.tsx') && !file.startsWith('_')) {
        this.analyzeRouteFile(fullPath);
      }
    }
  }

  analyzeRouteFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const routePath = path.relative('./app/routes', filePath);
    
    // Extract Magic Patterns imports
    const magicPatternsImports = [];
    const importRegex = /import\s*(?:{[^}]*}|\w+)\s*from\s*['"`]([^'"`]*magic-patterns[^'"`]*)['"`]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      magicPatternsImports.push({
        fullImport: match[0],
        importPath: match[1]
      });
    }

    // Extract type imports
    const typeImports = [];
    const typeImportRegex = /import\s*type\s*{[^}]*}\s*from\s*['"`]([^'"`]*\+types[^'"`]*)['"`]/g;
    while ((match = typeImportRegex.exec(content)) !== null) {
      typeImports.push({
        fullImport: match[0],
        importPath: match[1]
      });
    }

    if (magicPatternsImports.length > 0 || typeImports.length > 0) {
      this.routeComponents.set(routePath, {
        filePath,
        magicPatternsImports,
        typeImports,
        content
      });
    }
  }

  async getTypeScriptErrors() {
    console.log('🔍 Running TypeScript check for errors...\n');
    
    try {
      const output = execSync('pnpm tsc --noEmit', { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      this.parseTypeScriptErrors(output);
    }
  }

  parseTypeScriptErrors(output) {
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('TS2307: Cannot find module')) {
        const match = line.match(/Cannot find module '([^']+)'/);
        if (match) {
          const modulePath = match[1];
          const file = line.split('(')[0].trim();
          
          if (modulePath.includes('magic-patterns')) {
            this.componentErrors.push({
              file,
              modulePath,
              type: 'component'
            });
          } else if (modulePath.includes('+types')) {
            this.typeErrors.push({
              file,
              modulePath,
              type: 'type'
            });
          }
        }
      }
    }
    
    console.log(`Found ${this.componentErrors.length} component errors and ${this.typeErrors.length} type errors\n`);
  }

  generateFixes() {
    console.log('🔧 Generating fixes...\n');
    
    // Fix component imports
    for (const error of this.componentErrors) {
      const fix = this.findComponentFix(error);
      if (fix) {
        this.fixes.push(fix);
      }
    }
    
    // Fix type imports  
    for (const error of this.typeErrors) {
      const fix = this.findTypeFix(error);
      if (fix) {
        this.fixes.push(fix);
      }
    }
  }

  findComponentFix(error) {
    const { modulePath, file } = error;
    
    // Extract the expected component name/path
    const pathParts = modulePath.split('/');
    const expectedComponent = pathParts[pathParts.length - 1];
    
    // Look for exact matches first
    for (const [componentPath, componentInfo] of this.availableComponents.entries()) {
      if (componentPath === expectedComponent || componentInfo.name === expectedComponent) {
        return {
          type: 'component_fix',
          file: error.file,
          oldImport: modulePath,
          newImport: `~/components/magic-patterns/${componentInfo.type}/${componentPath}`,
          reason: 'exact_match'
        };
      }
    }
    
    // Look for close matches
    for (const [componentPath, componentInfo] of this.availableComponents.entries()) {
      if (componentPath.toLowerCase().includes(expectedComponent.toLowerCase()) || 
          componentInfo.name.toLowerCase().includes(expectedComponent.toLowerCase())) {
        return {
          type: 'component_fix',
          file: error.file,
          oldImport: modulePath,
          newImport: `~/components/magic-patterns/${componentInfo.type}/${componentPath}`,
          reason: 'close_match',
          confidence: 'medium'
        };
      }
    }

    return {
      type: 'component_missing',
      file: error.file,
      oldImport: modulePath,
      expectedComponent,
      reason: 'needs_creation'
    };
  }

  findTypeFix(error) {
    const { modulePath, file } = error;
    
    // Extract route name from file path
    const routeName = path.relative('./app/routes', file.replace(/\([^)]*\):\d+:\d+$/, ''));
    const routeDir = path.dirname(routeName);
    const routeFile = path.basename(routeName, '.tsx');
    
    // Check if the route should have types generated
    const routeContent = fs.readFileSync(file.replace(/\([^)]*\):\d+:\d+$/, ''), 'utf8');
    const hasLoader = routeContent.includes('export const loader') || routeContent.includes('export async function loader');
    const hasAction = routeContent.includes('export const action') || routeContent.includes('export async function action');
    
    if (hasLoader || hasAction) {
      return {
        type: 'type_regenerate',
        file: error.file,
        oldImport: modulePath,
        reason: 'needs_typegen'
      };
    } else {
      return {
        type: 'type_remove',
        file: error.file,
        oldImport: modulePath,
        reason: 'no_loader_action'
      };
    }
  }

  showReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE IMPORT ANALYSIS REPORT');
    console.log('='.repeat(80));

    // Component fixes
    const componentFixes = this.fixes.filter(f => f.type === 'component_fix');
    const componentMissing = this.fixes.filter(f => f.type === 'component_missing');
    
    if (componentFixes.length > 0) {
      console.log('\n✅ COMPONENT FIXES AVAILABLE:\n');
      componentFixes.forEach((fix, i) => {
        console.log(`${i + 1}. File: ${fix.file}`);
        console.log(`   Old: ${fix.oldImport}`);
        console.log(`   New: ${fix.newImport}`);
        console.log(`   Reason: ${fix.reason}${fix.confidence ? ` (${fix.confidence} confidence)` : ''}\n`);
      });
    }

    if (componentMissing.length > 0) {
      console.log('\n❌ MISSING COMPONENTS (need creation):\n');
      componentMissing.forEach((fix, i) => {
        console.log(`${i + 1}. File: ${fix.file}`);
        console.log(`   Expected: ${fix.expectedComponent}`);
        console.log(`   Import: ${fix.oldImport}\n`);
      });
    }

    // Type fixes
    const typeRegenerates = this.fixes.filter(f => f.type === 'type_regenerate');
    const typeRemoves = this.fixes.filter(f => f.type === 'type_remove');
    
    if (typeRegenerates.length > 0) {
      console.log('\n🔄 TYPE FILES NEED REGENERATION:\n');
      typeRegenerates.forEach((fix, i) => {
        console.log(`${i + 1}. File: ${fix.file}`);
        console.log(`   Import: ${fix.oldImport}`);
        console.log(`   Action: Run 'pnpm react-router typegen'\n`);
      });
    }

    if (typeRemoves.length > 0) {
      console.log('\n🗑️  UNNECESSARY TYPE IMPORTS (no loader/action):\n');
      typeRemoves.forEach((fix, i) => {
        console.log(`${i + 1}. File: ${fix.file}`);
        console.log(`   Import: ${fix.oldImport}`);
        console.log(`   Action: Remove type import\n`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('📋 SUMMARY:');
    console.log('='.repeat(80));
    console.log(`✅ Component fixes available: ${componentFixes.length}`);
    console.log(`❌ Components need creation: ${componentMissing.length}`);
    console.log(`🔄 Types need regeneration: ${typeRegenerates.length}`);
    console.log(`🗑️  Unnecessary type imports: ${typeRemoves.length}`);

    // Save detailed report
    fs.writeFileSync('comprehensive-import-report.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      availableComponents: Array.from(this.availableComponents.entries()),
      fixes: this.fixes,
      routeComponents: Array.from(this.routeComponents.entries())
    }, null, 2));

    console.log('\n📄 Detailed report saved to: comprehensive-import-report.json');
    
    if (componentFixes.length > 0) {
      console.log('\n🚀 Next step: Run the auto-fixer to apply component fixes');
      console.log('   node comprehensive-import-scanner.js --fix');
    }
  }

  // Auto-fix method
  async autoFix() {
    console.log('🔧 Applying automatic fixes...\n');
    
    const componentFixes = this.fixes.filter(f => f.type === 'component_fix');
    let fixedCount = 0;
    
    for (const fix of componentFixes) {
      try {
        const filePath = fix.file.replace(/\([^)]*\):\d+:\d+$/, '');
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace the import
        const oldImportRegex = new RegExp(
          `import\\s+(?:{[^}]*}|\\w+)\\s+from\\s+['"\`]${fix.oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`,
          'g'
        );
        
        const newImportLine = content.match(oldImportRegex)?.[0]?.replace(fix.oldImport, fix.newImport);
        
        if (newImportLine) {
          content = content.replace(oldImportRegex, newImportLine);
          fs.writeFileSync(filePath, content);
          console.log(`✅ Fixed: ${filePath}`);
          fixedCount++;
        }
      } catch (error) {
        console.log(`❌ Failed to fix: ${fix.file} - ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Applied ${fixedCount} automatic fixes!`);
    console.log('\nNext steps:');
    console.log('1. Run: pnpm react-router typegen (to regenerate type files)');
    console.log('2. Run: pnpm typecheck (to verify fixes)');
  }
}

// Main execution
if (require.main === module) {
  const scanner = new ComprehensiveImportScanner();
  
  if (process.argv[2] === '--fix') {
    scanner.scan().then(() => scanner.autoFix()).catch(console.error);
  } else {
    scanner.scan().catch(console.error);
  }
}

module.exports = ComprehensiveImportScanner;