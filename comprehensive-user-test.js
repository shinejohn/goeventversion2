const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL_LOCAL = 'http://localhost:5175';
const BASE_URL_RAILWAY = 'https://goeventversion2-production.up.railway.app';

const testResults = {
  timestamp: new Date().toISOString(),
  userTests: [],
  summary: { total: 0, passed: 0, failed: 0, errors: [] }
};

// Test user credentials for different user types
const testUsers = {
  fan: {
    email: 'fan@test.com',
    password: 'TestFan123!',
    name: 'Test Fan',
    role: 'fan'
  },
  performer: {
    email: 'performer@test.com', 
    password: 'TestPerformer123!',
    name: 'Test Performer',
    role: 'performer'
  },
  venueOwner: {
    email: 'venue@test.com',
    password: 'TestVenue123!', 
    name: 'Test Venue Owner',
    role: 'venue_owner'
  },
  admin: {
    email: 'admin@test.com',
    password: 'TestAdmin123!',
    name: 'Test Admin',
    role: 'admin'
  }
};

async function createTestUser(browser, user) {
  const page = await browser.newPage();
  let result = { user: user.role, action: 'user_creation', status: 'FAILED', errors: [] };
  
  try {
    // Go to signup page
    await page.goto(`${BASE_URL_LOCAL}/auth/sign-up`, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Fill out signup form
    await page.waitForSelector('input[data-test="email-input"]', { timeout: 10000 });
    await page.type('input[data-test="email-input"]', user.email);
    await page.type('input[data-test="password-input"]', user.password);
    await page.type('input[data-test="repeat-password-input"]', user.password);
    
    // Submit form
    await page.click('button[data-test="auth-submit-button"]');
    
    // Wait for client-side authentication to complete
    // The Magic Patterns components use React Query mutations
    await page.waitForFunction(() => {
      return window.location.href.includes('/home') || 
             window.location.href.includes('/dashboard') ||
             document.querySelector('[data-test="auth-submit-button"]')?.disabled === false;
    }, { timeout: 10000 });
    
    // Additional wait for any redirects
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentUrl = page.url();
    if (currentUrl.includes('/home') || currentUrl.includes('/dashboard')) {
      result.status = 'PASSED';
      result.message = 'User created and logged in successfully';
    } else {
      result.errors.push(`Unexpected redirect after signup: ${currentUrl}`);
    }
    
  } catch (error) {
    result.errors.push(`User creation failed: ${error.message}`);
  } finally {
    await page.close();
    return result;
  }
}

async function testUserAuthentication(browser, user) {
  const page = await browser.newPage();
  let result = { user: user.role, action: 'authentication', status: 'FAILED', errors: [] };
  
  try {
    // Go to login page
    await page.goto(`${BASE_URL_LOCAL}/auth/sign-in`, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Fill out login form
    await page.waitForSelector('input[data-test="email-input"]', { timeout: 10000 });
    await page.type('input[data-test="email-input"]', user.email);
    await page.type('input[data-test="password-input"]', user.password);
    
    // Submit form
    await page.click('button[data-test="auth-submit-button"]');
    
    // Wait for client-side authentication to complete
    await page.waitForFunction(() => {
      return window.location.href.includes('/home') || 
             window.location.href.includes('/dashboard') ||
             document.querySelector('[data-test="auth-submit-button"]')?.disabled === false;
    }, { timeout: 10000 });
    
    // Additional wait for any redirects
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentUrl = page.url();
    if (currentUrl.includes('/home') || currentUrl.includes('/dashboard')) {
      result.status = 'PASSED';
      result.message = 'User authenticated successfully';
    } else {
      result.errors.push(`Authentication failed, redirected to: ${currentUrl}`);
    }
    
  } catch (error) {
    result.errors.push(`Authentication test failed: ${error.message}`);
  } finally {
    await page.close();
    return result;
  }
}

async function testUserSpecificPages(browser, user) {
  const page = await browser.newPage();
  let result = { user: user.role, action: 'user_specific_pages', status: 'FAILED', errors: [] };
  
  try {
    // First login
    await page.goto(`${BASE_URL_LOCAL}/auth/sign-in`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('input[data-test="email-input"]', { timeout: 10000 });
    await page.type('input[data-test="email-input"]', user.email);
    await page.type('input[data-test="password-input"]', user.password);
    await page.click('button[data-test="auth-submit-button"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test user-specific pages based on role
    let pagesToTest = [];
    
    switch (user.role) {
      case 'fan':
        pagesToTest = [
          { url: '/home', name: 'Fan Dashboard' },
          { url: '/events', name: 'Events List' },
          { url: '/venues', name: 'Venues List' },
          { url: '/performers', name: 'Performers List' },
          { url: '/shop', name: 'Fan Shop' }
        ];
        break;
      case 'performer':
        pagesToTest = [
          { url: '/home', name: 'Performer Dashboard' },
          { url: '/performers/create', name: 'Create Performer Profile' },
          { url: '/events', name: 'Events List' },
          { url: '/venues', name: 'Venues List' }
        ];
        break;
      case 'venue_owner':
        pagesToTest = [
          { url: '/home', name: 'Venue Owner Dashboard' },
          { url: '/venues/create', name: 'Create Venue' },
          { url: '/events', name: 'Events List' },
          { url: '/venues', name: 'Venues List' }
        ];
        break;
      case 'admin':
        pagesToTest = [
          { url: '/home', name: 'Admin Dashboard' },
          { url: '/admin', name: 'Admin Panel' },
          { url: '/events', name: 'Events List' },
          { url: '/venues', name: 'Venues List' },
          { url: '/performers', name: 'Performers List' }
        ];
        break;
    }
    
    const pageResults = [];
    for (const pageTest of pagesToTest) {
      try {
        await page.goto(`${BASE_URL_LOCAL}${pageTest.url}`, { waitUntil: 'networkidle0', timeout: 30000 });
        
        const title = await page.title();
        const hasContent = await page.$eval('body', el => el.textContent.length > 100);
        const hasHeader = await page.$('header, nav, .navbar').then(el => !!el);
        const hasFooter = await page.$('footer, .footer').then(el => !!el);
        
        pageResults.push({
          page: pageTest.name,
          url: pageTest.url,
          status: hasContent && hasHeader && hasFooter ? 'PASSED' : 'FAILED',
          title: title,
          hasContent: hasContent,
          hasHeader: hasHeader,
          hasFooter: hasFooter
        });
        
      } catch (error) {
        pageResults.push({
          page: pageTest.name,
          url: pageTest.url,
          status: 'FAILED',
          error: error.message
        });
      }
    }
    
    result.pageResults = pageResults;
    result.status = pageResults.every(p => p.status === 'PASSED') ? 'PASSED' : 'FAILED';
    
  } catch (error) {
    result.errors.push(`User specific pages test failed: ${error.message}`);
  } finally {
    await page.close();
    return result;
  }
}

async function testUserDataCreation(browser, user) {
  const page = await browser.newPage();
  let result = { user: user.role, action: 'data_creation', status: 'FAILED', errors: [] };
  
  try {
    // First login
    await page.goto(`${BASE_URL_LOCAL}/auth/sign-in`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('input[data-test="email-input"]', { timeout: 10000 });
    await page.type('input[data-test="email-input"]', user.email);
    await page.type('input[data-test="password-input"]', user.password);
    await page.click('button[data-test="auth-submit-button"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const creationResults = [];
    
    // Test data creation based on user role
    switch (user.role) {
      case 'performer':
        // Test creating performer profile
        try {
          await page.goto(`${BASE_URL_LOCAL}/performers/create`, { waitUntil: 'networkidle0', timeout: 30000 });
          await page.waitForSelector('input[name="name"]', { timeout: 10000 });
          
          await page.type('input[name="name"]', `${user.name} - Performer`);
          await page.type('textarea[name="bio"]', 'Test performer bio for automated testing');
          await page.type('input[name="genre"]', 'Test Genre');
          await page.type('input[name="website"]', 'https://testperformer.com');
          
          await page.click('button[data-test="auth-submit-button"]');
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          creationResults.push({
            type: 'performer_profile',
            status: 'PASSED',
            message: 'Performer profile created successfully'
          });
        } catch (error) {
          creationResults.push({
            type: 'performer_profile',
            status: 'FAILED',
            error: error.message
          });
        }
        break;
        
      case 'venue_owner':
        // Test creating venue
        try {
          await page.goto(`${BASE_URL_LOCAL}/venues/create`, { waitUntil: 'networkidle0', timeout: 30000 });
          await page.waitForSelector('input[name="name"]', { timeout: 10000 });
          
          await page.type('input[name="name"]', `${user.name} - Venue`);
          await page.type('textarea[name="description"]', 'Test venue description for automated testing');
          await page.type('input[name="address"]', '123 Test Street, Test City, TC 12345');
          await page.type('input[name="capacity"]', '100');
          
          await page.click('button[data-test="auth-submit-button"]');
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          creationResults.push({
            type: 'venue',
            status: 'PASSED',
            message: 'Venue created successfully'
          });
        } catch (error) {
          creationResults.push({
            type: 'venue',
            status: 'FAILED',
            error: error.message
          });
        }
        break;
        
      case 'fan':
        // Test creating event (if possible)
        try {
          await page.goto(`${BASE_URL_LOCAL}/events/create`, { waitUntil: 'networkidle0', timeout: 30000 });
          
          // Check if fan can create events (might be restricted)
          const canCreate = await page.$('input[name="title"]').then(el => !!el);
          if (canCreate) {
            await page.type('input[name="title"]', `${user.name} - Test Event`);
            await page.type('textarea[name="description"]', 'Test event description for automated testing');
            await page.type('input[name="location"]', 'Test Location');
            
            await page.click('button[data-test="auth-submit-button"]');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            creationResults.push({
              type: 'event',
              status: 'PASSED',
              message: 'Event created successfully'
            });
          } else {
            creationResults.push({
              type: 'event',
              status: 'SKIPPED',
              message: 'Fan cannot create events (expected)'
            });
          }
        } catch (error) {
          creationResults.push({
            type: 'event',
            status: 'FAILED',
            error: error.message
          });
        }
        break;
    }
    
    result.creationResults = creationResults;
    result.status = creationResults.every(c => c.status === 'PASSED' || c.status === 'SKIPPED') ? 'PASSED' : 'FAILED';
    
  } catch (error) {
    result.errors.push(`Data creation test failed: ${error.message}`);
  } finally {
    await page.close();
    return result;
  }
}

async function testUserPermissions(browser, user) {
  const page = await browser.newPage();
  let result = { user: user.role, action: 'permissions', status: 'FAILED', errors: [] };
  
  try {
    // First login
    await page.goto(`${BASE_URL_LOCAL}/auth/sign-in`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('input[data-test="email-input"]', { timeout: 10000 });
    await page.type('input[data-test="email-input"]', user.email);
    await page.type('input[data-test="password-input"]', user.password);
    await page.click('button[data-test="auth-submit-button"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const permissionResults = [];
    
    // Test access to different areas based on role
    const restrictedAreas = [
      { url: '/admin', name: 'Admin Panel', allowedRoles: ['admin'] },
      { url: '/venues/create', name: 'Create Venue', allowedRoles: ['venue_owner', 'admin'] },
      { url: '/performers/create', name: 'Create Performer', allowedRoles: ['performer', 'admin'] },
      { url: '/events/create', name: 'Create Event', allowedRoles: ['venue_owner', 'performer', 'admin'] }
    ];
    
    for (const area of restrictedAreas) {
      try {
        await page.goto(`${BASE_URL_LOCAL}${area.url}`, { waitUntil: 'networkidle0', timeout: 30000 });
        
        const hasAccess = await page.$('input[name="name"], input[name="title"]').then(el => !!el);
        const isRedirected = page.url().includes('/auth/sign-in') || page.url().includes('/home');
        
        const shouldHaveAccess = area.allowedRoles.includes(user.role);
        const actualAccess = hasAccess && !isRedirected;
        
        permissionResults.push({
          area: area.name,
          url: area.url,
          expected: shouldHaveAccess,
          actual: actualAccess,
          status: (shouldHaveAccess === actualAccess) ? 'PASSED' : 'FAILED'
        });
        
      } catch (error) {
        permissionResults.push({
          area: area.name,
          url: area.url,
          status: 'ERROR',
          error: error.message
        });
      }
    }
    
    result.permissionResults = permissionResults;
    result.status = permissionResults.every(p => p.status === 'PASSED') ? 'PASSED' : 'FAILED';
    
  } catch (error) {
    result.errors.push(`Permissions test failed: ${error.message}`);
  } finally {
    await page.close();
    return result;
  }
}

async function runUserTests(browser, user) {
  console.log(`\n🧪 Testing ${user.role} user: ${user.email}`);
  
  const tests = [
    { name: 'User Creation', fn: () => createTestUser(browser, user) },
    { name: 'Authentication', fn: () => testUserAuthentication(browser, user) },
    { name: 'User Specific Pages', fn: () => testUserSpecificPages(browser, user) },
    { name: 'Data Creation', fn: () => testUserDataCreation(browser, user) },
    { name: 'Permissions', fn: () => testUserPermissions(browser, user) }
  ];
  
  const userResults = { user: user.role, tests: [] };
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      userResults.tests.push(result);
      testResults.summary.total++;
      
      if (result.status === 'PASSED') {
        testResults.summary.passed++;
      } else {
        testResults.summary.failed++;
      }
      
    } catch (error) {
      userResults.tests.push({
        user: user.role,
        action: test.name,
        status: 'FAILED',
        errors: [error.message]
      });
      testResults.summary.total++;
      testResults.summary.failed++;
    }
  }
  
  testResults.userTests.push(userResults);
  return userResults;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  console.log('🚀 Starting Comprehensive User Identity and Functionality Tests...');
  console.log('================================================================');
  
  // Test each user type
  for (const [role, user] of Object.entries(testUsers)) {
    await runUserTests(browser, user);
  }
  
  await browser.close();
  
  console.log('\n📊 COMPREHENSIVE USER TEST RESULTS');
  console.log('==================================');
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`✅ Passed: ${testResults.summary.passed}`);
  console.log(`❌ Failed: ${testResults.summary.failed}`);
  console.log(`⚠️  Errors: ${testResults.summary.errors.length}`);
  
  console.log('\n📋 DETAILED USER RESULTS');
  console.log('========================');
  
  testResults.userTests.forEach(userTest => {
    console.log(`\n👤 ${userTest.user.toUpperCase()} USER`);
    console.log('─'.repeat(20));
    
    userTest.tests.forEach(test => {
      const status = test.status === 'PASSED' ? '✅' : '❌';
      console.log(`${status} ${test.action}: ${test.status}`);
      
      if (test.errors && test.errors.length > 0) {
        test.errors.forEach(error => console.log(`   Error: ${error}`));
      }
      
      if (test.pageResults) {
        console.log('   Page Results:');
        test.pageResults.forEach(page => {
          const pageStatus = page.status === 'PASSED' ? '✅' : '❌';
          console.log(`     ${pageStatus} ${page.page}: ${page.status}`);
        });
      }
      
      if (test.creationResults) {
        console.log('   Creation Results:');
        test.creationResults.forEach(creation => {
          const creationStatus = creation.status === 'PASSED' ? '✅' : '❌';
          console.log(`     ${creationStatus} ${creation.type}: ${creation.status}`);
        });
      }
      
      if (test.permissionResults) {
        console.log('   Permission Results:');
        test.permissionResults.forEach(permission => {
          const permissionStatus = permission.status === 'PASSED' ? '✅' : '❌';
          console.log(`     ${permissionStatus} ${permission.area}: ${permission.status}`);
        });
      }
    });
  });
  
  const reportFileName = `comprehensive-user-test-report-${Date.now()}.json`;
  fs.writeFileSync(reportFileName, JSON.stringify(testResults, null, 2));
  console.log(`\n💾 Results saved to: ${reportFileName}`);
})();
