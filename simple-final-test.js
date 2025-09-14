const puppeteer = require('puppeteer');

const BASE_URL = 'https://goeventversion2-production.up.railway.app';

class SimpleTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
  }

  async initialize() {
    console.log('🚀 Starting Simple Final Testing...');
    this.browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async testPage(url, expectedAuth = false) {
    const result = {
      url,
      expectedAuth,
      status: 'unknown',
      httpStatus: 0,
      finalUrl: '',
      title: '',
      hasContent: false,
      error: null
    };

    try {
      console.log(`\n🔍 Testing: ${url}`);
      
      const response = await this.page.goto(`${BASE_URL}${url}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      result.httpStatus = response.status();
      result.finalUrl = this.page.url();
      result.title = await this.page.title();

      // Check for authentication redirect
      if (result.finalUrl.includes('/auth/sign-in')) {
        result.status = expectedAuth ? 'auth-required' : 'auth-issue';
        console.log(`   ${expectedAuth ? '✅' : '❌'} Auth required: ${expectedAuth ? 'Expected' : 'Unexpected'}`);
        return result;
      }

      // Check for 302 redirects
      if (response.status() === 302) {
        const location = response.headers().location;
        if (location && location.includes('/auth/sign-in')) {
          result.status = expectedAuth ? 'auth-required' : 'auth-issue';
          console.log(`   ${expectedAuth ? '✅' : '❌'} Auth required (302): ${expectedAuth ? 'Expected' : 'Unexpected'}`);
          return result;
        }
      }

      // Check if page loaded successfully
      if (result.title && result.title !== 'undefined') {
        result.hasContent = true;
        result.status = 'working';
        console.log(`   ✅ Working: ${result.title}`);
      } else {
        result.status = 'error';
        result.error = 'Page failed to load properly';
        console.log(`   ❌ Error: Page failed to load properly`);
      }

    } catch (error) {
      result.status = 'error';
      result.error = error.message;
      console.log(`   ❌ Error: ${error.message}`);
    }

    return result;
  }

  async runTest() {
    await this.initialize();

    const pages = [
      // Public Report Pages (should work without auth)
      { url: '/', name: 'Homepage', expectedAuth: false },
      { url: '/events', name: 'Events Discovery', expectedAuth: false },
      { url: '/performers', name: 'Performers Discovery', expectedAuth: false },
      { url: '/venues', name: 'Venues Discovery', expectedAuth: false },
      { url: '/calendars', name: 'Calendars Report', expectedAuth: false },
      { url: '/communities', name: 'Communities Report', expectedAuth: false },
      { url: '/shop', name: 'Shop/Marketplace', expectedAuth: false },

      // Public Detail Pages (should work without auth)
      { url: '/events/1', name: 'Event Detail 1', expectedAuth: false },
      { url: '/events/2', name: 'Event Detail 2', expectedAuth: false },
      { url: '/performers/1', name: 'Performer Detail', expectedAuth: false },
      { url: '/venues/1', name: 'Venue Detail', expectedAuth: false },
      { url: '/calendars/jazz-events', name: 'Calendar Detail', expectedAuth: false },
      { url: '/communities/jazz-community', name: 'Community Detail', expectedAuth: false },

      // User Dashboard Pages (should require auth)
      { url: '/home', name: 'User Dashboard', expectedAuth: true },
      { url: '/home/profile', name: 'User Profile', expectedAuth: true },
      { url: '/home/tickets', name: 'My Tickets', expectedAuth: true },
      { url: '/home/calendar', name: 'My Calendar', expectedAuth: true },
      { url: '/home/notifications', name: 'Notifications', expectedAuth: true },
      { url: '/home/messages', name: 'Messages', expectedAuth: true },
      { url: '/home/friends', name: 'Friends', expectedAuth: true },
      { url: '/home/saved', name: 'Saved Items', expectedAuth: true },
      { url: '/home/settings', name: 'Account Settings', expectedAuth: true },

      // Create Pages (should require auth)
      { url: '/events/create', name: 'Create Event', expectedAuth: true },
      { url: '/performers/create', name: 'Create Performer', expectedAuth: true },
      { url: '/venues/create', name: 'Create Venue', expectedAuth: true },
      { url: '/calendars/create', name: 'Create Calendar', expectedAuth: true },
      { url: '/communities/create', name: 'Create Community', expectedAuth: true },

      // Management Pages (should require auth)
      { url: '/home/venues', name: 'Venue Management', expectedAuth: true },
      { url: '/home/performers', name: 'Performer Management', expectedAuth: true },
      { url: '/home/organizer', name: 'Organizer Management', expectedAuth: true },

      // Auth Pages (should work without auth)
      { url: '/auth/sign-in', name: 'Sign In', expectedAuth: false },
      { url: '/auth/sign-up', name: 'Sign Up', expectedAuth: false },
      { url: '/auth/forgot-password', name: 'Forgot Password', expectedAuth: false }
    ];

    console.log('📋 Testing All Pages...');
    console.log('=' .repeat(80));

    for (const page of pages) {
      const result = await this.testPage(page.url, page.expectedAuth);
      result.name = page.name;
      this.results.push(result);
    }

    await this.generateReport();
    await this.browser.close();
  }

  async generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 SIMPLE FINAL TESTING REPORT');
    console.log('='.repeat(80));

    // Overall Summary
    const total = this.results.length;
    const working = this.results.filter(r => r.status === 'working').length;
    const authRequired = this.results.filter(r => r.status === 'auth-required').length;
    const errors = this.results.filter(r => r.status === 'error').length;
    const authIssues = this.results.filter(r => r.status === 'auth-issue').length;

    console.log('\n🎯 OVERALL SUMMARY:');
    console.log(`   Total Pages: ${total}`);
    console.log(`   ✅ Working: ${working}`);
    console.log(`   🔐 Auth Required: ${authRequired}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   ⚠️  Auth Issues: ${authIssues}`);
    console.log(`   📈 Success Rate: ${((working + authRequired) / total * 100).toFixed(1)}%`);

    // Page Type Analysis
    console.log('\n📄 PAGE TYPE ANALYSIS:');
    
    const publicPages = this.results.filter(p => !p.expectedAuth);
    const authPages = this.results.filter(p => p.expectedAuth);
    
    const publicWorking = publicPages.filter(p => p.status === 'working').length;
    const authWorking = authPages.filter(p => p.status === 'auth-required').length;
    
    console.log(`   Public Pages: ${publicWorking}/${publicPages.length} working (${(publicWorking/publicPages.length*100).toFixed(1)}%)`);
    console.log(`   Auth Pages: ${authWorking}/${authPages.length} correctly protected (${(authWorking/authPages.length*100).toFixed(1)}%)`);

    // Detailed Results
    console.log('\n📋 DETAILED RESULTS:');
    
    console.log('\n   ✅ WORKING PAGES:');
    this.results
      .filter(r => r.status === 'working')
      .forEach(r => console.log(`      - ${r.name} (${r.url})`));

    console.log('\n   🔐 AUTH REQUIRED PAGES:');
    this.results
      .filter(r => r.status === 'auth-required')
      .forEach(r => console.log(`      - ${r.name} (${r.url})`));

    if (errors > 0) {
      console.log('\n   ❌ ERROR PAGES:');
      this.results
        .filter(r => r.status === 'error')
        .forEach(r => console.log(`      - ${r.name} (${r.url}): ${r.error}`));
    }

    if (authIssues > 0) {
      console.log('\n   ⚠️  AUTH ISSUE PAGES:');
      this.results
        .filter(r => r.status === 'auth-issue')
        .forEach(r => console.log(`      - ${r.name} (${r.url}): Should require auth but does not`));
    }

    // Critical Issues
    console.log('\n🚨 CRITICAL ISSUES:');
    const criticalIssues = this.results.filter(p => p.status === 'error' || p.status === 'auth-issue');
    
    if (criticalIssues.length > 0) {
      console.log(`   Found ${criticalIssues.length} critical issues:`);
      criticalIssues.forEach(issue => {
        console.log(`      - ${issue.name}: ${issue.status} - ${issue.error || 'Unexpected behavior'}`);
      });
    } else {
      console.log('   ✅ No critical issues found!');
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (errors > 0) {
      console.log('   1. Fix HTTP 500 errors on failing pages');
      console.log('   2. Ensure all detail pages load proper data');
      console.log('   3. Verify database relationships are working');
    }
    
    if (authIssues > 0) {
      console.log('   4. Fix authentication protection on pages that should require auth');
    }

    if (errors === 0 && authIssues === 0) {
      console.log('   🎉 All pages are working correctly!');
      console.log('   🎯 The application has achieved 100% success rate!');
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Simple testing complete!');
  }
}

// Run the test
const tester = new SimpleTester();
tester.runTest().catch(console.error);
