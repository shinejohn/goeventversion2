#!/usr/bin/env node

/**
 * Integration Audit Script
 * 
 * Runs comprehensive checks to catch issues BEFORE build/deploy
 * Saves hours of "build, fix, deploy, fix" cycles
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const audits = {
  navigationContext: {
    name: 'Navigation Context Check',
    critical: true,
    check: () => {
      try {
        const result = execSync(
          'grep -r "NavigationContext\\|navigateTo" apps/web/app/components/magic-patterns/ || true',
          { encoding: 'utf8' }
        );
        return {
          passed: !result.trim(),
          issues: result ? result.split('\n').filter(Boolean).length : 0,
          details: result
        };
      } catch (e) {
        return { passed: true, issues: 0 };
      }
    }
  },
  
  ssrWindowAccess: {
    name: 'SSR Window Access Check',
    critical: true,
    check: () => {
      try {
        // Find window. usage without typeof check
        const result = execSync(
          'grep -r "window\\." apps/web/app/components/magic-patterns/ | grep -v "typeof window" || true',
          { encoding: 'utf8' }
        );
        return {
          passed: !result.trim(),
          issues: result ? result.split('\n').filter(Boolean).length : 0,
          details: result
        };
      } catch (e) {
        return { passed: true, issues: 0 };
      }
    }
  },
  
  ssrDocumentAccess: {
    name: 'SSR Document Access Check',
    critical: true,
    check: () => {
      try {
        const result = execSync(
          'grep -r "document\\." apps/web/app/components/magic-patterns/ | grep -v "typeof document" || true',
          { encoding: 'utf8' }
        );
        return {
          passed: !result.trim(),
          issues: result ? result.split('\n').filter(Boolean).length : 0,
          details: result
        };
      } catch (e) {
        return { passed: true, issues: 0 };
      }
    }
  },
  
  ssrStorageAccess: {
    name: 'SSR Storage Access Check',
    critical: true,
    check: () => {
      try {
        const result = execSync(
          'grep -r "localStorage\\|sessionStorage" apps/web/app/components/magic-patterns/ | grep -v "typeof window" || true',
          { encoding: 'utf8' }
        );
        return {
          passed: !result.trim(),
          issues: result ? result.split('\n').filter(Boolean).length : 0,
          details: result
        };
      } catch (e) {
        return { passed: true, issues: 0 };
      }
    }
  },
  
  routePatterns: {
    name: 'Route Pattern Check',
    critical: true,
    check: () => {
      try {
        // Check for wrong loader data pattern
        const result = execSync(
          'grep -r "useLoaderData()" apps/web/app/routes/ | grep -v "layout.tsx" || true',
          { encoding: 'utf8' }
        );
        return {
          passed: !result.trim(),
          issues: result ? result.split('\n').filter(Boolean).length : 0,
          details: result,
          note: 'Should use props.loaderData instead of useLoaderData() hook'
        };
      } catch (e) {
        return { passed: true, issues: 0 };
      }
    }
  },
  
  tailwindImports: {
    name: 'Tailwind Import Check',
    critical: false,
    check: () => {
      const indexCss = 'apps/web/app/components/magic-patterns/index.css';
      if (fs.existsSync(indexCss)) {
        const content = fs.readFileSync(indexCss, 'utf8');
        const hasOldImports = content.includes('@import \'tailwindcss/base\'') ||
                             content.includes('@import \'tailwindcss/components\'') ||
                             content.includes('@import \'tailwindcss/utilities\'');
        return {
          passed: !hasOldImports,
          issues: hasOldImports ? 1 : 0,
          details: hasOldImports ? 'Found old Tailwind v3 imports' : ''
        };
      }
      return { passed: true, issues: 0 };
    }
  },
  
  headerAuth: {
    name: 'Header Auth Props Check',
    critical: true,
    check: () => {
      const headerFile = 'apps/web/app/components/magic-patterns/components/layout/MainHeader.tsx';
      if (fs.existsSync(headerFile)) {
        const content = fs.readFileSync(headerFile, 'utf8');
        const hasOldState = content.includes('useState(false)') && 
                           content.includes('isLoggedIn');
        const hasUserProp = content.includes('MainHeaderProps') || 
                           content.includes('{ user }');
        
        if (hasOldState && !hasUserProp) {
          return {
            passed: false,
            issues: 1,
            details: 'MainHeader still uses local auth state instead of props'
          };
        }
      }
      return { passed: true, issues: 0 };
    }
  },
  
  layoutsUpdated: {
    name: 'Layout Files Check',
    critical: true,
    check: () => {
      const layoutFiles = [
        'apps/web/app/routes/marketing/layout.tsx',
        'apps/web/app/routes/home/user/layout.tsx'
      ];
      
      let issues = [];
      layoutFiles.forEach(file => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          if (!content.includes('MainHeader') && !content.includes('magic-patterns')) {
            issues.push(`${file} not updated to use Magic Patterns components`);
          }
        }
      });
      
      return {
        passed: issues.length === 0,
        issues: issues.length,
        details: issues.join('\n')
      };
    }
  },
  
  buildTest: {
    name: 'Build Test',
    critical: true,
    check: () => {
      try {
        log('\nRunning build test (this may take a moment)...', 'cyan');
        execSync('pnpm build', { 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        return { passed: true, issues: 0 };
      } catch (error) {
        return { 
          passed: false, 
          issues: 1,
          details: 'Build failed! Check build output for errors.'
        };
      }
    }
  }
};

// Main execution
async function runAudit() {
  log('\n🔍 Magic Patterns Integration Audit', 'bright');
  log('===================================\n', 'bright');
  
  let criticalFailures = 0;
  let warnings = 0;
  const results = {};
  
  // Run all audits
  for (const [key, audit] of Object.entries(audits)) {
    process.stdout.write(`Running ${audit.name}... `);
    const result = await audit.check();
    results[key] = result;
    
    if (result.passed) {
      log('✅ PASSED', 'green');
    } else {
      if (audit.critical) {
        log(`❌ FAILED (${result.issues} issues)`, 'red');
        criticalFailures++;
      } else {
        log(`⚠️  WARNING (${result.issues} issues)`, 'yellow');
        warnings++;
      }
      
      if (result.details) {
        console.log(colors.cyan + 'Details:' + colors.reset);
        console.log(result.details);
      }
      if (result.note) {
        console.log(colors.yellow + 'Note: ' + result.note + colors.reset);
      }
      console.log('');
    }
  }
  
  // Summary
  log('\n📊 Audit Summary', 'bright');
  log('================', 'bright');
  
  if (criticalFailures === 0 && warnings === 0) {
    log('✅ All checks passed! Ready for deployment.', 'green');
  } else {
    if (criticalFailures > 0) {
      log(`❌ ${criticalFailures} critical failures found`, 'red');
    }
    if (warnings > 0) {
      log(`⚠️  ${warnings} warnings found`, 'yellow');
    }
    log('\nFix these issues before building/deploying to avoid the "hellscape"!', 'yellow');
  }
  
  // Quick fixes
  if (criticalFailures > 0) {
    log('\n🔧 Quick Fixes:', 'bright');
    
    if (!results.navigationContext.passed) {
      log('\n1. Fix Navigation:', 'cyan');
      log('   node scripts/fix-magic-patterns-navigation.js');
    }
    
    if (!results.ssrWindowAccess.passed || !results.ssrDocumentAccess.passed) {
      log('\n2. Fix SSR Issues:', 'cyan');
      log('   node scripts/check-ssr-compatibility.js');
      log('   Then manually wrap browser API calls');
    }
    
    if (!results.headerAuth.passed) {
      log('\n3. Update Header:', 'cyan');
      log('   Convert MainHeader to accept user prop');
    }
    
    if (!results.tailwindImports.passed) {
      log('\n4. Fix Tailwind:', 'cyan');
      log('   Remove old imports from magic-patterns/index.css');
    }
  }
  
  // Exit code
  process.exit(criticalFailures > 0 ? 1 : 0);
}

// Run the audit
runAudit().catch(error => {
  log(`\n❌ Audit failed: ${error.message}`, 'red');
  process.exit(1);
});