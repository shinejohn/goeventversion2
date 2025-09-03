#!/usr/bin/env node

/**
 * Fix Remaining Navigation Issues
 * 
 * Cleans up any remaining NavigationContext references and navigateTo calls
 * that weren't fixed by the first script.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const MAGIC_PATTERNS_DIR = path.join(process.cwd(), 'apps/web/app/components/magic-patterns');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Stats tracking
const stats = {
  filesScanned: 0,
  filesModified: 0,
  navigateToFixed: 0,
  contextsRemoved: 0,
  errors: []
};

/**
 * Fix NavigationContext file itself
 */
function fixNavigationContextFile() {
  const contextFile = path.join(MAGIC_PATTERNS_DIR, 'context/NavigationContext.tsx');
  
  if (fs.existsSync(contextFile)) {
    try {
      // Delete the NavigationContext file as it's no longer needed
      fs.renameSync(contextFile, contextFile + '.disabled');
      log('✓ Disabled NavigationContext.tsx file', 'green');
      stats.contextsRemoved++;
    } catch (error) {
      stats.errors.push({ file: contextFile, error: error.message });
    }
  }
}

/**
 * Remove NavigationProvider from App.tsx
 */
function fixAppFile() {
  const appFile = path.join(MAGIC_PATTERNS_DIR, 'App.tsx');
  
  if (fs.existsSync(appFile)) {
    try {
      let content = fs.readFileSync(appFile, 'utf8');
      let modified = false;
      
      // Remove NavigationProvider import
      if (content.includes('NavigationProvider')) {
        content = content.replace(/import\s*{\s*NavigationProvider\s*}\s*from\s*['"].*NavigationContext['"]/g, '');
        content = content.replace(/<NavigationProvider>/g, '');
        content = content.replace(/<\/NavigationProvider>/g, '');
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(appFile, content);
        log('✓ Fixed App.tsx file', 'green');
        stats.filesModified++;
      }
    } catch (error) {
      stats.errors.push({ file: appFile, error: error.message });
    }
  }
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    stats.filesScanned++;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changeCount = 0;
    
    // Skip backup files
    if (filePath.endsWith('.backup')) {
      return;
    }
    
    // Fix any remaining navigateTo calls
    const navigateToPattern = /\bnavigateTo\(/g;
    const navigateToMatches = content.match(navigateToPattern) || [];
    if (navigateToMatches.length > 0) {
      content = content.replace(navigateToPattern, 'navigate(');
      modified = true;
      changeCount += navigateToMatches.length;
      stats.navigateToFixed += navigateToMatches.length;
    }
    
    // Fix any imports that still reference NavigationContext
    if (content.includes('NavigationContext')) {
      // Remove entire import line if it only imports from NavigationContext
      content = content.replace(/import\s*.*\s*from\s*['"].*NavigationContext['"]\s*;?\s*\n/g, '');
      modified = true;
      stats.contextsRemoved++;
    }
    
    // Fix any remaining useNavigationContext references
    if (content.includes('useNavigationContext')) {
      content = content.replace(/useNavigationContext/g, 'useNavigate');
      modified = true;
    }
    
    // Write changes if any were made
    if (modified) {
      fs.writeFileSync(filePath, content);
      stats.filesModified++;
      log(`✓ Fixed: ${path.relative(process.cwd(), filePath)} (${changeCount} changes)`, 'green');
    }
    
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    log(`✗ Error processing ${filePath}: ${error.message}`, 'red');
  }
}

/**
 * Main execution
 */
function main() {
  log('\n🔧 Fixing Remaining Navigation Issues', 'bright');
  log('=====================================\n', 'bright');
  
  // Fix NavigationContext file
  fixNavigationContextFile();
  
  // Fix App.tsx
  fixAppFile();
  
  // Find all TypeScript/JavaScript files
  const patterns = [
    path.join(MAGIC_PATTERNS_DIR, '**/*.tsx'),
    path.join(MAGIC_PATTERNS_DIR, '**/*.ts'),
    path.join(MAGIC_PATTERNS_DIR, '**/*.jsx'),
    path.join(MAGIC_PATTERNS_DIR, '**/*.js')
  ];
  
  let allFiles = [];
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    allFiles = allFiles.concat(files);
  });
  
  log(`Found ${allFiles.length} files to scan\n`);
  
  // Process each file
  allFiles.forEach(processFile);
  
  // Delete all .backup files
  const backupFiles = glob.sync(path.join(MAGIC_PATTERNS_DIR, '**/*.backup'));
  backupFiles.forEach(file => {
    fs.unlinkSync(file);
  });
  log(`\n✓ Cleaned up ${backupFiles.length} backup files`, 'green');
  
  // Print summary
  log('\n📊 Summary', 'bright');
  log('==========', 'bright');
  log(`Files scanned: ${stats.filesScanned}`);
  log(`Files modified: ${stats.filesModified}`, 'green');
  log(`navigateTo calls fixed: ${stats.navigateToFixed}`);
  log(`NavigationContext references removed: ${stats.contextsRemoved}`);
  
  if (stats.errors.length > 0) {
    log(`\n❌ Errors: ${stats.errors.length}`, 'red');
    stats.errors.forEach(({ file, error }) => {
      log(`  - ${path.relative(process.cwd(), file)}: ${error}`, 'red');
    });
  }
  
  if (stats.filesModified > 0 || stats.navigateToFixed > 0) {
    log('\n✅ Navigation cleanup complete!', 'green');
    log('\n⚠️  Please test your application to ensure navigation works correctly', 'yellow');
  } else {
    log('\n✅ No remaining navigation issues found!', 'green');
  }
  
  // Exit with error code if there were errors
  process.exit(stats.errors.length > 0 ? 1 : 0);
}

// Run the script
main();