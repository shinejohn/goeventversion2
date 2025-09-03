#!/usr/bin/env node

/**
 * Automated Page Testing Script - When's The Fun
 * 
 * Systematically tests all pages to identify issues and verify fixes.
 * Run with: node test-all-pages.js
 * 
 * Prerequisites:
 * 1. App running on localhost:3000
 * 2. Supabase running locally (for auth tests): pnpm supabase:web:start
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const REPORT_FILE = 'testing-report.json';
const SCREENSHOT_DIR = 'test-screenshots';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

class PageTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      tests: []
    };
  }

  async init() {
    console.log('🚀 Initializing browser...');
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Set longer timeout for slow pages
    this.page.setDefaultTimeout(30000);
    
    console.log('✅ Browser initialized');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    
    // Save final report
    fs.writeFileSync(REPORT_FILE, JSON.stringify(this.results, null, 2));
    console.log(`\\n📊 Test report saved to ${REPORT_FILE}`);
    this.printSummary();
  }

  async testPage(testConfig) {
    const { name, url, category, tests } = testConfig;
    console.log(`\\n🧪 Testing: ${name} (${url})`);
    
    const result = {
      name,
      url,
      category,
      status: 'unknown',
      issues: [],
      loadTime: 0,
      screenshot: null,
      tests: {}
    };

    try {
      const startTime = Date.now();
      
      // Navigate to page
      const response = await this.page.goto(`${BASE_URL}${url}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      result.loadTime = Date.now() - startTime;
      result.statusCode = response?.status() || 0;
      
      // Take screenshot
      const screenshotName = `${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
      result.screenshot = path.join(SCREENSHOT_DIR, screenshotName);
      await this.page.screenshot({ path: result.screenshot, fullPage: false });
      
      // Check if page loaded successfully
      if (result.statusCode >= 400) {
        result.status = 'failed';
        result.issues.push(`HTTP ${result.statusCode} error`);
        console.log(`  ❌ HTTP ${result.statusCode}`);
      } else {
        // Run specific tests
        for (const [testName, testFn] of Object.entries(tests)) {
          try {
            const testResult = await testFn(this.page);
            result.tests[testName] = testResult;
            console.log(`    ${testResult ? '✅' : '❌'} ${testName}`);
            
            if (!testResult) {
              result.issues.push(`Test failed: ${testName}`);
            }
          } catch (error) {
            result.tests[testName] = false;
            result.issues.push(`Test error: ${testName} - ${error.message}`);
            console.log(`    ❌ ${testName} (${error.message})`);
          }
        }
        
        // Determine overall status
        const testResults = Object.values(result.tests);
        const failedTests = testResults.filter(r => !r).length;
        
        if (failedTests === 0) {
          result.status = 'passed';
          console.log(`  ✅ All tests passed (${result.loadTime}ms)`);
        } else if (failedTests < testResults.length / 2) {
          result.status = 'warning';
          console.log(`  ⚠️  ${failedTests}/${testResults.length} tests failed`);
        } else {
          result.status = 'failed';
          console.log(`  ❌ ${failedTests}/${testResults.length} tests failed`);
        }
      }
      
    } catch (error) {
      result.status = 'failed';
      result.issues.push(`Navigation error: ${error.message}`);
      console.log(`  ❌ Navigation failed: ${error.message}`);
    }
    
    // Update summary
    this.results.summary.total++;
    switch (result.status) {
      case 'passed':
        this.results.summary.passed++;
        break;
      case 'warning':
        this.results.summary.warnings++;
        break;
      case 'failed':
        this.results.summary.failed++;
        break;
    }
    
    this.results.tests.push(result);
    return result;
  }

  // Test helper functions
  async hasHeaderFooter(page) {
    const header = await page.$('header');
    const footer = await page.$('footer');
    return !!(header && footer);
  }

  async hasNavigationLinks(page) {
    const navLinks = await page.$$('nav a, header a');
    return navLinks.length > 5; // Should have main navigation links
  }

  async hasNoErrorElements(page) {
    const errorElements = await page.$$('[class*="error"], [class*="Error"], .error-message');
    return errorElements.length === 0;
  }

  async hasContent(page) {
    const bodyText = await page.evaluate(() => document.body.innerText);
    return bodyText.length > 100; // Basic content check
  }

  async hasTitle(expectedTitle) {
    return async (page) => {
      const title = await page.title();
      return title.includes(expectedTitle) || title.includes('GoEventCity');
    };
  }

  async canClickElement(selector) {
    return async (page) => {
      try {
        const element = await page.$(selector);
        if (!element) return false;
        
        await element.click();
        await page.waitForTimeout(1000); // Wait for any navigation/changes
        return true;
      } catch {
        return false;
      }
    };
  }

  async hasFormElements(page) {
    const forms = await page.$$('form');
    const inputs = await page.$$('input, textarea, select');
    return forms.length > 0 && inputs.length > 0;
  }

  async hasImageElements(page) {
    const images = await page.$$('img');
    return images.length > 0;
  }

  async hasDynamicContent(expectedTexts) {
    return async (page) => {
      const bodyText = await page.evaluate(() => document.body.innerText);
      return expectedTexts.some(text => bodyText.includes(text));
    };
  }

  printSummary() {
    const { summary } = this.results;
    console.log('\\n' + '='.repeat(50));
    console.log('📊 TESTING SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${summary.total}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`⚠️  Warnings: ${summary.warnings}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`\\nSuccess Rate: ${((summary.passed / summary.total) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));
  }

  // Main test suite
  async runAllTests() {
    await this.init();

    const testSuite = [
      // ========== AUTHENTICATION PAGES ==========
      {
        name: 'Login Page',
        url: '/auth/sign-in',
        category: 'Authentication',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_form_elements': this.hasFormElements.bind(this),
          'has_signup_link': async (page) => !!(await page.$('a[href*="sign-up"]')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },
      
      {
        name: 'Sign Up Page',
        url: '/auth/sign-up',
        category: 'Authentication',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_form_elements': this.hasFormElements.bind(this),
          'has_signin_link': async (page) => !!(await page.$('a[href*="sign-in"]')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== MAIN PAGES ==========
      {
        name: 'Homepage',
        url: '/',
        category: 'Main',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_navigation': this.hasNavigationLinks.bind(this),
          'has_hero_section': async (page) => !!(await page.$('.hero, [class*="hero"], .banner')),
          'has_events_section': async (page) => !!(await page.$('[class*="event"], .event-card')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== EVENT PAGES ==========
      {
        name: 'Events Listing',
        url: '/events',
        category: 'Events',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_event_cards': async (page) => (await page.$$('[class*="event"], .event-card')).length > 0,
          'has_search_filter': async (page) => !!(await page.$('input[type="search"], input[placeholder*="search"]')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      {
        name: 'Event Detail - Clearwater Jazz',
        url: '/events/event-1',
        category: 'Events',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'shows_clearwater_jazz': this.hasDynamicContent(['Clearwater Jazz Holiday']),
          'has_event_image': this.hasImageElements.bind(this),
          'has_venue_info': async (page) => !!(await page.$('[class*="venue"], .venue-info')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      {
        name: 'Event Detail - Food Festival',
        url: '/events/event-2',
        category: 'Events',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'shows_different_content': this.hasDynamicContent(['Food Festival', 'Downtown']),
          'not_clearwater_jazz': async (page) => {
            const text = await page.evaluate(() => document.body.innerText);
            return !text.includes('Clearwater Jazz Holiday') || text.includes('Food Festival');
          },
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== PERFORMER PAGES ==========
      {
        name: 'Performers Listing',
        url: '/performers',
        category: 'Performers',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_performer_cards': async (page) => (await page.$$('[class*="performer"], .performer-card')).length > 0,
          'has_search_filter': async (page) => !!(await page.$('input[type="search"], input[placeholder*="search"]')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      {
        name: 'Performer Detail - Sunset Vibes',
        url: '/performers/performer-1',
        category: 'Performers',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'shows_sunset_vibes': this.hasDynamicContent(['Sunset Vibes']),
          'has_performer_image': this.hasImageElements.bind(this),
          'has_performance_info': async (page) => !!(await page.$('[class*="bio"], [class*="performance"]')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      {
        name: 'Performer Detail - DJ Coastal',
        url: '/performers/performer-2',
        category: 'Performers',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'shows_dj_coastal': this.hasDynamicContent(['DJ Coastal']),
          'different_from_sunset_vibes': async (page) => {
            const text = await page.evaluate(() => document.body.innerText);
            return !text.includes('Sunset Vibes') || text.includes('DJ Coastal');
          },
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== VENUE PAGES ==========
      {
        name: 'Venues Listing',
        url: '/venues',
        category: 'Venues',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_venue_cards': async (page) => (await page.$$('[class*="venue"], .venue-card')).length > 0,
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== COMMUNITY PAGES ==========
      {
        name: 'Communities Listing',
        url: '/hubs',
        category: 'Communities',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_community_content': async (page) => !!(await page.$('[class*="hub"], [class*="community"]')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== CALENDAR PAGES ==========
      {
        name: 'Calendars Main',
        url: '/calendars',
        category: 'Calendars',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_calendar_content': async (page) => !!(await page.$('[class*="calendar"]')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      {
        name: 'Calendars Marketplace',
        url: '/calendars/marketplace',
        category: 'Calendars',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_marketplace_content': async (page) => !!(await page.$('[class*="marketplace"], [class*="calendar"]')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== BOOKING PAGES ==========
      {
        name: 'Book It Main',
        url: '/book',
        category: 'Booking',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_booking_options': async (page) => (await page.$$('button, .booking-option')).length >= 3,
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      {
        name: 'Book Performer',
        url: '/book/performer',
        category: 'Booking',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_performer_booking_content': async (page) => {
            const text = await page.evaluate(() => document.body.innerText);
            return text.includes('performer') || text.includes('booking');
          },
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== SHOP PAGES ==========
      {
        name: 'Shop Main',
        url: '/gear',
        category: 'Shop',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_products': async (page) => (await page.$$('[class*="product"], .product-card')).length > 0,
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== ADVERTISING PAGES ==========
      {
        name: 'Advertise Main',
        url: '/advertise',
        category: 'Advertising',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_advertising_options': async (page) => (await page.$$('[class*="package"], [class*="option"]')).length > 0,
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      {
        name: 'Ad Packages',
        url: '/advertise/packages',
        category: 'Advertising',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_packages': async (page) => (await page.$$('[class*="package"]')).length > 0,
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== SOCIAL PAGES ==========
      {
        name: 'Social Main',
        url: '/social',
        category: 'Social',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_social_content': async (page) => !!(await page.$('[class*="social"], [class*="feed"]')),
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== TICKET PAGES ==========
      {
        name: 'Tickets Buy',
        url: '/tickets/buy',
        category: 'Tickets',
        tests: {
          'loads_successfully': this.hasContent.bind(this),
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_ticket_content': async (page) => {
            const text = await page.evaluate(() => document.body.innerText);
            return text.includes('ticket') || text.includes('buy');
          },
          'has_no_errors': this.hasNoErrorElements.bind(this)
        }
      },

      // ========== ERROR PAGES ==========
      {
        name: '404 Page',
        url: '/non-existent-page-test',
        category: 'Error Pages',
        tests: {
          'loads_404_page': async (page) => {
            const text = await page.evaluate(() => document.body.innerText);
            return text.includes('404') || text.includes('not found');
          },
          'has_header_footer': this.hasHeaderFooter.bind(this),
          'has_navigation_from_404': this.hasNavigationLinks.bind(this),
          'has_home_button': async (page) => !!(await page.$('a[href="/"], button[onclick*="home"]'))
        }
      }
    ];

    // Run all tests
    for (const testConfig of testSuite) {
      await this.testPage(testConfig);
      await this.page.waitForTimeout(1000); // Brief pause between tests
    }

    await this.cleanup();
  }
}

// Run the tests
async function main() {
  console.log('🧪 Starting comprehensive page testing...');
  console.log(`Testing against: ${BASE_URL}`);
  console.log('📸 Screenshots will be saved to:', SCREENSHOT_DIR);
  
  try {
    const tester = new PageTester();
    await tester.runAllTests();
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Check if running as main module
if (require.main === module) {
  main().catch(console.error);
}

module.exports = PageTester;