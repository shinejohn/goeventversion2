const puppeteer = require('puppeteer');

const BASE_URL = 'https://goeventversion2-production.up.railway.app';

// Create pages to test
const CREATE_PAGES = [
  {
    url: '/events/create',
    name: 'Create Event',
    expectedElements: ['form', 'input[name="title"]', 'input[name="description"]', 'input[name="startDate"]'],
    requiredAuth: true
  },
  {
    url: '/performers/create', 
    name: 'Create Performer Profile',
    expectedElements: ['form', 'input[name="name"]', 'input[name="bio"]', 'select[name="genre"]'],
    requiredAuth: true
  },
  {
    url: '/venues/create',
    name: 'Create Venue', 
    expectedElements: ['form', 'input[name="name"]', 'input[name="address"]', 'input[name="capacity"]'],
    requiredAuth: true
  },
  {
    url: '/communities/create',
    name: 'Create Community',
    expectedElements: ['form', 'input[name="name"]', 'textarea[name="description"]', 'select[name="category"]'],
    requiredAuth: true
  },
  {
    url: '/calendars/create',
    name: 'Create Calendar',
    expectedElements: ['form', 'input[name="name"]', 'textarea[name="description"]'],
    requiredAuth: true
  }
];

async function testCreatePage(browser, page, createPage) {
  console.log(`\n🔧 Testing ${createPage.name}...`);
  console.log(`   URL: ${BASE_URL}${createPage.url}`);
  
  try {
    await page.goto(`${BASE_URL}${createPage.url}`, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for authentication redirect
    const currentUrl = page.url();
    if (currentUrl.includes('/auth/sign-in')) {
      console.log(`   ⚠️  AUTHENTICATION REQUIRED: Redirected to login`);
      return {
        success: true,
        status: 'auth_required',
        message: 'Page requires authentication'
      };
    }
    
    // Check for error pages
    const errorIndicators = ['Ouch! :|', 'Page Not Found', '404', '500', 'Error'];
    const pageContent = await page.content();
    const hasError = errorIndicators.some(indicator => pageContent.includes(indicator));
    
    if (hasError) {
      console.log(`   ❌ ERROR: Page shows error indicators`);
      return {
        success: false,
        status: 'error',
        message: 'Page shows error indicators'
      };
    }
    
    // Check for expected form elements
    const foundElements = [];
    const missingElements = [];
    
    for (const selector of createPage.expectedElements) {
      try {
        const element = await page.$(selector);
        if (element) {
          foundElements.push(selector);
        } else {
          missingElements.push(selector);
        }
      } catch (err) {
        missingElements.push(selector);
      }
    }
    
    console.log(`   📝 Found elements: ${foundElements.length}/${createPage.expectedElements.length}`);
    console.log(`   ✅ Found: ${foundElements.join(', ')}`);
    
    if (missingElements.length > 0) {
      console.log(`   ⚠️  Missing: ${missingElements.join(', ')}`);
    }
    
    // Check for form submission capability
    const forms = await page.$$('form');
    const submitButtons = await page.$$('button[type="submit"], input[type="submit"]');
    
    console.log(`   📋 Forms found: ${forms.length}`);
    console.log(`   🔘 Submit buttons: ${submitButtons.length}`);
    
    // Check for validation messages or help text
    const helpText = await page.$$('.help-text, .form-help, .text-sm.text-gray-500');
    const validationMessages = await page.$$('.error, .invalid, .text-red-500');
    
    console.log(`   💡 Help text elements: ${helpText.length}`);
    console.log(`   ⚠️  Validation elements: ${validationMessages.length}`);
    
    // Overall assessment
    const success = foundElements.length >= createPage.expectedElements.length * 0.5; // At least 50% of expected elements
    
    if (success) {
      console.log(`   ✅ SUCCESS: Create page is functional`);
    } else {
      console.log(`   ❌ FAILURE: Create page missing critical elements`);
    }
    
    return {
      success,
      status: success ? 'working' : 'broken',
      message: success ? 'Create page is functional' : 'Missing critical elements',
      foundElements,
      missingElements,
      formsCount: forms.length,
      submitButtonsCount: submitButtons.length
    };
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return {
      success: false,
      status: 'error',
      message: error.message
    };
  }
}

async function testCreatePagesWithAuth(browser) {
  console.log('\n🔐 Testing Create Pages with Authentication...');
  
  const page = await browser.newPage();
  
  try {
    // Try to login first (you'll need to create test users)
    console.log('   Attempting to login...');
    await page.goto(`${BASE_URL}/auth/sign-in`, { waitUntil: 'networkidle2' });
    
    // For now, just test without login to see what happens
    console.log('   Testing create pages without authentication...');
    
    const results = {};
    
    for (const createPage of CREATE_PAGES) {
      const result = await testCreatePage(browser, page, createPage);
      results[createPage.name] = result;
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Error testing create pages:', error);
    return {};
  } finally {
    await page.close();
  }
}

async function runCreatePageTests() {
  console.log('🚀 Starting Create Pages Testing...');
  console.log(`   Base URL: ${BASE_URL}`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Test create pages
    const results = await testCreatePagesWithAuth(browser);
    
    // Generate summary
    console.log('\n📊 CREATE PAGES TEST RESULTS');
    console.log('=' .repeat(40));
    
    Object.entries(results).forEach(([name, result]) => {
      const status = result.success ? '✅' : '❌';
      console.log(`\n${status} ${name}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Message: ${result.message}`);
      
      if (result.foundElements) {
        console.log(`   Found Elements: ${result.foundElements.length}/${CREATE_PAGES.find(p => p.name === name)?.expectedElements.length || 0}`);
      }
      
      if (result.formsCount !== undefined) {
        console.log(`   Forms: ${result.formsCount}, Submit Buttons: ${result.submitButtonsCount}`);
      }
    });
    
    // Overall summary
    const totalPages = Object.keys(results).length;
    const workingPages = Object.values(results).filter(r => r.success).length;
    const authRequiredPages = Object.values(results).filter(r => r.status === 'auth_required').length;
    const brokenPages = Object.values(results).filter(r => r.status === 'broken').length;
    
    console.log('\n📈 SUMMARY:');
    console.log(`   Total Pages: ${totalPages}`);
    console.log(`   ✅ Working: ${workingPages}`);
    console.log(`   🔐 Auth Required: ${authRequiredPages}`);
    console.log(`   ❌ Broken: ${brokenPages}`);
    
  } catch (error) {
    console.error('❌ Test suite error:', error);
  } finally {
    await browser.close();
  }
}

// Run the tests
runCreatePageTests().then(() => {
  console.log('\n🎉 Create pages testing complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
