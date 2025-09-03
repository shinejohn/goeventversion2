#!/usr/bin/env node

/**
 * Code Quality Scanner - When's The Fun
 * 
 * Comprehensive scanner to identify quality issues:
 * 1. React Router v6 vs v7 conflicts
 * 2. Mock data hardcoding issues
 * 3. Missing imports and dependencies
 * 4. Component structure problems
 * 5. Route configuration issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CodeQualityScanner {
  constructor() {
    this.issues = {
      routerVersion: [],
      mockData: [],
      imports: [],
      components: [],
      routes: [],
      supabase: [],
      authentication: []
    };
    this.stats = {
      filesScanned: 0,
      issuesFound: 0,
      criticalIssues: 0
    };
  }

  // Main scanner entry point
  async scanProject(targetDir = '.') {
    console.log('🔍 Starting comprehensive code quality scan...\n');
    
    // Define scan patterns
    const scanPatterns = [
      {
        name: 'React Router Version Conflicts',
        category: 'routerVersion',
        patterns: this.getRouterPatterns()
      },
      {
        name: 'Mock Data Issues',
        category: 'mockData',
        patterns: this.getMockDataPatterns()
      },
      {
        name: 'Import Issues',
        category: 'imports',
        patterns: this.getImportPatterns()
      },
      {
        name: 'Component Issues',
        category: 'components',
        patterns: this.getComponentPatterns()
      },
      {
        name: 'Route Configuration',
        category: 'routes',
        patterns: this.getRoutePatterns()
      },
      {
        name: 'Supabase Integration',
        category: 'supabase',
        patterns: this.getSupabasePatterns()
      },
      {
        name: 'Authentication Issues',
        category: 'authentication',
        patterns: this.getAuthPatterns()
      }
    ];

    // Run each scan
    for (const scan of scanPatterns) {
      console.log(`\n📋 Scanning for ${scan.name}...`);
      await this.runScan(targetDir, scan);
    }

    // Generate report
    this.generateReport();
  }

  // Run individual scan with patterns
  async runScan(targetDir, scan) {
    for (const pattern of scan.patterns) {
      try {
        const command = `rg "${pattern.regex}" "${targetDir}" --type-add 'web:*.{js,jsx,ts,tsx}' --type web -n --no-heading || true`;
        const results = execSync(command, { encoding: 'utf-8' }).trim();
        
        if (results) {
          const lines = results.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            const [filePath, lineNum, ...contentParts] = line.split(':');
            const content = contentParts.join(':').trim();
            
            // Skip node_modules and build directories
            if (filePath.includes('node_modules') || filePath.includes('dist') || filePath.includes('.turbo')) {
              continue;
            }

            this.issues[scan.category].push({
              file: filePath,
              line: parseInt(lineNum),
              content: content,
              severity: pattern.severity || 'warning',
              message: pattern.message,
              fix: pattern.fix
            });

            this.stats.issuesFound++;
            if (pattern.severity === 'critical') {
              this.stats.criticalIssues++;
            }
          }
        }
      } catch (error) {
        // Ignore errors from grep not finding matches
      }
    }
  }

  // React Router version patterns
  getRouterPatterns() {
    return [
      // React Router v6 patterns (need updating to v7)
      {
        regex: 'useNavigate\\(\\)',
        severity: 'warning',
        message: 'React Router v6 useNavigate - consider v7 navigate function',
        fix: 'Update to React Router v7 navigation patterns'
      },
      {
        regex: 'from\\s+[\'"]react-router-dom[\'"]',
        severity: 'critical',
        message: 'Importing from react-router-dom (v6) instead of react-router (v7)',
        fix: "Change import from 'react-router-dom' to 'react-router'"
      },
      {
        regex: '<Routes>|</Routes>',
        severity: 'critical',
        message: 'Using v6 Routes component instead of v7 route configuration',
        fix: 'Convert to React Router v7 route configuration in routes.ts'
      },
      {
        regex: '<Route\\s+path=',
        severity: 'warning',
        message: 'Using v6 Route component instead of v7 route configuration',
        fix: 'Move route definition to routes.ts configuration'
      },
      {
        regex: 'useRouteError',
        severity: 'info',
        message: 'v6/v7 error handling - verify compatibility',
        fix: 'Ensure error handling follows v7 patterns'
      },
      {
        regex: '<Outlet',
        severity: 'info',
        message: 'Using Outlet - verify it\'s imported from react-router',
        fix: 'Import from react-router, not react-router-dom'
      },
      {
        regex: 'createBrowserRouter|RouterProvider',
        severity: 'info',
        message: 'Router setup - ensure using v7 patterns',
        fix: 'Verify router configuration follows v7 standards'
      }
    ];
  }

  // Mock data patterns
  getMockDataPatterns() {
    return [
      // Hardcoded data
      {
        regex: 'Clearwater Jazz Holiday',
        severity: 'critical',
        message: 'Hardcoded event name - should use dynamic data',
        fix: 'Replace with dynamic event data from props or loader'
      },
      {
        regex: 'https://images\\.unsplash\\.com/[^\\s\'"\`]+',
        severity: 'warning',
        message: 'Hardcoded Unsplash image URL',
        fix: 'Use dynamic image URLs from data'
      },
      {
        regex: 'profileImage:\\s*[\'"][^\'"]+[\'"]',
        severity: 'warning',
        message: 'Hardcoded profile image',
        fix: 'Use dynamic profile image from user/performer data'
      },
      {
        regex: '(eventData|performerData|venueData)\\s*=\\s*{',
        severity: 'info',
        message: 'Inline mock data object',
        fix: 'Consider moving to separate mock data file or using dynamic data'
      },
      {
        regex: 'mockEvents\\[0\\]|mockPerformers\\[0\\]',
        severity: 'critical',
        message: 'Always using first item from mock array',
        fix: 'Use dynamic ID-based lookup'
      },
      {
        regex: 'event-1|performer-1|venue-1',
        severity: 'warning',
        message: 'Hardcoded mock ID',
        fix: 'Use dynamic IDs from route params'
      }
    ];
  }

  // Import patterns
  getImportPatterns() {
    return [
      {
        regex: 'import.*useLoaderData.*from\\s+[\'"](?!react-router)[\'"]',
        severity: 'critical',
        message: 'useLoaderData imported from wrong package',
        fix: "Import from 'react-router'"
      },
      {
        regex: 'import.*Link.*from\\s+[\'"]react-router-dom[\'"]',
        severity: 'critical',
        message: 'Link imported from react-router-dom instead of react-router',
        fix: "Import Link from 'react-router'"
      },
      {
        regex: 'import.*useParams.*from\\s+[\'"](?!react-router)[\'"]',
        severity: 'critical',
        message: 'useParams imported from wrong package',
        fix: "Import from 'react-router'"
      },
      {
        regex: '@/|~/.*[\'"]\\s*$',
        severity: 'info',
        message: 'Path alias import - verify it resolves correctly',
        fix: 'Ensure tsconfig paths are configured'
      }
    ];
  }

  // Component patterns
  getComponentPatterns() {
    return [
      {
        regex: 'export\\s+default\\s+function.*{[^}]*return\\s+null',
        severity: 'warning',
        message: 'Component returns null',
        fix: 'Implement component or add placeholder'
      },
      {
        regex: '<MainHeader|<Footer',
        severity: 'info',
        message: 'Using MainHeader/Footer - verify SSR compatibility',
        fix: 'Ensure using Magic Patterns Header/Footer for SSR'
      },
      {
        regex: 'window\\.|document\\.',
        severity: 'warning',
        message: 'Direct DOM access - may break SSR',
        fix: 'Wrap in useEffect or check if window exists'
      },
      {
        regex: '(?:className|class)=\\{`',
        severity: 'info',
        message: 'Template literal for className',
        fix: 'Consider using cn() utility for class merging'
      }
    ];
  }

  // Route patterns
  getRoutePatterns() {
    return [
      {
        regex: 'loader.*async.*function',
        severity: 'info',
        message: 'Route loader function',
        fix: 'Ensure follows v7 loader patterns'
      },
      {
        regex: 'throw\\s+new\\s+Response\\(',
        severity: 'info',
        message: 'Throwing Response in loader - v7 pattern',
        fix: 'Good - this is correct v7 error handling'
      },
      {
        regex: 'useLoaderData<typeof\\s+loader>',
        severity: 'info',
        message: 'Typed loader data - good practice',
        fix: 'Good - maintains type safety'
      },
      {
        regex: 'redirect\\(',
        severity: 'info',
        message: 'Using redirect - verify import from react-router',
        fix: 'Import redirect from react-router'
      }
    ];
  }

  // Supabase patterns
  getSupabasePatterns() {
    return [
      {
        regex: 'getSupabaseServerClient',
        severity: 'info',
        message: 'Server-side Supabase client',
        fix: 'Ensure proper error handling'
      },
      {
        regex: 'createDataService',
        severity: 'warning',
        message: 'Data service requires real Supabase connection',
        fix: 'Add mock data fallback for local development'
      },
      {
        regex: '\\.auth\\.getUser\\(\\)',
        severity: 'info',
        message: 'Auth check - may fail without Supabase',
        fix: 'Handle auth errors gracefully'
      },
      {
        regex: 'supabase\\.from\\(',
        severity: 'info',
        message: 'Direct Supabase query',
        fix: 'Consider error handling and mock fallback'
      }
    ];
  }

  // Authentication patterns
  getAuthPatterns() {
    return [
      {
        regex: '/login|/signup',
        severity: 'critical',
        message: 'Old auth routes - should use /auth/sign-in or /auth/sign-up',
        fix: 'Update to new auth route structure'
      },
      {
        regex: 'isAuthenticated|requireAuth',
        severity: 'info',
        message: 'Auth check logic',
        fix: 'Ensure compatible with Supabase auth'
      },
      {
        regex: 'localStorage\\.getItem\\([\'"].*token',
        severity: 'warning',
        message: 'Direct localStorage token access',
        fix: 'Use Supabase auth methods'
      }
    ];
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 CODE QUALITY SCAN REPORT');
    console.log('='.repeat(80));

    console.log(`\nTotal Issues Found: ${this.stats.issuesFound}`);
    console.log(`Critical Issues: ${this.stats.criticalIssues}`);

    // Group issues by category
    for (const [category, issues] of Object.entries(this.issues)) {
      if (issues.length === 0) continue;

      console.log(`\n\n📁 ${category.toUpperCase()} ISSUES (${issues.length})`);
      console.log('-'.repeat(60));

      // Group by file
      const byFile = {};
      for (const issue of issues) {
        if (!byFile[issue.file]) {
          byFile[issue.file] = [];
        }
        byFile[issue.file].push(issue);
      }

      // Display by file
      for (const [file, fileIssues] of Object.entries(byFile)) {
        console.log(`\n📄 ${file}`);
        
        // Sort by line number
        fileIssues.sort((a, b) => a.line - b.line);
        
        for (const issue of fileIssues) {
          const severity = issue.severity === 'critical' ? '🔴' : 
                         issue.severity === 'warning' ? '🟡' : '🔵';
          
          console.log(`  ${severity} Line ${issue.line}: ${issue.message}`);
          console.log(`     Code: ${issue.content.substring(0, 80)}${issue.content.length > 80 ? '...' : ''}`);
          if (issue.fix) {
            console.log(`     Fix: ${issue.fix}`);
          }
        }
      }
    }

    // Save detailed report
    this.saveDetailedReport();
  }

  // Save JSON report for programmatic processing
  saveDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      issues: this.issues,
      summary: this.generateSummary()
    };

    fs.writeFileSync('code-quality-report.json', JSON.stringify(report, null, 2));
    console.log('\n\n📄 Detailed report saved to: code-quality-report.json');
  }

  // Generate summary recommendations
  generateSummary() {
    const summary = {
      criticalActions: [],
      recommendations: []
    };

    // Critical actions
    if (this.issues.routerVersion.filter(i => i.severity === 'critical').length > 0) {
      summary.criticalActions.push('Update all imports from react-router-dom to react-router');
    }
    
    if (this.issues.mockData.filter(i => i.severity === 'critical').length > 0) {
      summary.criticalActions.push('Replace hardcoded data with dynamic lookups');
    }

    // Recommendations
    if (this.issues.mockData.length > 0) {
      summary.recommendations.push('Consolidate mock data into centralized files');
    }

    if (this.issues.components.length > 0) {
      summary.recommendations.push('Review components for SSR compatibility');
    }

    if (this.issues.authentication.length > 0) {
      summary.recommendations.push('Standardize authentication routes and patterns');
    }

    return summary;
  }
}

// Main execution
if (require.main === module) {
  const scanner = new CodeQualityScanner();
  const targetDir = process.argv[2] || './apps/web';
  
  scanner.scanProject(targetDir).then(() => {
    console.log('\n✅ Scan complete!');
  }).catch(error => {
    console.error('❌ Scan failed:', error);
    process.exit(1);
  });
}

module.exports = CodeQualityScanner;