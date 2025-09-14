const puppeteer = require('puppeteer');

const BASE_URL = 'https://goeventversion2-production.up.railway.app';

async function testFormSubmission() {
  console.log('🚀 Testing Form Submission...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Run in visible mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test communities/create (this one redirects to auth)
    console.log('\n🔧 Testing Communities Create...');
    await page.goto(`${BASE_URL}/communities/create`, { waitUntil: 'networkidle2' });
    
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/auth/sign-in')) {
      console.log('   ✅ Correctly redirected to login');
      
      // Try to fill out the login form
      console.log('   🔐 Attempting to login...');
      
      // Look for email input
      const emailInput = await page.$('input[type="email"], input[name="email"]');
      if (emailInput) {
        await page.type('input[type="email"], input[name="email"]', 'test@example.com');
        console.log('   📝 Filled email');
      }
      
      // Look for password input
      const passwordInput = await page.$('input[type="password"], input[name="password"]');
      if (passwordInput) {
        await page.type('input[type="password"], input[name="password"]', 'testpass123');
        console.log('   📝 Filled password');
      }
      
      // Look for submit button
      const submitButton = await page.$('button[type="submit"], input[type="submit"]');
      if (submitButton) {
        console.log('   🔘 Found submit button');
        // Don't actually submit, just check if form is ready
      }
      
    } else {
      console.log('   ❌ Not redirected to login - unexpected behavior');
    }
    
    // Test events/create (this one shows 500 error)
    console.log('\n🔧 Testing Events Create...');
    await page.goto(`${BASE_URL}/events/create`, { waitUntil: 'networkidle2' });
    
    const eventsUrl = page.url();
    console.log(`   Current URL: ${eventsUrl}`);
    
    // Check if page loaded
    const pageContent = await page.content();
    const hasError = pageContent.includes('500') || pageContent.includes('Ouch!');
    
    if (hasError) {
      console.log('   ❌ Page shows error');
      
      // Check if form elements exist despite error
      const forms = await page.$$('form');
      const inputs = await page.$$('input');
      const buttons = await page.$$('button');
      
      console.log(`   📋 Forms: ${forms.length}`);
      console.log(`   📝 Inputs: ${inputs.length}`);
      console.log(`   🔘 Buttons: ${buttons.length}`);
      
      if (forms.length > 0) {
        console.log('   ⚠️  Form exists but page shows error - might be client-side issue');
        
        // Try to fill out the form anyway
        try {
          const titleInput = await page.$('input[name="title"]');
          if (titleInput) {
            await page.type('input[name="title"]', 'Test Event');
            console.log('   📝 Filled title field');
          }
          
          const descriptionTextarea = await page.$('textarea[name="description"]');
          if (descriptionTextarea) {
            await page.type('textarea[name="description"]', 'Test description');
            console.log('   📝 Filled description field');
          }
          
          // Try to submit
          const submitBtn = await page.$('button[type="submit"]');
          if (submitBtn) {
            console.log('   🔘 Found submit button - attempting submission...');
            await submitBtn.click();
            
            // Wait for response
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const newUrl = page.url();
            console.log(`   📍 URL after submission: ${newUrl}`);
            
            if (newUrl !== eventsUrl) {
              console.log('   ✅ Form submission caused navigation');
            } else {
              console.log('   ⚠️  No navigation after submission');
            }
          }
        } catch (error) {
          console.log(`   ❌ Error filling form: ${error.message}`);
        }
      }
    } else {
      console.log('   ✅ Page loaded without error');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await browser.close();
  }
}

testFormSubmission();
