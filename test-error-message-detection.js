const puppeteer = require('puppeteer');

async function testErrorMessageDetection() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Testing error message detection...');
    
    // Navigate to sign-up page
    await page.goto('https://goeventversion2-production.up.railway.app/auth/sign-up', { 
      waitUntil: 'networkidle0', 
      timeout: 30000 
    });
    
    console.log('📝 Filling out form...');
    
    // Fill out the form
    await page.type('input[name="name"]', 'Test User');
    await page.type('input[name="email"]', 'test@example.com');
    await page.type('input[name="password"]', 'TestPass123!');
    await page.type('input[name="repeatPassword"]', 'TestPass123!');
    
    // Select fan user type
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button[type="button"]');
      for (const button of buttons) {
        if (button.textContent.includes('Fan')) {
          button.click();
          break;
        }
      }
    });
    
    console.log('📤 Submitting form...');
    
    // Submit form and wait for response
    await Promise.all([
      page.waitForResponse(response => response.url().includes('/auth/sign-up') && response.request().method() === 'POST'),
      page.click('button[type="submit"]')
    ]);
    
    // Wait a bit for any redirects or error messages
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log(`📍 Current URL after submission: ${currentUrl}`);
    
    // Look for specific error message elements
    console.log('🔍 Looking for error message elements...');
    
    // Check for error message div
    const errorDiv = await page.$('.bg-red-50, .border-red-200, [class*="error"]');
    if (errorDiv) {
      const errorText = await errorDiv.evaluate(el => el.textContent);
      console.log('❌ Error div found:', errorText);
    } else {
      console.log('✅ No error div found');
    }
    
    // Check for any text containing "Registration Failed" or "error"
    const errorTexts = await page.$$eval('*', els => 
      els
        .map(el => el.textContent)
        .filter(text => text && (
          text.includes('Registration Failed') || 
          text.includes('error') || 
          text.includes('Error') ||
          text.includes('failed') ||
          text.includes('Failed')
        ))
        .filter(text => text.length < 200) // Filter out long CSS text
    );
    
    if (errorTexts.length > 0) {
      console.log('❌ Error text found:');
      errorTexts.forEach((text, index) => {
        console.log(`  ${index + 1}. ${text.trim()}`);
      });
    } else {
      console.log('✅ No error text found');
    }
    
    // Check if there are any console errors
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    // Check page content for specific error patterns
    const pageContent = await page.content();
    
    // Look for the specific error message structure
    const errorPattern = /Registration Failed[\s\S]*?<div[^>]*class="[^"]*text-red-700[^"]*"[^>]*>([^<]+)<\/div>/;
    const errorMatch = pageContent.match(errorPattern);
    
    if (errorMatch) {
      console.log('❌ Error message found in HTML:', errorMatch[1]);
    } else {
      console.log('✅ No error message found in HTML structure');
    }
    
    // Check if the form is still visible (indicating no redirect)
    const formVisible = await page.$('form[method="post"]');
    if (formVisible) {
      console.log('📝 Form is still visible - no redirect occurred');
    } else {
      console.log('✅ Form is not visible - redirect may have occurred');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testErrorMessageDetection();

