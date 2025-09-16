const puppeteer = require('puppeteer');

async function testSSRAuth() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Testing SSR Authentication on Railway...');
    
    // Test sign-up page
    console.log('📝 Testing sign-up page...');
    await page.goto('https://goeventversion2-production.up.railway.app/auth/sign-up', { 
      waitUntil: 'networkidle0', 
      timeout: 30000 
    });
    
    // Check if form elements exist
    const nameInput = await page.$('input[name="name"]');
    const emailInput = await page.$('input[name="email"]');
    const passwordInput = await page.$('input[name="password"]');
    const repeatPasswordInput = await page.$('input[name="repeatPassword"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log('Form elements found:');
    console.log(`- Name input: ${nameInput ? '✅' : '❌'}`);
    console.log(`- Email input: ${emailInput ? '✅' : '❌'}`);
    console.log(`- Password input: ${passwordInput ? '✅' : '❌'}`);
    console.log(`- Repeat password input: ${repeatPasswordInput ? '✅' : '❌'}`);
    console.log(`- Submit button: ${submitButton ? '✅' : '❌'}`);
    
    if (nameInput && emailInput && passwordInput && repeatPasswordInput && submitButton) {
      console.log('✅ All form elements found! Testing form submission...');
      
      // Fill out the form
      await page.type('input[name="name"]', 'Test User');
      await page.type('input[name="email"]', 'test@example.com');
      await page.type('input[name="password"]', 'TestPass123!');
      await page.type('input[name="repeatPassword"]', 'TestPass123!');
      
      // Click submit
      await page.click('button[type="submit"]');
      
      // Wait for response
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const currentUrl = page.url();
      console.log(`Current URL after submission: ${currentUrl}`);
      
      // Check for error messages on the page
      const errorMessage = await page.$eval('.error, [class*="error"], .alert, [class*="alert"]', el => el.textContent).catch(() => null);
      if (errorMessage) {
        console.log(`❌ Error message found: ${errorMessage}`);
      }
      
      // Check page content for any error indicators
      const pageContent = await page.content();
      if (pageContent.includes('error') || pageContent.includes('Error') || pageContent.includes('failed')) {
        console.log('❌ Error indicators found in page content');
        
        // Look for specific error messages
        const errorMatches = pageContent.match(/error[^>]*>([^<]+)/gi);
        if (errorMatches) {
          console.log('Error messages found:', errorMatches.slice(0, 3));
        }
        
        // Check if there's a form with error state
        const formErrors = await page.$$eval('[class*="error"], .text-red-500, .text-red-600', els => 
          els.map(el => el.textContent.trim()).filter(text => text.length > 0)
        );
        if (formErrors.length > 0) {
          console.log('Form errors:', formErrors);
        }
      }
      
      if (currentUrl.includes('/home') || currentUrl.includes('/dashboard')) {
        console.log('✅ Form submission successful - redirected to home!');
      } else {
        console.log('❌ Form submission failed - not redirected to home');
      }
    } else {
      console.log('❌ Form elements not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testSSRAuth();
