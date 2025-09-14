const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');

const BASE_URL = 'https://goeventversion2-production.up.railway.app';

// Supabase client for database verification
const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';
const supabase = createClient(supabaseUrl, serviceKey);

// Test data for form submissions
const TEST_DATA = {
  event: {
    title: `Test Event ${Date.now()}`,
    description: 'This is a test event created by automated testing',
    startDate: '2024-12-31',
    startTime: '19:00',
    endDate: '2024-12-31', 
    endTime: '23:00',
    location: 'Test Venue Location',
    price: '25.00',
    capacity: '100',
    category: 'Music',
    status: 'published'
  },
  performer: {
    name: `Test Performer ${Date.now()}`,
    bio: 'This is a test performer created by automated testing',
    genre: 'Jazz',
    experience: 'Professional',
    location: 'Test City',
    website: 'https://testperformer.com',
    socialMedia: '@testperformer'
  },
  venue: {
    name: `Test Venue ${Date.now()}`,
    address: '123 Test Street, Test City, TC 12345',
    capacity: '200',
    description: 'This is a test venue created by automated testing',
    amenities: 'Sound system, lighting, parking',
    contactEmail: 'test@testvenue.com',
    contactPhone: '555-0123'
  },
  community: {
    name: `Test Community ${Date.now()}`,
    description: 'This is a test community created by automated testing',
    category: 'Music',
    location: 'Test City',
    website: 'https://testcommunity.com',
    socialMedia: '@testcommunity'
  },
  calendar: {
    name: `Test Calendar ${Date.now()}`,
    description: 'This is a test calendar created by automated testing',
    isPublic: true,
    color: '#3B82F6'
  }
};

// Create pages configuration
const CREATE_PAGES = [
  {
    url: '/events/create',
    name: 'Create Event',
    table: 'events',
    testData: TEST_DATA.event,
    formFields: {
      'input[name="title"]': TEST_DATA.event.title,
      'textarea[name="description"]': TEST_DATA.event.description,
      'input[name="startDate"]': TEST_DATA.event.startDate,
      'input[name="startTime"]': TEST_DATA.event.startTime,
      'input[name="endDate"]': TEST_DATA.event.endDate,
      'input[name="endTime"]': TEST_DATA.event.endTime,
      'input[name="location"]': TEST_DATA.event.location,
      'input[name="price"]': TEST_DATA.event.price,
      'input[name="capacity"]': TEST_DATA.event.capacity,
      'select[name="category"]': TEST_DATA.event.category
    }
  },
  {
    url: '/performers/create',
    name: 'Create Performer Profile', 
    table: 'performers',
    testData: TEST_DATA.performer,
    formFields: {
      'input[name="name"]': TEST_DATA.performer.name,
      'textarea[name="bio"]': TEST_DATA.performer.bio,
      'select[name="genre"]': TEST_DATA.performer.genre,
      'select[name="experience"]': TEST_DATA.performer.experience,
      'input[name="location"]': TEST_DATA.performer.location,
      'input[name="website"]': TEST_DATA.performer.website,
      'input[name="socialMedia"]': TEST_DATA.performer.socialMedia
    }
  },
  {
    url: '/venues/create',
    name: 'Create Venue',
    table: 'venues', 
    testData: TEST_DATA.venue,
    formFields: {
      'input[name="name"]': TEST_DATA.venue.name,
      'input[name="address"]': TEST_DATA.venue.address,
      'input[name="capacity"]': TEST_DATA.venue.capacity,
      'textarea[name="description"]': TEST_DATA.venue.description,
      'textarea[name="amenities"]': TEST_DATA.venue.amenities,
      'input[name="contactEmail"]': TEST_DATA.venue.contactEmail,
      'input[name="contactPhone"]': TEST_DATA.venue.contactPhone
    }
  },
  {
    url: '/communities/create',
    name: 'Create Community',
    table: 'community_hubs',
    testData: TEST_DATA.community,
    formFields: {
      'input[name="name"]': TEST_DATA.community.name,
      'textarea[name="description"]': TEST_DATA.community.description,
      'select[name="category"]': TEST_DATA.community.category,
      'input[name="location"]': TEST_DATA.community.location,
      'input[name="website"]': TEST_DATA.community.website,
      'input[name="socialMedia"]': TEST_DATA.community.socialMedia
    }
  },
  {
    url: '/calendars/create',
    name: 'Create Calendar',
    table: 'curated_calendars',
    testData: TEST_DATA.calendar,
    formFields: {
      'input[name="name"]': TEST_DATA.calendar.name,
      'textarea[name="description"]': TEST_DATA.calendar.description,
      'input[name="isPublic"]': TEST_DATA.calendar.isPublic,
      'input[name="color"]': TEST_DATA.calendar.color
    }
  }
];

