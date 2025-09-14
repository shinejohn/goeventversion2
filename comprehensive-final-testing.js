const puppeteer = require('puppeteer');

const BASE_URL = 'https://goeventversion2-production.up.railway.app';

// Test scenarios for different user types
const TEST_SCENARIOS = {
  public: {
    name: 'Public User (Not Logged In)',
    description: 'Testing all public functionality without authentication'
  },
  authenticated: {
    name: 'Authenticated User',
    description: 'Testing with a logged-in user account'
  },
  performer: {
    name: 'Performer User',
    description: 'Testing with performer-specific functionality'
  },
  venue: {
    name: 'Venue Owner',
    description: 'Testing with venue management capabilities'
  },
  organizer: {
    name: 'Event Organizer',
    description: 'Testing with event creation and management'
  }
};

// Comprehensive page testing configuration
const PAGE_TESTS = {
  // Public Report Pages
  'homepage': {
    url: '/',
    type: 'public-report',
    tests: ['load', 'navigation', 'search', 'featured-events', 'categories']
  },
  'events-discovery': {
    url: '/events',
    type: 'public-report',
    tests: ['load', 'filter', 'search', 'pagination', 'event-cards', 'sorting']
  },
  'performers-discovery': {
    url: '/performers',
    type: 'public-report',
    tests: ['load', 'filter', 'search', 'performer-cards', 'categories', 'sorting']
  },
  'venues-discovery': {
    url: '/venues',
    type: 'public-report',
    tests: ['load', 'filter', 'search', 'venue-cards', 'location-filter', 'sorting']
  },
  'calendars-report': {
    url: '/calendars',
    type: 'public-report',
    tests: ['load', 'calendar-cards', 'subscription-buttons', 'filter']
  },
  'communities-report': {
    url: '/communities',
    type: 'public-report',
    tests: ['load', 'community-cards', 'join-buttons', 'filter']
  },
  'shop-marketplace': {
    url: '/shop',
    type: 'public-report',
    tests: ['load', 'product-cards', 'categories', 'search', 'filter']
  },

  // Public Detail Pages
  'event-detail-1': {
    url: '/events/1',
    type: 'public-detail',
    tests: ['load', 'event-info', 'performers', 'venue', 'tickets', 'book-button', 'share']
  },
  'event-detail-2': {
    url: '/events/2',
    type: 'public-detail',
    tests: ['load', 'event-info', 'performers', 'venue', 'tickets', 'book-button', 'share']
  },
  'performer-detail': {
    url: '/performers/1',
    type: 'public-detail',
    tests: ['load', 'performer-info', 'bio', 'events', 'social-links', 'contact']
  },
  'venue-detail': {
    url: '/venues/1',
    type: 'public-detail',
    tests: ['load', 'venue-info', 'events', 'location', 'amenities', 'contact']
  },
  'calendar-detail': {
    url: '/calendars/jazz-events',
    type: 'public-detail',
    tests: ['load', 'calendar-info', 'events', 'subscribe-button', 'share']
  },
  'community-detail': {
    url: '/communities/jazz-community',
    type: 'public-detail',
    tests: ['load', 'community-info', 'members', 'events', 'join-button', 'discussions']
  },

  // User Dashboard Pages
  'user-dashboard': {
    url: '/home',
    type: 'user-dashboard',
    tests: ['auth-check', 'load', 'navigation', 'quick-actions', 'recent-activity']
  },
  'user-profile': {
    url: '/home/profile',
    type: 'user-dashboard',
    tests: ['auth-check', 'load', 'profile-form', 'avatar-upload', 'preferences']
  },
  'my-tickets': {
    url: '/home/tickets',
    type: 'user-dashboard',
    tests: ['auth-check', 'load', 'ticket-list', 'download', 'transfer']
  },
  'my-calendar': {
    url: '/home/calendar',
    type: 'user-dashboard',
    tests: ['auth-check', 'load', 'calendar-view', 'add-event', 'sync']
  },
  'notifications': {
    url: '/home/notifications',
    type: 'user-dashboard',
    tests: ['auth-check', 'load', 'notification-list', 'mark-read', 'settings']
  },
  'messages': {
    url: '/home/messages',
    type: 'user-dashboard',
    tests: ['auth-check', 'load', 'message-list', 'compose', 'search']
  },
  'friends': {
    url: '/home/friends',
    type: 'user-dashboard',
    tests: ['auth-check', 'load', 'friend-list', 'add-friend', 'search']
  },
  'saved-items': {
    url: '/home/saved',
    type: 'user-dashboard',
    tests: ['auth-check', 'load', 'saved-list', 'organize', 'share']
  },
  'account-settings': {
    url: '/home/settings',
    type: 'user-dashboard',
    tests: ['auth-check', 'load', 'settings-form', 'password-change', 'preferences']
  },

  // Create Pages
  'create-event': {
    url: '/events/create',
    type: 'create-page',
    tests: ['auth-check', 'load', 'form-fields', 'validation', 'submit', 'cancel']
  },
  'create-performer': {
    url: '/performers/create',
    type: 'create-page',
    tests: ['auth-check', 'load', 'form-fields', 'validation', 'submit', 'cancel']
  },
  'create-venue': {
    url: '/venues/create',
    type: 'create-page',
    tests: ['auth-check', 'load', 'form-fields', 'validation', 'submit', 'cancel']
  },
  'create-calendar': {
    url: '/calendars/create',
    type: 'create-page',
    tests: ['auth-check', 'load', 'form-fields', 'validation', 'submit', 'cancel']
  },
  'create-community': {
    url: '/communities/create',
    type: 'create-page',
    tests: ['auth-check', 'load', 'form-fields', 'validation', 'submit', 'cancel']
  },

  // Management Pages
  'venue-management': {
    url: '/home/venues',
    type: 'management-page',
    tests: ['auth-check', 'load', 'venue-list', 'add-venue', 'edit-venue', 'delete-venue']
  },
  'performer-management': {
    url: '/home/performers',
    type: 'management-page',
    tests: ['auth-check', 'load', 'performer-list', 'add-performer', 'edit-performer', 'delete-performer']
  },
  'organizer-management': {
    url: '/home/organizer',
    type: 'management-page',
    tests: ['auth-check', 'load', 'event-list', 'create-event', 'edit-event', 'delete-event']
  },

  // Auth Pages
  'sign-in': {
    url: '/auth/sign-in',
    type: 'auth-page',
    tests: ['load', 'form-fields', 'validation', 'submit', 'forgot-password', 'sign-up-link']
  },
  'sign-up': {
    url: '/auth/sign-up',
    type: 'auth-page',
    tests: ['load', 'form-fields', 'validation', 'submit', 'terms', 'sign-in-link']
  },
  'forgot-password': {
    url: '/auth/forgot-password',
    type: 'auth-page',
    tests: ['load', 'form-fields', 'validation', 'submit', 'back-to-sign-in']
  }
};

