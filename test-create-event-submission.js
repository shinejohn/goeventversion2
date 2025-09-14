const puppeteer = require('puppeteer');

async function testCreateEventSubmission() {
  console.log('🚀 Testing Create Event Form Submission...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to create event page
    console.log('📍 Navigating to create event page...');
    await page.goto('https://goeventversion2-production.up.railway.app/events/create', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Check if we're redirected to login
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/auth/sign-in')) {
      console.log('   ✅ Correctly redirected to login (authentication required)');
      return;
    }
    
    // Fill out the form
    console.log('📝 Filling out form...');
    await page.type('input[name="title"]', 'Test Event Submission');
    await page.type('textarea[name="description"]', 'This is a test event created via automation');
    await page.select('select[name="category"]', 'concert');
    await page.select('select[name="venue_id"]', '55e85f69-6ff3-40a0-a5f4-8c0b7bb7f586'); // First venue
    await page.type('input[name="start_datetime"]', '2024-12-25T19:00');
    await page.type('input[name="end_datetime"]', '2024-12-25T22:00');
    await page.type('input[name="price"]', '25.00');
    await page.type('input[name="capacity"]', '100');
    await page.type('input[name="image_url"]', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14');
    
    console.log('🔘 Submitting form...');
    
    // Listen for navigation
    const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    try {
      await navigationPromise;
      const newUrl = page.url();
      console.log(`   📍 Navigated to: ${newUrl}`);
      
      if (newUrl.includes('/events/')) {
        console.log('   ✅ Successfully created event and redirected to event detail page');
      } else if (newUrl.includes('/auth/sign-in')) {
        console.log('   ⚠️  Redirected to login - authentication required');
      } else {
        console.log('   ❓ Unexpected redirect');
      }
    } catch (error) {
      console.log('   ⚠️  No navigation after form submission');
      console.log(`   Error: ${error.message}`);
      
      // Check for error messages on the page
      const errorElements = await page.$$eval('*', elements => 
        elements.filter(el => 
          el.textContent && 
          (el.textContent.includes('error') || 
           el.textContent.includes('Error') ||
           el.textContent.includes('failed') ||
           el.textContent.includes('Failed'))
        ).map(el => el.textContent.trim())
      );
      
      if (errorElements.length > 0) {
        console.log('   ❌ Error messages found on page:');
        errorElements.forEach(error => console.log(`      - ${error}`));
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testCreateEventSubmission();
