#!/usr/bin/env node

/**
 * Check SSR Compatibility
 * 
 * Scans Magic Patterns components for browser-only code that will break SSR
 * - window object access
 * - document object access
 * - localStorage/sessionStorage
 * - navigator API
 * 
 * Generates a report with specific line numbers and suggested fixes
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const MAGIC_PATTERNS_DIR = path.join(process.cwd(), 'apps/web/app/components/magic-patterns');
const OUTPUT_FILE = 'SSR_COMPATIBILITY_REPORT.md';

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

// SSR issue patterns
const ssrPatterns = [
  {
    name: 'window object',
    pattern: /window\./g,
    exclude: /typeof window|if \(typeof window/,
    suggestion: 'Wrap in: if (typeof window !== "undefined") { ... }'
  },
  {
    name: 'document object',
    pattern: /document\./g,
    exclude: /typeof document|if \(typeof document/,
    suggestion: 'Wrap in: if (typeof document !== "undefined") { ... }'
  },
  {
    name: 'localStorage',
    pattern: /localStorage\./g,
    exclude: /typeof window|if \(typeof window/,
    suggestion: 'Wrap in: if (typeof window !== "undefined" && window.localStorage) { ... }'
  },
  {
    name: 'sessionStorage',
    pattern: /sessionStorage\./g,
    exclude: /typeof window|if \(typeof window/,
    suggestion: 'Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }'
  },
  {
    name: 'navigator object',
    pattern: /navigator\./g,
    exclude: /typeof navigator|if \(typeof navigator/,
    suggestion: 'Wrap in: if (typeof navigator !== "undefined") { ... }'
  },
  {
    name: 'alert/confirm/prompt',
    pattern: /\b(alert|confirm|prompt)\(/g,
    exclude: null,
    suggestion: 'Replace with React modal or toast component'
  }
];

// Stats tracking
const stats = {
  filesScanned: 0,
  issuesFound: 0,
  filesByPattern: {},
  highPriorityFiles: []
};

// Initialize pattern stats
ssrPatterns.forEach(pattern => {
  stats.filesByPattern[pattern.name] = [];
});

/**
 * Check a single file for SSR issues
 */
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relativePath = path.relative(process.cwd(), filePath);
  const issues = [];
  
  stats.filesScanned++;
  
  ssrPatterns.forEach(patternConfig => {
    const { name, pattern, exclude, suggestion } = patternConfig;
    let match;
    
    // Reset pattern lastIndex
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(content)) !== null) {
      // Check if this match should be excluded
      if (exclude) {
        const lineStart = content.lastIndexOf('\n', match.index) + 1;
        const lineEnd = content.indexOf('\n', match.index);
        const line = content.substring(lineStart, lineEnd);
        
        if (exclude.test(line)) {
          continue; // Skip this match
        }
      }
      
      // Find line number
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      const line = lines[lineNumber - 1];
      
      issues.push({
        pattern: name,
        lineNumber,
        line: line.trim(),
        suggestion
      });
      
      stats.issuesFound++;
      
      if (!stats.filesByPattern[name].includes(relativePath)) {
        stats.filesByPattern[name].push(relativePath);
      }
    }
  });
  
  if (issues.length > 0) {
    if (issues.length > 5) {
      stats.highPriorityFiles.push({ file: relativePath, count: issues.length });
    }
    return { file: relativePath, issues };
  }
  
  return null;
}

/**
 * Generate markdown report
 */
