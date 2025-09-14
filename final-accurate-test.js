const puppeteer = require('puppeteer');

const BASE_URL = 'https://goeventversion2-production.up.railway.app';

class AccurateTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      totalPages: 0,
      working: 0,
      authRequired: 0,
      errors: 0,
      details: []
    };
  }

  async initialize() {
    console.log('🚀 Starting Accurate Final Testing...');
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
      hasContent: false,
      hasData: false,
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
      const title = await this.page.title();
      const hasMainContent = await this.page.$('main, .main, #main, .container, .content') !== null;
      
      if (title && hasMainContent) {
        result.hasContent = true;
        result.status = 'working';
        
        // Check for data (look for cards, lists, or specific content)
        const hasCards = await this.page.$$('.card, [data-card], .event-card, .performer-card, .venue-card').length > 0;
        const hasLists = await this.page.$$('ul, ol, .list, [data-list]').length > 0;
        const hasData = await this.page.$eval('*', el => 
          el.textContent.includes('Event') || 
          el.textContent.includes('Performer') || 
          el.textContent.includes('Venue') ||
          el.textContent.includes('Community') ||
          el.textContent.includes('Calendar') ||
          el.textContent.includes('Shop') ||
          el.textContent.includes('Sign In') ||
          el.textContent.includes('Sign Up')
        );
        
        result.hasData = hasCards || hasLists || hasData;
        
        console.log(`   ✅ Working: ${title}`);
        console.log(`   📊 Content: ${hasMainContent ? 'Yes' : 'No'}`);
        console.log(`   📊 Data: ${result.hasData ? 'Yes' : 'No'}`);
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

  async runComprehensiveTest() {
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
      this.results.details.push(result);
      this.results.totalPages++;

      // Categorize results
      if (result.status === 'working') {
        this.results.working++;
      } else if (result.status === 'auth-required') {
        this.results.authRequired++;
      } else {
        this.results.errors++;
      }
    }

    await this.generateReport();
    await this.browser.close();
  }

  async generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 ACCURATE FINAL TESTING REPORT');
    console.log('='.repeat(80));

    // Overall Summary
    const successRate = ((this.results.working + this.results.authRequired) / this.results.totalPages * 100).toFixed(1);
    console.log('\n🎯 OVERALL SUMMARY:');
    console.log(`   Total Pages: ${this.results.totalPages}`);
    console.log(`   ✅ Working: ${this.results.working}`);
    console.log(`   🔐 Auth Required: ${this.results.authRequired}`);
    console.log(`   ❌ Errors: ${this.results.errors}`);
    console.log(`   📈 Success Rate: ${successRate}%`);

    // Page Type Analysis
    console.log('\n📄 PAGE TYPE ANALYSIS:');
    
    const publicPages = this.results.details.filter(p => !p.expectedAuth);
    const authPages = this.results.details.filter(p => p.expectedAuth);
    
    const publicWorking = publicPages.filter(p => p.status === 'working').length;
    const authWorking = authPages.filter(p => p.status === 'auth-required').length;
    
    console.log(`   Public Pages: ${publicWorking}/${publicPages.length} working (${(publicWorking/publicPages.length*100).toFixed(1)}%)`);
    console.log(`   Auth Pages: ${authWorking}/${authPages.length} correctly protected (${(authWorking/authPages.length*100).toFixed(1)}%)`);

    // Critical Issues
    console.log('\n🚨 CRITICAL ISSUES:');
    const criticalIssues = this.results.details.filter(p => p.status === 'error' || (p.expectedAuth && p.status !== 'auth-required'));
    
    if (criticalIssues.length > 0) {
      criticalIssues.forEach(issue => {
        console.log(`   ❌ ${issue.name}: ${issue.status} - ${issue.error || 'Unexpected behavior'}`);
      });
    } else {
      console.log('   ✅ No critical issues found!');
    }

    // Data Loading Issues
    console.log('\n📊 DATA LOADING ANALYSIS:');
    const pagesWithData = this.results.details.filter(p => p.status === 'working' && p.hasData).length;
    const pagesWithoutData = this.results.details.filter(p => p.status === 'working' && !p.hasData).length;
    
    console.log(`   Pages with data: ${pagesWithData}`);
    console.log(`   Pages without data: ${pagesWithoutData}`);

    if (pagesWithoutData > 0) {
      console.log('\n   Pages missing data:');
      this.results.details
        .filter(p => p.status === 'working' && !p.hasData)
        .forEach(page => {
          console.log(`      - ${page.name} (${page.url})`);
        });
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (this.results.errors > 0) {
      console.log('   1. Fix HTTP 500 errors on failing pages');
      console.log('   2. Ensure all detail pages load proper data');
      console.log('   3. Verify database relationships are working');
    }
    
    if (pagesWithoutData > 0) {
      console.log('   4. Fix data loading issues on working pages');
      console.log('   5. Ensure loaders are properly fetching and transforming data');
    }
    
    if (criticalIssues.some(issue => issue.expectedAuth && issue.status !== 'auth-required')) {
      console.log('   6. Fix authentication protection on pages that should require auth');
    }

    if (this.results.errors === 0 && pagesWithoutData === 0 && criticalIssues.length === 0) {
      console.log('   🎉 All pages are working perfectly!');
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Accurate testing complete!');
  }
}

// Run the test
const tester = new AccurateTester();
tester.runComprehensiveTest().catch(console.error);