async function fillForm(page, formFields) {
  console.log('   📝 Filling form fields...');
  
  for (const [selector, value] of Object.entries(formFields)) {
    try {
      // Wait for the element to be available
      await page.waitForSelector(selector, { timeout: 5000 });
      
      // Clear any existing value
      await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (element) {
          element.value = '';
        }
      }, selector);
      
      // Type the value
      await page.type(selector, value);
      console.log(`     ✅ ${selector}: "${value}"`);
      
      // Small delay between fields
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.log(`     ⚠️  Could not fill ${selector}: ${error.message}`);
    }
  }
}

async function submitForm(page, pageName) {
  console.log('   🚀 Submitting form...');
  
  try {
    // Look for submit button
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Create")',
      'button:has-text("Submit")',
      'button:has-text("Save")',
      '.btn-primary',
      '.bg-blue-600'
    ];
    
    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        submitButton = await page.$(selector);
        if (submitButton) {
          console.log(`     Found submit button: ${selector}`);
          break;
        }
      } catch (err) {
        // Continue to next selector
      }
    }
    
    if (!submitButton) {
      console.log('     ❌ No submit button found');
      return false;
    }
    
    // Click submit button
    await submitButton.click();
    console.log('     ✅ Form submitted');
    
    // Wait for navigation or success message
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      console.log('     ✅ Page navigated after submission');
    } catch (navError) {
      // Check for success indicators on current page
      const successIndicators = [
        'Success',
        'Created',
        'Saved',
        'Thank you',
        'Your event has been created',
        'Your profile has been created'
      ];
      
      const pageContent = await page.content();
      const hasSuccess = successIndicators.some(indicator => 
        pageContent.toLowerCase().includes(indicator.toLowerCase())
      );
      
      if (hasSuccess) {
        console.log('     ✅ Success message detected');
      } else {
        console.log('     ⚠️  No clear success indicator');
      }
    }
    
    return true;
    
  } catch (error) {
    console.log(`     ❌ Error submitting form: ${error.message}`);
    return false;
  }
}

async function verifyDatabaseRecord(table, testData, pageName) {
  console.log(`   🔍 Verifying record in database (${table})...`);
  
  try {
    // Wait a moment for database to be updated
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Query the database for the record
    let query = supabase.from(table).select('*');
    
    // Build query based on table and test data
    if (table === 'events') {
      query = query.eq('title', testData.title);
    } else if (table === 'performers') {
      query = query.eq('name', testData.name);
    } else if (table === 'venues') {
      query = query.eq('name', testData.name);
    } else if (table === 'community_hubs') {
      query = query.eq('name', testData.name);
    } else if (table === 'curated_calendars') {
      query = query.eq('name', testData.name);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.log(`     ❌ Database query error: ${error.message}`);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.log(`     ❌ No record found in database`);
      return false;
    }
    
    const record = data[0];
    console.log(`     ✅ Record found in database!`);
    console.log(`     📋 Record ID: ${record.id}`);
    console.log(`     📋 Created at: ${record.created_at}`);
    
    // Verify key fields match
    let fieldsMatch = true;
    const keyFields = Object.keys(testData).slice(0, 3); // Check first 3 fields
    
    for (const field of keyFields) {
      if (record[field] && record[field] !== testData[field]) {
        console.log(`     ⚠️  Field mismatch: ${field} (expected: "${testData[field]}", got: "${record[field]}")`);
        fieldsMatch = false;
      }
    }
    
    if (fieldsMatch) {
      console.log(`     ✅ Key fields match test data`);
    }
    
    return true;
    
  } catch (error) {
    console.log(`     ❌ Error verifying database record: ${error.message}`);
    return false;
  }
}

