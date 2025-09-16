const puppeteer = require('puppeteer');

async function testFormSubmissionDebug() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Testing form submission with detailed debugging...');
    
    // Enable request/response logging
    page.on('request', request => {
      if (request.url().includes('/auth/sign-up')) {
        console.log('📤 Request:', request.method(), request.url());
        console.log('📤 Headers:', request.headers());
        if (request.postData()) {
          console.log('📤 Body:', request.postData());
        }
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/auth/sign-up')) {
        console.log('📥 Response:', response.status(), response.url());
        console.log('📥 Headers:', response.headers());
      }
    });
    
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
    
    // Check for error messages
    const errorElements = await page.$$eval('[class*="error"], .text-red-500, .text-red-600, .alert, [class*="alert"]', els => 
      els.map(el => ({
        text: el.textContent.trim(),
        className: el.className,
        tagName: el.tagName
      })).filter(item => item.text.length > 0)
    );
    
    if (errorElements.length > 0) {
      console.log('❌ Error elements found:');
      errorElements.forEach((error, index) => {
        console.log(`  ${index + 1}. [${error.tagName}] ${error.text} (${error.className})`);
      });
    }
    
    // Check page content for any error indicators
    const pageContent = await page.content();
    const errorKeywords = ['error', 'Error', 'failed', 'Failed', 'invalid', 'Invalid'];
    const foundErrors = errorKeywords.filter(keyword => 
      pageContent.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (foundErrors.length > 0) {
      console.log('❌ Error keywords found in page content:', foundErrors);
      
      // Look for specific error patterns
      const errorPatterns = [
        /error[^>]*>([^<]+)/gi,
        /Error[^>]*>([^<]+)/gi,
        /failed[^>]*>([^<]+)/gi,
        /Failed[^>]*>([^<]+)/gi
      ];
      
      errorPatterns.forEach(pattern => {
        const matches = pageContent.match(pattern);
        if (matches) {
          console.log('Error pattern matches:', matches.slice(0, 3));
        }
      });
    }
    
    // Check if there are any console errors
    const consoleMessages = await page.evaluate(() => {
      return window.consoleMessages || [];
    });
    
    if (consoleMessages.length > 0) {
      console.log('📝 Console messages:');
      consoleMessages.forEach(msg => console.log(`  - ${msg}`));
    }
    
    if (currentUrl.includes('/home') || currentUrl.includes('/dashboard')) {
      console.log('✅ Form submission successful - redirected to home!');
    } else {
      console.log('❌ Form submission failed - not redirected to home');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testFormSubmissionDebug();

