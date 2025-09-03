#!/usr/bin/env node

/**
 * Fix Magic Patterns Navigation Script
 * 
 * This script updates all Magic Patterns components to use React Router navigation
 * instead of the custom NavigationContext.
 * 
 * Changes:
 * - useNavigationContext → useNavigate
 * - navigateTo → navigate
 * - NavigationContext imports → react-router imports
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const MAGIC_PATTERNS_DIR = path.join(process.cwd(), 'apps/web/app/components/magic-patterns');
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// Stats tracking
const stats = {
  filesScanned: 0,
  filesModified: 0,
  importsReplaced: 0,
  hooksReplaced: 0,
  callsReplaced: 0,
  errors: [],
  skipped: []
};

// Color codes for console output
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

function logVerbose(message) {
  if (VERBOSE) {
    log(`  ${message}`, 'cyan');
  }
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    stats.filesScanned++;
    
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = content;
    let changesMade = false;
    
    logVerbose(`Scanning: ${path.relative(process.cwd(), filePath)}`);
    
    // Pattern 1: Import statements
    // Handles various import styles and quote types
    const importPatterns = [
      // Standard import
      /import\s*{\s*useNavigationContext\s*}\s*from\s*['"`].*?NavigationContext['"`]/g,
      // Import with other items
      /import\s*{\s*([^}]*),?\s*useNavigationContext\s*,?\s*([^}]*)\s*}\s*from\s*['"`].*?NavigationContext['"`]/g,
      // Aliased import
      /import\s*{\s*useNavigationContext\s+as\s+\w+\s*}\s*from\s*['"`].*?NavigationContext['"`]/g,
    ];
    
    // First, check if file uses NavigationContext at all
    if (!content.includes('NavigationContext') && !content.includes('navigateTo')) {
      logVerbose('  → No navigation context usage found, skipping');
      stats.skipped.push(filePath);
      return;
    }
    
    // Replace imports
    importPatterns.forEach(pattern => {
      if (pattern.test(modified)) {
        modified = modified.replace(pattern, (match, before, after) => {
          stats.importsReplaced++;
          changesMade = true;
          
          // Handle imports with multiple items
          if (before || after) {
            const otherImports = [before, after].filter(Boolean).join(', ').trim();
            if (otherImports) {
              log(`  ⚠️  File has other NavigationContext imports: ${otherImports}`, 'yellow');
              log(`     You may need to handle these manually in: ${path.relative(process.cwd(), filePath)}`, 'yellow');
            }
          }
          
          return "import { useNavigate } from 'react-router'";
        });
      }
    });
    
    // Pattern 2: Hook usage with destructuring
    const hookPatterns = [
      // Standard usage
      /const\s*{\s*navigateTo\s*}\s*=\s*useNavigationContext\(\)/g,
      // With other destructured items
      /const\s*{\s*([^}]*),?\s*navigateTo\s*,?\s*([^}]*)\s*}\s*=\s*useNavigationContext\(\)/g,
      // Aliased usage
      /const\s*{\s*navigateTo\s*:\s*(\w+)\s*}\s*=\s*useNavigationContext\(\)/g,
    ];
    
    hookPatterns.forEach(pattern => {
      if (pattern.test(modified)) {
        modified = modified.replace(pattern, (match, beforeOrAlias, after) => {
          stats.hooksReplaced++;
          changesMade = true;
          
          // Check if this is an alias pattern
          if (match.includes(':')) {
            const alias = beforeOrAlias;
            log(`  ⚠️  Found aliased navigation: navigateTo as ${alias}`, 'yellow');
            log(`     You'll need to update ${alias}() calls to navigate() manually`, 'yellow');
            return `const ${alias} = useNavigate()`;
          }
          
          // Handle other destructured items
          if (beforeOrAlias || after) {
            const otherItems = [beforeOrAlias, after].filter(Boolean).join(', ').trim();
            if (otherItems) {
              log(`  ⚠️  NavigationContext provides other items: ${otherItems}`, 'yellow');
              log(`     These will need manual handling in: ${path.relative(process.cwd(), filePath)}`, 'yellow');
            }
          }
          
          return 'const navigate = useNavigate()';
        });
      }
    });
    
    // Pattern 3: Direct hook usage (without destructuring)
    const directHookPattern = /const\s+(\w+)\s*=\s*useNavigationContext\(\)/g;
    if (directHookPattern.test(modified)) {
      modified = modified.replace(directHookPattern, (match, varName) => {
        stats.hooksReplaced++;
        changesMade = true;
        log(`  ⚠️  Found direct context usage: const ${varName} = useNavigationContext()`, 'yellow');
        log(`     You'll need to update ${varName}.navigateTo() calls manually`, 'yellow');
        return `const ${varName} = { navigate: useNavigate() }`;
      });
    }
    
    // Pattern 4: Function calls
    // Only replace if we've already replaced the hook usage
    if (changesMade && modified.includes('navigate(')) {
      const callPattern = /navigateTo\(/g;
      const callCount = (modified.match(callPattern) || []).length;
      if (callCount > 0) {
        modified = modified.replace(callPattern, 'navigate(');
        stats.callsReplaced += callCount;
      }
    }
    
    // Pattern 5: Check for any remaining NavigationContext usage
    if (modified.includes('NavigationContext')) {
      log(`  ⚠️  File still contains NavigationContext references after processing`, 'yellow');
      log(`     Manual review needed: ${path.relative(process.cwd(), filePath)}`, 'yellow');
    }
    
    // Write changes if any were made
    if (changesMade) {
      if (!DRY_RUN) {
        // Create backup
        const backupPath = `${filePath}.backup`;
        fs.writeFileSync(backupPath, content);
        
        // Write modified content
        fs.writeFileSync(filePath, modified);
        log(`✓ Modified: ${path.relative(process.cwd(), filePath)}`, 'green');
      } else {
        log(`[DRY RUN] Would modify: ${path.relative(process.cwd(), filePath)}`, 'yellow');
      }
      stats.filesModified++;
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
  log('\n🔧 Magic Patterns Navigation Fix Script', 'bright');
  log('=====================================\n', 'bright');
  
  if (DRY_RUN) {
    log('Running in DRY RUN mode - no files will be modified\n', 'yellow');
  }
  
  // Check if glob is installed
  try {
    require.resolve('glob');
  } catch (e) {
    log('Error: glob package not found. Please install it first:', 'red');
    log('  npm install --save-dev glob', 'cyan');
    process.exit(1);
  }
  
  // Check if Magic Patterns directory exists
  if (!fs.existsSync(MAGIC_PATTERNS_DIR)) {
    log(`Error: Magic Patterns directory not found at: ${MAGIC_PATTERNS_DIR}`, 'red');
    process.exit(1);
  }
  
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
  
  if (allFiles.length === 0) {
    log('No files found to process!', 'yellow');
    process.exit(0);
  }
  
  log(`Found ${allFiles.length} files to scan\n`);
  
  // Process each file
  allFiles.forEach(processFile);
  
  // Print summary
  log('\n📊 Summary', 'bright');
  log('==========', 'bright');
  log(`Files scanned: ${stats.filesScanned}`);
  log(`Files modified: ${stats.filesModified}`, stats.filesModified > 0 ? 'green' : 'reset');
  log(`Files skipped: ${stats.skipped.length}`);
  log(`Imports replaced: ${stats.importsReplaced}`);
  log(`Hooks replaced: ${stats.hooksReplaced}`);
  log(`Function calls replaced: ${stats.callsReplaced}`);
  
  if (stats.errors.length > 0) {
    log(`\n❌ Errors: ${stats.errors.length}`, 'red');
    stats.errors.forEach(({ file, error }) => {
      log(`  - ${path.relative(process.cwd(), file)}: ${error}`, 'red');
    });
  }
  
  if (DRY_RUN) {
    log('\n📝 This was a DRY RUN. To apply changes, run without --dry-run flag', 'yellow');
  } else if (stats.filesModified > 0) {
    log('\n✅ Navigation fix complete!', 'green');
    log('📝 Backup files created with .backup extension', 'cyan');
    log('\n⚠️  Please review any warnings above and test your application', 'yellow');
  }
  
  // Exit with error code if there were errors
  process.exit(stats.errors.length > 0 ? 1 : 0);
}

// Show usage if --help flag is provided
if (process.argv.includes('--help')) {
  log('Usage: node fix-magic-patterns-navigation.js [options]\n');
  log('Options:');
  log('  --dry-run    Show what would be changed without modifying files');
  log('  --verbose    Show detailed processing information');
  log('  --help       Show this help message\n');
  process.exit(0);
}

// Run the script
main();