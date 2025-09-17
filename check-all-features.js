const https = require('https');

const RAILWAY_APP_URL = 'https://when-the-fun-production.up.railway.app';

// All the routes that should be working
const allRoutes = {
  'Core Pages': [
    '/',
    '/about',
    '/contact',
    '/pricing',
    '/faq'
  ],
  'Venues': [
    '/venues',
    '/venues/1',
    '/venues/create'
  ],
  'Events': [
    '/events',
    '/events/1',
    '/events/create'
  ],
  'Performers': [
    '/performers',
    '/performers/1',
    '/performers/create'
  ],
  'Communities': [
    '/communities',
    '/community/magic-patterns-tech-talks',
    '/community/bayarea-ai-sports-adventures'
  ],
  'Hubs': [
    '/hubs',
    '/hub/1',
    '/hub/1/events'
  ],
  'Calendars': [
    '/calendars',
    '/calendars/marketplace',
    '/calendars/create'
  ],
  'Shop': [
    '/shop',
    '/shop/cart',
    '/shop/checkout'
  ],
  'Tickets': [
    '/tickets',
    '/tickets/marketplace',
    '/my-tickets'
  ],
  'Booking': [
    '/booking/calendar',
    '/booking/wizard',
    '/bookings'
  ],
  'Auth': [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/forgot-password'
  ],
  'Dashboard': [
    '/home',
    '/dashboard/fan',
    '/dashboard/organizer',
    '/dashboard/venue-owner'
  ]
};

async function checkRoute(path, category) {
  return new Promise((resolve) => {
    const url = `${RAILWAY_APP_URL}${path}`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'FeatureChecker/1.0',
        'Accept': 'text/html'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const result = {
          path,
          category,
          status: res.statusCode,
          working: false,
          issue: ''
        };
        
        // Check for common issues
        if (res.statusCode === 404) {
          result.issue = 'Route not found';
        } else if (res.statusCode === 500) {
          result.issue = 'Server error';
        } else if (res.statusCode === 302 || res.statusCode === 301) {
          result.issue = `Redirects to: ${res.headers.location}`;
        } else if (res.statusCode === 200) {
          // Check content
          if (data.includes('Application error') || data.includes('Error:')) {
            result.issue = 'Runtime error';
          } else if (data.includes('Not Found') || data.includes('404')) {
            result.issue = 'Shows 404 content';
          } else if (data.length < 1000) {
            result.issue = 'Suspiciously short content';
          } else {
            result.working = true;
            result.issue = 'OK';
          }
        }
        
        resolve(result);
      });
    }).on('error', (err) => {
      resolve({
        path,
        category,
        status: 0,
        working: false,
        issue: err.message
      });
    });
  });
}

async function checkAllFeatures() {
  console.log('Comprehensive Feature Check');
  console.log('==========================');
  console.log(`URL: ${RAILWAY_APP_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('');
  
  const results = {
    working: [],
    broken: [],
    byCategory: {}
  };
  
  // Check all routes
  for (const [category, routes] of Object.entries(allRoutes)) {
    console.log(`\nChecking ${category}...`);
    results.byCategory[category] = {
      total: routes.length,
      working: 0,
      broken: 0,
      routes: []
    };
    
    for (const route of routes) {
      const result = await checkRoute(route, category);
      
      // Short status for progress
      process.stdout.write(result.working ? '.' : 'X');
      
      results.byCategory[category].routes.push(result);
      
      if (result.working) {
        results.working.push(result.path);
        results.byCategory[category].working++;
      } else {
        results.broken.push(result);
        results.byCategory[category].broken++;
      }
    }
  }
  
  // Summary Report
  console.log('\n\n' + '='.repeat(50));
  console.log('SUMMARY REPORT');
  console.log('='.repeat(50));
  
  console.log(`\nTotal Routes Checked: ${results.working.length + results.broken.length}`);
  console.log(`Working: ${results.working.length}`);
  console.log(`Broken: ${results.broken.length}`);
  console.log(`Success Rate: ${((results.working.length / (results.working.length + results.broken.length)) * 100).toFixed(1)}%`);
  
  // Category breakdown
  console.log('\nBy Category:');
  for (const [category, stats] of Object.entries(results.byCategory)) {
    console.log(`\n${category}:`);
    console.log(`  Total: ${stats.total}`);
    console.log(`  Working: ${stats.working} (${((stats.working / stats.total) * 100).toFixed(0)}%)`);
    console.log(`  Broken: ${stats.broken}`);
    
    // Show broken routes
    if (stats.broken > 0) {
      console.log('  Issues:');
      stats.routes
        .filter(r => !r.working)
        .forEach(r => {
          console.log(`    - ${r.path}: ${r.issue} (${r.status})`);
        });
    }
  }
  
  // Critical missing features
  console.log('\n' + '='.repeat(50));
  console.log('CRITICAL ISSUES:');
  console.log('='.repeat(50));
  
  const criticalCategories = ['Shop', 'Tickets', 'Communities', 'Booking'];
  for (const category of criticalCategories) {
    const stats = results.byCategory[category];
    if (stats && stats.broken > 0) {
      console.log(`\n⚠️  ${category} - ${stats.broken}/${stats.total} routes broken`);
    }
  }
  
  // Recommendations
  console.log('\n' + '='.repeat(50));
  console.log('RECOMMENDATIONS:');
  console.log('='.repeat(50));
  console.log('\n1. Check git status - many files appear uncommitted');
  console.log('2. Verify Railway deployment branch matches your working branch');
  console.log('3. Check Railway build logs for errors');
  console.log('4. Ensure all dependencies are in package.json');
  console.log('5. Check environment variables on Railway match local');
}

// Run the comprehensive check
checkAllFeatures().catch(console.error);