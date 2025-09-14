const puppeteer = require('puppeteer');

async function testSimpleFormSubmission() {
  console.log('🚀 Testing Simple Form Submission...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to create event page
    console.log('📍 Navigating to create event page...');
    await page.goto('https://goeventversion2-production.up.railway.app/events/create', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    
    // Check if we're redirected to login
    if (currentUrl.includes('/auth/sign-in')) {
      console.log('   ✅ Correctly redirected to login (authentication required)');
      return;
    }
    
    // Check if form is present
    const formExists = await page.$('form[method="post"]');
    if (!formExists) {
      console.log('   ❌ Form not found');
      return;
    }
    
    console.log('   ✅ Form found');
    
    // Fill out required fields
    console.log('📝 Filling out form...');
    await page.type('input[name="title"]', 'Test Event Submission');
    await page.select('select[name="category"]', 'concert');
    await page.select('select[name="venue_id"]', '55e85f69-6ff3-40a0-a5f4-8c0b7bb7f586');
    await page.type('input[name="start_datetime"]', '2024-12-25T19:00');
    
    console.log('🔘 Submitting form...');
    
    // Submit the form and wait for response
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/events/create') && response.request().method() === 'POST'),
      page.click('button[type="submit"]')
    ]);
    
    console.log(`   📍 Response status: ${response.status()}`);
    
    if (response.status() === 302) {
      console.log('   ✅ Form submitted successfully - redirect received');
      const location = response.headers().location;
      if (location) {
        console.log(`   📍 Redirecting to: ${location}`);
        if (location.includes('/events/')) {
          console.log('   ✅ Successfully created event and redirected to event detail page');
        } else if (location.includes('/auth/sign-in')) {
          console.log('   ⚠️  Redirected to login - authentication required');
        }
      }
    } else if (response.status() === 200) {
      console.log('   ⚠️  Form submitted but no redirect - checking for errors');
      
      // Check for error messages
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
        console.log('   ❌ Error messages found:');
        errorElements.forEach(error => console.log(`      - ${error}`));
      } else {
        console.log('   ✅ No error messages found - form may have submitted successfully');
      }
    } else {
      console.log(`   ❌ Unexpected response status: ${response.status()}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testSimpleFormSubmission();
