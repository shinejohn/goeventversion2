const puppeteer = require('puppeteer');

const BASE_URL = 'https://goeventversion2-production.up.railway.app';

// Define all pages to test with their expected characteristics
const PAGES_TO_TEST = [
  // Public Report Pages (should work without auth)
  { url: '/', type: 'public-report', name: 'Homepage', requiresAuth: false, callsTables: ['events', 'venues', 'performers'] },
  { url: '/events', type: 'public-report', name: 'Events Discovery', requiresAuth: false, callsTables: ['events', 'venues', 'performers'] },
  { url: '/performers', type: 'public-report', name: 'Performers Discovery', requiresAuth: false, callsTables: ['performers', 'event_performers'] },
  { url: '/venues', type: 'public-report', name: 'Venues Discovery', requiresAuth: false, callsTables: ['venues', 'events'] },
  { url: '/calendars', type: 'public-report', name: 'Calendars Report', requiresAuth: false, callsTables: ['curated_calendars', 'calendars'] },
  { url: '/communities', type: 'public-report', name: 'Communities Report', requiresAuth: false, callsTables: ['community_hubs'] },
  { url: '/shop', type: 'public-report', name: 'Shop/Marketplace', requiresAuth: false, callsTables: ['products', 'shops'] },
  
  // Public Detail Pages (should work without auth)
  { url: '/events/4ddfb41a-991f-4098-9965-f498a3d06a2f', type: 'public-detail', name: 'Event Detail', requiresAuth: false, callsTables: ['events', 'venues', 'event_performers', 'performers'] },
  { url: '/events/99726dc7-24e4-4223-87e9-6c69adcd9237', type: 'public-detail', name: 'Event Detail 2', requiresAuth: false, callsTables: ['events', 'venues', 'event_performers', 'performers'] },
  { url: '/performers/f45f3c1a-7454-4fef-8fd1-89e928138970', type: 'public-detail', name: 'Performer Detail', requiresAuth: false, callsTables: ['performers', 'event_performers', 'events'] },
  { url: '/venues/91d4cdfa-b302-4a1c-bcb2-6a0b75306480', type: 'public-detail', name: 'Venue Detail', requiresAuth: false, callsTables: ['venues', 'events', 'event_performers'] },
  { url: '/calendars/calendar-1', type: 'public-detail', name: 'Calendar Detail', requiresAuth: false, callsTables: ['calendars', 'events'] },
  { url: '/communities/community-1', type: 'public-detail', name: 'Community Detail', requiresAuth: false, callsTables: ['community_hubs', 'events'] },
  
  // User Dashboard Pages (require auth)
  { url: '/home', type: 'user-dashboard', name: 'User Dashboard', requiresAuth: true, callsTables: ['accounts', 'bookings', 'tickets'] },
  { url: '/home/profile', type: 'user-dashboard', name: 'User Profile', requiresAuth: true, callsTables: ['user_profiles', 'accounts'] },
  { url: '/home/tickets', type: 'user-dashboard', name: 'My Tickets', requiresAuth: true, callsTables: ['tickets', 'events', 'bookings'] },
  { url: '/home/calendar', type: 'user-dashboard', name: 'My Calendar', requiresAuth: true, callsTables: ['calendars', 'events'] },
  { url: '/home/notifications', type: 'user-dashboard', name: 'Notifications', requiresAuth: true, callsTables: ['notifications'] },
  { url: '/home/messages', type: 'user-dashboard', name: 'Messages', requiresAuth: true, callsTables: ['messages'] },
  { url: '/home/friends', type: 'user-dashboard', name: 'Friends', requiresAuth: true, callsTables: ['friendships', 'accounts'] },
  { url: '/home/saved', type: 'user-dashboard', name: 'Saved Items', requiresAuth: true, callsTables: ['saved_items', 'events'] },
  { url: '/home/settings', type: 'user-dashboard', name: 'Account Settings', requiresAuth: true, callsTables: ['user_preferences', 'accounts'] },
  
  // Create/Input Pages (require auth)
  { url: '/events/new', type: 'create-page', name: 'Create Event', requiresAuth: true, callsTables: ['events', 'venues', 'performers'] },
  { url: '/performers/new', type: 'create-page', name: 'Create Performer Profile', requiresAuth: true, callsTables: ['performers', 'accounts'] },
  { url: '/venues/new', type: 'create-page', name: 'Create Venue', requiresAuth: true, callsTables: ['venues', 'accounts'] },
  { url: '/calendars/new', type: 'create-page', name: 'Create Calendar', requiresAuth: true, callsTables: ['calendars', 'accounts'] },
  { url: '/communities/new', type: 'create-page', name: 'Create Community', requiresAuth: true, callsTables: ['community_hubs', 'accounts'] },
  
  // Management Pages (require auth + specific roles)
  { url: '/home/venue-management', type: 'management-page', name: 'Venue Management', requiresAuth: true, requiresRole: 'venue', callsTables: ['venues', 'events', 'bookings'] },
  { url: '/home/performer-management', type: 'management-page', name: 'Performer Management', requiresAuth: true, requiresRole: 'performer', callsTables: ['performers', 'event_performers', 'events'] },
  { url: '/home/organizer-management', type: 'management-page', name: 'Organizer Management', requiresAuth: true, requiresRole: 'organizer', callsTables: ['events', 'venues', 'performers'] },
  
  // Auth Pages (no auth required)
  { url: '/auth/sign-in', type: 'auth-page', name: 'Sign In', requiresAuth: false, callsTables: [] },
  { url: '/auth/sign-up', type: 'auth-page', name: 'Sign Up', requiresAuth: false, callsTables: [] },
  { url: '/auth/forgot-password', type: 'auth-page', name: 'Forgot Password', requiresAuth: false, callsTables: [] },
];