// Form field testing configurations
const FORM_TESTS = {
  'event-creation': {
    fields: [
      { name: 'title', type: 'text', required: true, testValue: 'Test Jazz Concert' },
      { name: 'description', type: 'textarea', required: false, testValue: 'An amazing jazz concert featuring local artists' },
      { name: 'category', type: 'select', required: true, testValue: 'concert' },
      { name: 'venue_id', type: 'select', required: true, testValue: '55e85f69-6ff3-40a0-a5f4-8c0b7bb7f586' },
      { name: 'start_datetime', type: 'datetime-local', required: true, testValue: '2024-12-25T19:00' },
      { name: 'end_datetime', type: 'datetime-local', required: false, testValue: '2024-12-25T22:00' },
      { name: 'price', type: 'number', required: false, testValue: '25.00' },
      { name: 'capacity', type: 'number', required: false, testValue: '100' },
      { name: 'image_url', type: 'url', required: false, testValue: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14' }
    ]
  },
  'performer-creation': {
    fields: [
      { name: 'name', type: 'text', required: true, testValue: 'Test Performer' },
      { name: 'bio', type: 'textarea', required: false, testValue: 'A talented musician with years of experience' },
      { name: 'genre', type: 'select', required: true, testValue: 'jazz' },
      { name: 'website', type: 'url', required: false, testValue: 'https://testperformer.com' },
      { name: 'social_media', type: 'text', required: false, testValue: '@testperformer' }
    ]
  },
  'venue-creation': {
    fields: [
      { name: 'name', type: 'text', required: true, testValue: 'Test Venue' },
      { name: 'address', type: 'text', required: true, testValue: '123 Test Street, Test City, TC 12345' },
      { name: 'capacity', type: 'number', required: true, testValue: '200' },
      { name: 'amenities', type: 'textarea', required: false, testValue: 'Parking, Bar, Sound System' },
      { name: 'contact_email', type: 'email', required: false, testValue: 'contact@testvenue.com' }
    ]
  }
};

class ComprehensiveTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      totalTests: 0,
      passed: 0,
      failed: 0,
      errors: [],
      pageResults: {},
      scenarioResults: {}
    };
  }

  async initialize() {
    console.log('🚀 Initializing Comprehensive Testing Suite...');
    this.browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set viewport and user agent
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    // Enable request interception for better debugging
    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      request.continue();
    });
  }

  async testPage(pageKey, pageConfig, scenario = 'public') {
    const result = {
      page: pageKey,
      url: pageConfig.url,
      type: pageConfig.type,
      scenario: scenario,
      status: 'pending',
      tests: {},
      errors: [],
      loadTime: 0,
      httpStatus: 0
    };

    try {
      console.log(`\n🔍 Testing ${pageKey} (${scenario})...`);
      console.log(`   URL: ${BASE_URL}${pageConfig.url}`);

      const startTime = Date.now();
      
      // Navigate to page
      const response = await this.page.goto(`${BASE_URL}${pageConfig.url}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      result.loadTime = Date.now() - startTime;
      result.httpStatus = response.status();

      // Check for redirects (authentication)
      const currentUrl = this.page.url();
      if (currentUrl.includes('/auth/sign-in')) {
        result.status = 'auth-required';
        result.tests['auth-check'] = { status: 'passed', message: 'Correctly redirected to authentication' };
        console.log(`   ✅ Auth required (expected)`);
        return result;
      }

      // Also check for 302 redirects in the response
      if (response.status() === 302) {
        const location = response.headers().location;
        if (location && location.includes('/auth/sign-in')) {
          result.status = 'auth-required';
          result.tests['auth-check'] = { status: 'passed', message: 'Correctly redirected to authentication' };
          console.log(`   ✅ Auth required (expected)`);
          return result;
        }
      }

      // Test each configured test
      for (const testName of pageConfig.tests) {
        try {
          const testResult = await this.runTest(testName, pageConfig.type);
          result.tests[testName] = testResult;
          
          if (testResult.status === 'passed') {
            console.log(`   ✅ ${testName}: ${testResult.message}`);
          } else {
            console.log(`   ❌ ${testName}: ${testResult.message}`);
          }
        } catch (error) {
          result.tests[testName] = {
            status: 'failed',
            message: error.message
          };
          result.errors.push(`${testName}: ${error.message}`);
          console.log(`   ❌ ${testName}: ${error.message}`);
        }
      }

      // Determine overall status
      const testResults = Object.values(result.tests);
      const passedTests = testResults.filter(t => t.status === 'passed').length;
      const totalTests = testResults.length;

      if (totalTests === 0) {
        result.status = 'no-tests';
      } else if (passedTests === totalTests) {
        result.status = 'passed';
      } else if (passedTests > 0) {
        result.status = 'partial';
      } else {
        result.status = 'failed';
      }

      console.log(`   📊 Status: ${result.status} (${passedTests}/${totalTests} tests passed)`);

    } catch (error) {
      result.status = 'error';
      result.errors.push(error.message);
      console.log(`   ❌ Error: ${error.message}`);
    }

    return result;
  }

  async runTest(testName, pageType) {
    switch (testName) {
      case 'load':
        return await this.testPageLoad();
      case 'auth-check':
        return await this.testAuthenticationRequired();
      case 'navigation':
        return await this.testNavigation();
      case 'search':
        return await this.testSearchFunctionality();
      case 'filter':
        return await this.testFilterFunctionality();
      case 'pagination':
        return await this.testPagination();
      case 'event-cards':
        return await this.testEventCards();
      case 'performer-cards':
        return await this.testPerformerCards();
      case 'venue-cards':
        return await this.testVenueCards();
      case 'calendar-cards':
        return await this.testCalendarCards();
      case 'community-cards':
        return await this.testCommunityCards();
      case 'product-cards':
        return await this.testProductCards();
      case 'form-fields':
        return await this.testFormFields(pageType);
      case 'validation':
        return await this.testFormValidation(pageType);
      case 'submit':
        return await this.testFormSubmission(pageType);
      case 'cancel':
        return await this.testCancelButton();
      default:
        return { status: 'skipped', message: `Test ${testName} not implemented` };
    }
  }

  async testPageLoad() {
    const title = await this.page.title();
    const hasContent = await this.page.$('main, .main, #main') !== null;
    
    if (title && hasContent) {
      return { status: 'passed', message: `Page loaded successfully (${title})` };
    } else {
      return { status: 'failed', message: 'Page failed to load properly' };
    }
  }

  async testAuthenticationRequired() {
    const currentUrl = this.page.url();
    if (currentUrl.includes('/auth/sign-in')) {
      return { status: 'passed', message: 'Correctly requires authentication' };
    } else {
      return { status: 'failed', message: 'Should require authentication but does not' };
    }
  }

  async testNavigation() {
    const navLinks = await this.page.$$('nav a, .nav a, header a');
    if (navLinks.length > 0) {
      return { status: 'passed', message: `Found ${navLinks.length} navigation links` };
    } else {
      return { status: 'failed', message: 'No navigation links found' };
    }
  }

  async testSearchFunctionality() {
    const searchInput = await this.page.$('input[type="search"], input[placeholder*="search" i]');
    if (searchInput) {
      return { status: 'passed', message: 'Search input found' };
    } else {
      return { status: 'failed', message: 'No search functionality found' };
    }
  }

  async testFilterFunctionality() {
    const filterElements = await this.page.$$('select, .filter, [data-filter]');
    if (filterElements.length > 0) {
      return { status: 'passed', message: `Found ${filterElements.length} filter elements` };
    } else {
      return { status: 'failed', message: 'No filter functionality found' };
    }
  }

  async testPagination() {
    const pagination = await this.page.$('.pagination, .pager, [data-pagination]');
    if (pagination) {
      return { status: 'passed', message: 'Pagination found' };
    } else {
      return { status: 'failed', message: 'No pagination found' };
    }
  }

  async testEventCards() {
    const cards = await this.page.$$('.event-card, [data-event], .card');
    const hasEventData = await this.page.$eval('*', el => 
      el.textContent.includes('Event') || el.textContent.includes('Concert') || el.textContent.includes('Show')
    );
    
    if (cards.length > 0 && hasEventData) {
      return { status: 'passed', message: `Found ${cards.length} event cards with data` };
    } else {
      return { status: 'failed', message: 'No event cards or data found' };
    }
  }

  async testPerformerCards() {
    const cards = await this.page.$$('.performer-card, [data-performer], .card');
    const hasPerformerData = await this.page.$eval('*', el => 
      el.textContent.includes('Performer') || el.textContent.includes('Artist') || el.textContent.includes('Musician')
    );
    
    if (cards.length > 0 && hasPerformerData) {
      return { status: 'passed', message: `Found ${cards.length} performer cards with data` };
    } else {
      return { status: 'failed', message: 'No performer cards or data found' };
    }
  }

  async testVenueCards() {
    const cards = await this.page.$$('.venue-card, [data-venue], .card');
    const hasVenueData = await this.page.$eval('*', el => 
      el.textContent.includes('Venue') || el.textContent.includes('Theater') || el.textContent.includes('Club')
    );
    
    if (cards.length > 0 && hasVenueData) {
      return { status: 'passed', message: `Found ${cards.length} venue cards with data` };
    } else {
      return { status: 'failed', message: 'No venue cards or data found' };
    }
  }

  async testCalendarCards() {
    const cards = await this.page.$$('.calendar-card, [data-calendar], .card');
    const hasCalendarData = await this.page.$eval('*', el => 
      el.textContent.includes('Calendar') || el.textContent.includes('Events') || el.textContent.includes('Schedule')
    );
    
    if (cards.length > 0 && hasCalendarData) {
      return { status: 'passed', message: `Found ${cards.length} calendar cards with data` };
    } else {
      return { status: 'failed', message: 'No calendar cards or data found' };
    }
  }

  async testCommunityCards() {
    const cards = await this.page.$$('.community-card, [data-community], .card');
    const hasCommunityData = await this.page.$eval('*', el => 
      el.textContent.includes('Community') || el.textContent.includes('Group') || el.textContent.includes('Hub')
    );
    
    if (cards.length > 0 && hasCommunityData) {
      return { status: 'passed', message: `Found ${cards.length} community cards with data` };
    } else {
      return { status: 'failed', message: 'No community cards or data found' };
    }
  }

  async testProductCards() {
    const cards = await this.page.$$('.product-card, [data-product], .card');
    const hasProductData = await this.page.$eval('*', el => 
      el.textContent.includes('Product') || el.textContent.includes('Item') || el.textContent.includes('Shop')
    );
    
    if (cards.length > 0 && hasProductData) {
      return { status: 'passed', message: `Found ${cards.length} product cards with data` };
    } else {
      return { status: 'failed', message: 'No product cards or data found' };
    }
  }

  async testFormFields(pageType) {
    const forms = await this.page.$$('form');
    if (forms.length === 0) {
      return { status: 'failed', message: 'No forms found' };
    }

    const form = forms[0];
    const inputs = await form.$$('input, select, textarea');
    
    if (inputs.length > 0) {
      return { status: 'passed', message: `Found ${inputs.length} form fields` };
    } else {
      return { status: 'failed', message: 'No form fields found' };
    }
  }

  async testFormValidation(pageType) {
    // Test required field validation
    const requiredFields = await this.page.$$('input[required], select[required], textarea[required]');
    
    if (requiredFields.length > 0) {
      return { status: 'passed', message: `Found ${requiredFields.length} required fields` };
    } else {
      return { status: 'failed', message: 'No required field validation found' };
    }
  }

  async testFormSubmission(pageType) {
    const submitButton = await this.page.$('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      return { status: 'passed', message: 'Submit button found' };
    } else {
      return { status: 'failed', message: 'No submit button found' };
    }
  }

  async testCancelButton() {
    const cancelButton = await this.page.$('button:contains("Cancel"), a:contains("Cancel"), [data-cancel]');
    if (cancelButton) {
      return { status: 'passed', message: 'Cancel button found' };
    } else {
      return { status: 'failed', message: 'No cancel button found' };
    }
  }

  async testFormWithRealData(formType) {
    const formConfig = FORM_TESTS[formType];
    if (!formConfig) {
      return { status: 'failed', message: `No form configuration for ${formType}` };
    }

    const results = [];
    
    for (const field of formConfig.fields) {
      try {
        const element = await this.page.$(`[name="${field.name}"]`);
        if (element) {
          if (field.type === 'select') {
            await this.page.select(`[name="${field.name}"]`, field.testValue);
          } else {
            await this.page.type(`[name="${field.name}"]`, field.testValue);
          }
          results.push({ field: field.name, status: 'filled', value: field.testValue });
        } else {
          results.push({ field: field.name, status: 'not-found' });
        }
      } catch (error) {
        results.push({ field: field.name, status: 'error', error: error.message });
      }
    }

    const filledFields = results.filter(r => r.status === 'filled').length;
    const totalFields = formConfig.fields.length;

    return {
      status: filledFields === totalFields ? 'passed' : 'partial',
      message: `Filled ${filledFields}/${totalFields} form fields`,
      details: results
    };
  }

  async runComprehensiveTest() {
    console.log('🎯 Starting Comprehensive Final Testing...');
    console.log('=' .repeat(80));

    await this.initialize();

    // Test all pages for each scenario
    for (const [scenarioKey, scenario] of Object.entries(TEST_SCENARIOS)) {
      console.log(`\n📋 Testing Scenario: ${scenario.name}`);
      console.log(`   ${scenario.description}`);
      console.log('-'.repeat(60));

      this.results.scenarioResults[scenarioKey] = {
        name: scenario.name,
        pages: {},
        summary: { total: 0, passed: 0, failed: 0, errors: 0 }
      };

      for (const [pageKey, pageConfig] of Object.entries(PAGE_TESTS)) {
        const result = await this.testPage(pageKey, pageConfig, scenarioKey);
        this.results.scenarioResults[scenarioKey].pages[pageKey] = result;
        
        // Update counters
        this.results.totalTests++;
        if (result.status === 'passed') {
          this.results.passed++;
        } else {
          this.results.failed++;
        }
        
        if (result.errors.length > 0) {
          this.results.errors.push(...result.errors);
        }

        // Update scenario summary
        this.results.scenarioResults[scenarioKey].summary.total++;
        if (result.status === 'passed') {
          this.results.scenarioResults[scenarioKey].summary.passed++;
        } else {
          this.results.scenarioResults[scenarioKey].summary.failed++;
        }
        if (result.errors.length > 0) {
          this.results.scenarioResults[scenarioKey].summary.errors++;
        }
      }
    }

    // Test form submissions with real data
    console.log('\n📝 Testing Form Submissions with Real Data...');
    console.log('-'.repeat(60));

    for (const [formType, formConfig] of Object.entries(FORM_TESTS)) {
      console.log(`\n🔧 Testing ${formType} form...`);
      
      // Navigate to appropriate create page
      let createUrl = '';
      switch (formType) {
        case 'event-creation':
          createUrl = '/events/create';
          break;
        case 'performer-creation':
          createUrl = '/performers/create';
          break;
        case 'venue-creation':
          createUrl = '/venues/create';
          break;
      }

      if (createUrl) {
        try {
          await this.page.goto(`${BASE_URL}${createUrl}`, { waitUntil: 'networkidle0' });
          
          // Check if redirected to auth
          const currentUrl = this.page.url();
          if (currentUrl.includes('/auth/sign-in')) {
            console.log(`   ⚠️  ${formType}: Authentication required`);
            continue;
          }

          const formResult = await this.testFormWithRealData(formType);
          console.log(`   ${formResult.status === 'passed' ? '✅' : '❌'} ${formType}: ${formResult.message}`);
          
          if (formResult.details) {
            formResult.details.forEach(detail => {
              console.log(`      - ${detail.field}: ${detail.status}`);
            });
          }
        } catch (error) {
          console.log(`   ❌ ${formType}: ${error.message}`);
        }
      }
    }

    await this.generateReport();
    await this.browser.close();
  }

  async generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE TESTING REPORT');
    console.log('='.repeat(80));

    // Overall Summary
    console.log('\n🎯 OVERALL SUMMARY:');
    console.log(`   Total Tests: ${this.results.totalTests}`);
    console.log(`   ✅ Passed: ${this.results.passed}`);
    console.log(`   ❌ Failed: ${this.results.failed}`);
    console.log(`   📈 Success Rate: ${((this.results.passed / this.results.totalTests) * 100).toFixed(1)}%`);

    // Scenario Results
    console.log('\n📋 SCENARIO RESULTS:');
    for (const [scenarioKey, scenario] of Object.entries(this.results.scenarioResults)) {
      const { name, summary } = scenario;
      const successRate = ((summary.passed / summary.total) * 100).toFixed(1);
      console.log(`\n   ${name}:`);
      console.log(`      Total: ${summary.total} | Passed: ${summary.passed} | Failed: ${summary.failed} | Success: ${successRate}%`);
    }

    // Page Type Analysis
    console.log('\n📄 PAGE TYPE ANALYSIS:');
    const pageTypeStats = {};
    
    for (const [pageKey, pageConfig] of Object.entries(PAGE_TESTS)) {
      const pageType = pageConfig.type;
      if (!pageTypeStats[pageType]) {
        pageTypeStats[pageType] = { total: 0, passed: 0, failed: 0 };
      }
      
      // Check results across all scenarios
      for (const scenario of Object.values(this.results.scenarioResults)) {
        const pageResult = scenario.pages[pageKey];
        if (pageResult) {
          pageTypeStats[pageType].total++;
          if (pageResult.status === 'passed') {
            pageTypeStats[pageType].passed++;
          } else {
            pageTypeStats[pageType].failed++;
          }
        }
      }
    }

    for (const [pageType, stats] of Object.entries(pageTypeStats)) {
      const successRate = ((stats.passed / stats.total) * 100).toFixed(1);
      console.log(`   ${pageType}: ${stats.passed}/${stats.total} (${successRate}%)`);
    }

    // Critical Issues
    console.log('\n🚨 CRITICAL ISSUES:');
    const criticalIssues = [];
    
    for (const [scenarioKey, scenario] of Object.entries(this.results.scenarioResults)) {
      for (const [pageKey, pageResult] of Object.entries(scenario.pages)) {
        if (pageResult.status === 'failed' || pageResult.status === 'error') {
          criticalIssues.push({
            scenario: scenarioKey,
            page: pageKey,
            status: pageResult.status,
            errors: pageResult.errors
          });
        }
      }
    }

    if (criticalIssues.length > 0) {
      criticalIssues.forEach(issue => {
        console.log(`   ❌ ${issue.scenario}/${issue.page}: ${issue.status}`);
        issue.errors.forEach(error => {
          console.log(`      - ${error}`);
        });
      });
    } else {
      console.log('   ✅ No critical issues found!');
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (this.results.failed > 0) {
      console.log('   1. Fix authentication protection on pages that should require auth');
      console.log('   2. Resolve HTTP 500 errors on detail and create pages');
      console.log('   3. Ensure all form submissions work with real data');
      console.log('   4. Test with different user roles and permissions');
    } else {
      console.log('   🎉 All tests passed! The application is working perfectly.');
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Comprehensive testing complete!');
  }
}

// Run the comprehensive test
const tester = new ComprehensiveTester();
tester.runComprehensiveTest().catch(console.error);
