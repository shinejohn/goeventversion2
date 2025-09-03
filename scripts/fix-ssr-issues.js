#!/usr/bin/env node

/**
 * Fix SSR Browser-Only Issues
 * 
 * Automatically wraps browser-only code to make it SSR-safe
 * - window object access
 * - document object access
 * - localStorage/sessionStorage
 * - navigator API
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
  windowFixed: 0,
  documentFixed: 0,
  storageFixed: 0,
  navigatorFixed: 0,
  alertsFixed: 0,
  manualFixNeeded: [],
  errors: []
};

/**
 * Fix patterns for different browser APIs
 */
const fixPatterns = [
  {
    name: 'window.location',
    pattern: /window\.location/g,
    exclude: /typeof window|if \(typeof window/,
    replacement: (match, context) => {
      // If it's an assignment, wrap the whole statement
      if (context.includes('window.location.href =')) {
        return `if (typeof window !== 'undefined') { ${match} }`;
      }
      // If it's a read, provide a fallback
      return `(typeof window !== 'undefined' ? ${match} : '')`;
    },
    needsContext: true
  },
  {
    name: 'window.open',
    pattern: /window\.open\(/g,
    exclude: /typeof window|if \(typeof window/,
    replacement: 'typeof window !== "undefined" && window.open(',
    needsContext: false
  },
  {
    name: 'window.scrollTo',
    pattern: /window\.scrollTo\(/g,
    exclude: /typeof window|if \(typeof window/,
    replacement: 'typeof window !== "undefined" && window.scrollTo(',
    needsContext: false
  },
  {
    name: 'document.getElementById',
    pattern: /document\.getElementById\(/g,
    exclude: /typeof document|if \(typeof document/,
    replacement: 'typeof document !== "undefined" && document.getElementById(',
    needsContext: false
  },
  {
    name: 'document.createElement',
    pattern: /document\.createElement\(/g,
    exclude: /typeof document|if \(typeof document/,
    replacement: 'typeof document !== "undefined" && document.createElement(',
    needsContext: false
  },
  {
    name: 'localStorage',
    pattern: /localStorage\.(getItem|setItem|removeItem|clear)\(/g,
    exclude: /typeof window|if \(typeof window/,
    replacement: (match) => {
      if (match.includes('getItem')) {
        return `(typeof window !== "undefined" && window.localStorage ? localStorage.${match.split('.')[1]} : null)`;
      }
      return `typeof window !== "undefined" && window.localStorage && localStorage.${match.split('.')[1]}`;
    },
    needsContext: true
  },
  {
    name: 'sessionStorage',
    pattern: /sessionStorage\.(getItem|setItem|removeItem|clear)\(/g,
    exclude: /typeof window|if \(typeof window/,
    replacement: (match) => {
      if (match.includes('getItem')) {
        return `(typeof window !== "undefined" && window.sessionStorage ? sessionStorage.${match.split('.')[1]} : null)`;
      }
      return `typeof window !== "undefined" && window.sessionStorage && sessionStorage.${match.split('.')[1]}`;
    },
    needsContext: true
  },
  {
    name: 'navigator',
    pattern: /navigator\./g,
    exclude: /typeof navigator|if \(typeof navigator/,
    replacement: 'typeof navigator !== "undefined" && navigator.',
    needsContext: false
  }
];

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    stats.filesScanned++;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let modified = false;
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Track fixes for this file
    const fixes = [];
    
    fixPatterns.forEach(({ name, pattern, exclude, replacement, needsContext }) => {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(content)) !== null) {
        // Get the line containing the match
        const lineStart = content.lastIndexOf('\n', match.index) + 1;
        const lineEnd = content.indexOf('\n', match.index);
        const line = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);
        
        // Check if this match should be excluded
        if (exclude && exclude.test(line)) {
          continue;
        }
        
        // Apply the fix
        let fixedCode;
        if (needsContext) {
          fixedCode = replacement(match[0], line);
        } else {
          fixedCode = replacement;
        }
        
        // For simple replacements
        if (typeof fixedCode === 'string' && !needsContext) {
          const before = content.substring(0, match.index);
          const after = content.substring(match.index + match[0].length);
          content = before + fixedCode + after;
          modified = true;
          fixes.push(name);
          
          // Update stats
          switch(name) {
            case 'window.location':
            case 'window.open':
            case 'window.scrollTo':
              stats.windowFixed++;
              break;
            case 'document.getElementById':
            case 'document.createElement':
              stats.documentFixed++;
              break;
            case 'localStorage':
            case 'sessionStorage':
              stats.storageFixed++;
              break;
            case 'navigator':
              stats.navigatorFixed++;
              break;
          }
          
          // Reset regex lastIndex due to content change
          pattern.lastIndex = match.index + fixedCode.length;
        }
      }
    });
    
    // Handle alert/confirm/prompt replacements
    const alertPattern = /\b(alert|confirm|prompt)\(/g;
    if (alertPattern.test(content)) {
      // For now, just track these as needing manual fixes
      stats.manualFixNeeded.push({
        file: relativePath,
        issue: 'alert/confirm/prompt calls need to be replaced with React components'
      });
      stats.alertsFixed++;
    }
    
    // Write changes if any were made
    if (modified) {
      // Create backup
      const backupPath = filePath + '.ssr-backup';
      fs.writeFileSync(backupPath, originalContent);
      
      // Write fixed content
      fs.writeFileSync(filePath, content);
      stats.filesModified++;
      
      log(`✓ Fixed: ${relativePath} (${fixes.length} fixes)`, 'green');
      fixes.forEach(fix => {
        log(`  - ${fix}`, 'cyan');
      });
    }
    
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    log(`✗ Error processing ${filePath}: ${error.message}`, 'red');
  }
}

/**
 * Create SSR helper utilities file
 */
function createSSRHelpers() {
  const helperContent = `/**
 * SSR Helper Utilities
 * 
 * Safe wrappers for browser-only APIs
 */

export const isBrowser = () => typeof window !== 'undefined';

export const isServer = () => typeof window === 'undefined';

export const safeWindow = () => {
  if (isBrowser()) {
    return window;
  }
  return undefined;
};

export const safeDocument = () => {
  if (isBrowser()) {
    return document;
  }
  return undefined;
};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser() && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (isBrowser() && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (isBrowser() && window.localStorage) {
      localStorage.removeItem(key);
    }
  },
  clear: (): void => {
    if (isBrowser() && window.localStorage) {
      localStorage.clear();
    }
  }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser() && window.sessionStorage) {
      return sessionStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (isBrowser() && window.sessionStorage) {
      sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (isBrowser() && window.sessionStorage) {
      sessionStorage.removeItem(key);
    }
  },
  clear: (): void => {
    if (isBrowser() && window.sessionStorage) {
      sessionStorage.clear();
    }
  }
};

export const safeNavigator = () => {
  if (isBrowser()) {
    return navigator;
  }
  return undefined;
};

// Safe wrapper for window.location
export const safeLocation = () => {
  if (isBrowser()) {
    return window.location;
  }
  return {
    href: '',
    origin: '',
    pathname: '',
    search: '',
    hash: ''
  };
};

// Toast notification to replace alert
export const showToast = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
  if (isBrowser()) {
    // This should be replaced with your actual toast implementation
    console.log(\`[\${type.toUpperCase()}] \${message}\`);
  }
};

// Modal confirm to replace window.confirm
export const showConfirm = async (message: string): Promise<boolean> => {
  if (isBrowser()) {
    // This should be replaced with your actual modal implementation
    return window.confirm(message);
  }
  return false;
};

// Modal prompt to replace window.prompt
export const showPrompt = async (message: string, defaultValue?: string): Promise<string | null> => {
  if (isBrowser()) {
    // This should be replaced with your actual modal implementation
    return window.prompt(message, defaultValue);
  }
  return null;
};
`;

  const helperPath = path.join(MAGIC_PATTERNS_DIR, 'utils', 'ssr-helpers.ts');
  const utilsDir = path.dirname(helperPath);
  
  // Create utils directory if it doesn't exist
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }
  
  fs.writeFileSync(helperPath, helperContent);
  log('\n✓ Created SSR helper utilities file', 'green');
}

/**
 * Main execution
 */
function main() {
  log('\n🔧 Fixing SSR Browser-Only Issues', 'bright');
  log('=================================\n', 'bright');
  
  // Create SSR helpers first
  createSSRHelpers();
  
  // Find all TypeScript/JavaScript files
  const patterns = [
    path.join(MAGIC_PATTERNS_DIR, '**/*.tsx'),
    path.join(MAGIC_PATTERNS_DIR, '**/*.ts'),
    path.join(MAGIC_PATTERNS_DIR, '**/*.jsx'),
    path.join(MAGIC_PATTERNS_DIR, '**/*.js')
  ];
  
  let allFiles = [];
  patterns.forEach(pattern => {
    const files = glob.sync(pattern, {
      ignore: ['**/*.backup', '**/*.ssr-backup', '**/node_modules/**', '**/utils/ssr-helpers.ts']
    });
    allFiles = allFiles.concat(files);
  });
  
  log(`Scanning ${allFiles.length} files for SSR issues...\n`);
  
  // Process each file
  allFiles.forEach(processFile);
  
  // Print summary
  log('\n📊 Summary', 'bright');
  log('==========', 'bright');
  log(`Files scanned: ${stats.filesScanned}`);
  log(`Files modified: ${stats.filesModified}`, stats.filesModified > 0 ? 'green' : 'yellow');
  log(`\nFixes applied:`);
  log(`  Window object: ${stats.windowFixed}`, 'cyan');
  log(`  Document object: ${stats.documentFixed}`, 'cyan');
  log(`  Storage APIs: ${stats.storageFixed}`, 'cyan');
  log(`  Navigator API: ${stats.navigatorFixed}`, 'cyan');
  
  if (stats.manualFixNeeded.length > 0) {
    log(`\n⚠️  Manual fixes needed: ${stats.manualFixNeeded.length}`, 'yellow');
    stats.manualFixNeeded.forEach(({ file, issue }) => {
      log(`  - ${file}: ${issue}`, 'yellow');
    });
  }
  
  if (stats.errors.length > 0) {
    log(`\n❌ Errors: ${stats.errors.length}`, 'red');
    stats.errors.forEach(({ file, error }) => {
      log(`  - ${path.relative(process.cwd(), file)}: ${error}`, 'red');
    });
  }
  
  if (stats.filesModified > 0) {
    log('\n✅ SSR fixes applied!', 'green');
    log('📝 Backup files created with .ssr-backup extension', 'cyan');
    log('\n⚠️  Please review the changes and test your application', 'yellow');
    log('💡 Consider using the SSR helper utilities in utils/ssr-helpers.ts', 'cyan');
  } else {
    log('\n✅ No automatic fixes needed!', 'green');
  }
  
  // Exit with error code if there were errors
  process.exit(stats.errors.length > 0 ? 1 : 0);
}

// Run the script
main();