async function analyzePage(page, pageInfo) {
  const result = {
    url: pageInfo.url,
    name: pageInfo.name,
    type: pageInfo.type,
    requiresAuth: pageInfo.requiresAuth,
    requiresRole: pageInfo.requiresRole,
    callsTables: pageInfo.callsTables,
    status: 'unknown',
    httpStatus: 0,
    hasContent: false,
    hasData: false,
    hasError: false,
    errorMessage: '',
    redirectsToAuth: false,
    redirectsTo: '',
    loadTime: 0,
    issues: []
  };

  try {
    const startTime = Date.now();
    
    const response = await page.goto(`${BASE_URL}${pageInfo.url}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    result.loadTime = Date.now() - startTime;
    result.httpStatus = response.status();
    
    // Check for redirects
    const currentUrl = page.url();
    if (currentUrl !== `${BASE_URL}${pageInfo.url}`) {
      result.redirectsTo = currentUrl;
      if (currentUrl.includes('/auth/')) {
        result.redirectsToAuth = true;
      }
    }
    
    // Check page content
    const content = await page.content();
    result.hasContent = content.length > 1000; // Basic content check
    
    // Check for error messages
    const errorSelectors = [
      'text="Event Not Found"',
      'text="Performer Not Found"',
      'text="Venue Not Found"',
      'text="404"',
      'text="500"',
      'text="Error"',
      'text="Not Found"',
      '[data-test="error"]',
      '.error',
      '.not-found'
    ];
    
    for (const selector of errorSelectors) {
      try {
        const errorElement = await page.$(selector);
        if (errorElement) {
          result.hasError = true;
          result.errorMessage = await page.evaluate(el => el.textContent, errorElement);
          break;
        }
      } catch (e) {
        // Ignore selector errors
      }
    }
    
    // Check for data presence (cards, lists, etc.)
    const dataSelectors = [
      '[data-test="event-card"]',
      '[data-test="performer-card"]',
      '[data-test="venue-card"]',
      '[data-test="calendar-card"]',
      '[data-test="community-card"]',
      '.event-card',
      '.performer-card',
      '.venue-card',
      '.calendar-card',
      '.community-card',
      'article',
      '.card',
      // Look for actual rendered content
      'text="Jazz Night"',
      'text="DJ Phoenix"',
      'text="Sarah Chen"',
      'text="Summer Music Festival"',
      'text="Comedy Night"',
      'text="Food & Wine"',
      'text="Tech Conference"',
      // Look for event card structure
      '.relative.overflow-hidden.transition-all',
      '.bg-white.rounded-lg',
      '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3'
    ];
    
    for (const selector of dataSelectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          result.hasData = true;
          break;
        }
      } catch (e) {
        // Ignore selector errors
      }
    }
    
    // Determine status
    if (result.httpStatus >= 400) {
      result.status = 'error';
      result.issues.push(`HTTP ${result.httpStatus}`);
    } else if (result.hasError) {
      result.status = 'error';
      result.issues.push(`Page error: ${result.errorMessage}`);
    } else if (result.requiresAuth && result.redirectsToAuth) {
      result.status = 'auth-required';
      result.issues.push('Redirects to auth (expected)');
    } else if (result.requiresAuth && !result.redirectsToAuth) {
      result.status = 'auth-issue';
      result.issues.push('Should require auth but does not');
    } else if (!result.hasContent) {
      result.status = 'no-content';
      result.issues.push('No content loaded');
    } else if (result.type.includes('report') && !result.hasData) {
      result.status = 'no-data';
      result.issues.push('Report page has no data cards');
    } else if (result.type.includes('detail') && !result.hasData) {
      result.status = 'no-data';
      result.issues.push('Detail page has no data');
    } else {
      result.status = 'working';
    }
    
  } catch (error) {
    result.status = 'error';
    result.errorMessage = error.message;
    result.issues.push(`Exception: ${error.message}`);
  }
  
  return result;
}

async function runComprehensiveAnalysis() {
  console.log('🔍 Starting comprehensive page analysis...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  const results = [];
  
  for (const pageInfo of PAGES_TO_TEST) {
    console.log(`\n📄 Testing: ${pageInfo.name} (${pageInfo.type})`);
    const result = await analyzePage(page, pageInfo);
    results.push(result);
    
    console.log(`  Status: ${result.status}`);
    console.log(`  HTTP: ${result.httpStatus}`);
    console.log(`  Content: ${result.hasContent ? 'Yes' : 'No'}`);
    console.log(`  Data: ${result.hasData ? 'Yes' : 'No'}`);
    console.log(`  Load Time: ${result.loadTime}ms`);
    if (result.issues.length > 0) {
      console.log(`  Issues: ${result.issues.join(', ')}`);
    }
  }
  
  await browser.close();
  
  // Analyze results by page type
  console.log('\n📊 ANALYSIS BY PAGE TYPE:');
  
  const analysis = {
    'public-report': { total: 0, working: 0, issues: [] },
    'public-detail': { total: 0, working: 0, issues: [] },
    'user-dashboard': { total: 0, working: 0, issues: [] },
    'create-page': { total: 0, working: 0, issues: [] },
    'management-page': { total: 0, working: 0, issues: [] },
    'auth-page': { total: 0, working: 0, issues: [] }
  };
  
  results.forEach(result => {
    analysis[result.type].total++;
    if (result.status === 'working') {
      analysis[result.type].working++;
    } else {
      analysis[result.type].issues.push({
        name: result.name,
        status: result.status,
        issues: result.issues
      });
    }
  });
  
  Object.entries(analysis).forEach(([type, data]) => {
    const percentage = data.total > 0 ? Math.round((data.working / data.total) * 100) : 0;
    console.log(`\n${type.toUpperCase()}:`);
    console.log(`  Total: ${data.total}`);
    console.log(`  Working: ${data.working} (${percentage}%)`);
    console.log(`  Issues: ${data.issues.length}`);
    
    if (data.issues.length > 0) {
      data.issues.forEach(issue => {
        console.log(`    - ${issue.name}: ${issue.status} (${issue.issues.join(', ')})`);
      });
    }
  });
  
  // Common issues analysis
  console.log('\n🔍 COMMON ISSUES ANALYSIS:');
  
  const commonIssues = {};
  results.forEach(result => {
    result.issues.forEach(issue => {
      commonIssues[issue] = (commonIssues[issue] || 0) + 1;
    });
  });
  
  Object.entries(commonIssues)
    .sort(([,a], [,b]) => b - a)
    .forEach(([issue, count]) => {
      console.log(`  ${issue}: ${count} pages`);
    });
  
  // Database relationship issues
  console.log('\n🗄️ DATABASE RELATIONSHIP ANALYSIS:');
  
  const relationshipIssues = {};
  results.forEach(result => {
    if (result.status === 'no-data' && result.callsTables) {
      result.callsTables.forEach(table => {
        relationshipIssues[table] = (relationshipIssues[table] || 0) + 1;
      });
    }
  });
  
  Object.entries(relationshipIssues)
    .sort(([,a], [,b]) => b - a)
    .forEach(([table, count]) => {
      console.log(`  ${table}: ${count} pages with no data`);
    });
  
  console.log('\n✅ Analysis complete!');
  
  return results;
}

runComprehensiveAnalysis().catch(console.error);