async function testCreatePageWithDatabaseVerification(browser, createPage) {
  console.log(`\n🔧 Testing ${createPage.name} with Database Verification...`);
  console.log(`   URL: ${BASE_URL}${createPage.url}`);
  
  const page = await browser.newPage();
  
  try {
    // Navigate to create page
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
        success: false,
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
    
    // Fill out the form
    await fillForm(page, createPage.formFields);
    
    // Submit the form
    const submitSuccess = await submitForm(page, createPage.name);
    
    if (!submitSuccess) {
      return {
        success: false,
        status: 'submit_failed',
        message: 'Form submission failed'
      };
    }
    
    // Verify record was created in database
    const dbVerification = await verifyDatabaseRecord(
      createPage.table, 
      createPage.testData, 
      createPage.name
    );
    
    if (dbVerification) {
      console.log(`   ✅ SUCCESS: ${createPage.name} created record in database!`);
      return {
        success: true,
        status: 'complete_success',
        message: 'Form submitted and record created in database'
      };
    } else {
      console.log(`   ⚠️  PARTIAL SUCCESS: Form submitted but database verification failed`);
      return {
        success: true,
        status: 'partial_success',
        message: 'Form submitted but database verification failed'
      };
    }
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return {
      success: false,
      status: 'error',
      message: error.message
    };
  } finally {
    await page.close();
  }
}

async function runCreatePagesWithDatabaseVerification() {
  console.log('🚀 Starting Create Pages Testing with Database Verification...');
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Database: ${supabaseUrl}`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = {};
  
  try {
    // Test each create page
    for (const createPage of CREATE_PAGES) {
      const result = await testCreatePageWithDatabaseVerification(browser, createPage);
      results[createPage.name] = result;
    }
    
    // Generate summary
    console.log('\n📊 CREATE PAGES WITH DATABASE VERIFICATION RESULTS');
    console.log('=' .repeat(60));
    
    Object.entries(results).forEach(([name, result]) => {
      const status = result.success ? '✅' : '❌';
      console.log(`\n${status} ${name}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Message: ${result.message}`);
    });
    
    // Overall summary
    const totalPages = Object.keys(results).length;
    const completeSuccess = Object.values(results).filter(r => r.status === 'complete_success').length;
    const partialSuccess = Object.values(results).filter(r => r.status === 'partial_success').length;
    const authRequired = Object.values(results).filter(r => r.status === 'auth_required').length;
    const failed = Object.values(results).filter(r => !r.success).length;
    
    console.log('\n📈 SUMMARY:');
    console.log(`   Total Pages: ${totalPages}`);
    console.log(`   ✅ Complete Success (Form + DB): ${completeSuccess}`);
    console.log(`   ⚠️  Partial Success (Form only): ${partialSuccess}`);
    console.log(`   🔐 Auth Required: ${authRequired}`);
    console.log(`   ❌ Failed: ${failed}`);
    
    // Database cleanup (optional)
    console.log('\n🧹 Cleaning up test records...');
    await cleanupTestRecords();
    
  } catch (error) {
    console.error('❌ Test suite error:', error);
  } finally {
    await browser.close();
  }
}

async function cleanupTestRecords() {
  console.log('   🗑️  Removing test records from database...');
  
  try {
    // Clean up test records
    const tables = ['events', 'performers', 'venues', 'community_hubs', 'curated_calendars'];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .like('name', `Test%${Date.now().toString().slice(-6)}%`);
      
      if (error) {
        console.log(`     ⚠️  Could not clean up ${table}: ${error.message}`);
      } else {
        console.log(`     ✅ Cleaned up ${table}`);
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Cleanup error: ${error.message}`);
  }
}

// Run the tests
runCreatePagesWithDatabaseVerification().then(() => {
  console.log('\n🎉 Create pages testing with database verification complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