function generateReport(results) {
  let report = '# SSR Compatibility Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += '## Summary\n\n';
  report += `- Files scanned: ${stats.filesScanned}\n`;
  report += `- Total issues found: ${stats.issuesFound}\n`;
  report += `- Files with issues: ${results.length}\n\n`;
  
  // Pattern summary
  report += '## Issues by Pattern\n\n';
  ssrPatterns.forEach(pattern => {
    const count = stats.filesByPattern[pattern.name].length;
    if (count > 0) {
      report += `### ${pattern.name} (${count} files)\n`;
      report += `Suggestion: ${pattern.suggestion}\n\n`;
    }
  });
  
  // High priority files
  if (stats.highPriorityFiles.length > 0) {
    report += '## High Priority Files (>5 issues)\n\n';
    stats.highPriorityFiles
      .sort((a, b) => b.count - a.count)
      .forEach(({ file, count }) => {
        report += `- ${file} (${count} issues)\n`;
      });
    report += '\n';
  }
  
  // Detailed issues
  report += '## Detailed Issues by File\n\n';
  
  results.forEach(({ file, issues }) => {
    report += `### ${file}\n\n`;
    
    issues.forEach(issue => {
      report += `- **Line ${issue.lineNumber}**: ${issue.pattern}\n`;
      report += '  ```typescript\n  ' + issue.line + '\n  ```\n';
      report += `  **Fix**: ${issue.suggestion}\n\n`;
    });
  });
  
  // Common fixes section
  report += '## Common SSR Fixes\n\n';
  report += '### 1. Conditional Window Access\n';
  report += '```typescript\n';
  report += 'if (typeof window !== "undefined") {\n';
  report += '  // Browser-only code here\n';
  report += '  window.location.href = "/path";\n';
  report += '}\n';
  report += '```\n\n';
  
  report += '### 2. Storage Access Helper\n';
  report += '```typescript\n';
  report += 'const getStorageItem = (key: string) => {\n';
  report += '  if (typeof window !== "undefined" && window.localStorage) {\n';
  report += '    return localStorage.getItem(key);\n';
  report += '  }\n';
  report += '  return null;\n';
  report += '};\n';
  report += '```\n\n';
  
  report += '### 3. useEffect for Browser APIs\n';
  report += '```typescript\n';
  report += 'useEffect(() => {\n';
  report += '  // Browser APIs are safe here\n';
  report += '  window.addEventListener("resize", handleResize);\n';
  report += '  return () => window.removeEventListener("resize", handleResize);\n';
  report += '}, []);\n';
  report += '```\n\n';
  
  report += '### 4. Dynamic Imports for Browser-Only Libraries\n';
  report += '```typescript\n';
  report += 'const MyComponent = dynamic(() => import("./BrowserOnlyComponent"), {\n';
  report += '  ssr: false\n';
  report += '});\n';
  report += '```\n';
  
  return report;
}

/**
 * Main execution
 */
function main() {
  log('\n🔍 SSR Compatibility Check', 'bright');
  log('=========================\n', 'bright');
  
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
    const files = glob.sync(pattern, {
      ignore: ['**/*.backup', '**/node_modules/**']
    });
    allFiles = allFiles.concat(files);
  });
  
  log(`Scanning ${allFiles.length} files for SSR compatibility issues...\n`);
  
  // Check each file
  const results = [];
  allFiles.forEach(file => {
    const result = checkFile(file);
    if (result) {
      results.push(result);
    }
  });
  
  // Generate report
  const report = generateReport(results);
  fs.writeFileSync(OUTPUT_FILE, report);
  
  // Print summary
  log('\n📊 Summary', 'bright');
  log('==========', 'bright');
  log(`Files scanned: ${stats.filesScanned}`);
  log(`Issues found: ${stats.issuesFound}`, stats.issuesFound > 0 ? 'yellow' : 'green');
  log(`Files with issues: ${results.length}`);
  
  if (stats.issuesFound > 0) {
    log('\nTop issues:', 'yellow');
    Object.entries(stats.filesByPattern).forEach(([pattern, files]) => {
      if (files.length > 0) {
        log(`  ${pattern}: ${files.length} files`, 'yellow');
      }
    });
    
    log(`\n📝 Full report saved to: ${OUTPUT_FILE}`, 'cyan');
    log('\n⚠️  Fix these issues before deploying to prevent SSR errors!', 'yellow');
  } else {
    log('\n✅ No SSR compatibility issues found!', 'green');
  }
}

// Run the script
main();