const puppeteer = require('puppeteer');

const BASE_URL = 'https://goeventversion2-production.up.railway.app';

async function debugCreatePage(url, pageName) {
  console.log(`\n🔍 Debugging ${pageName}...`);
  console.log(`   URL: ${BASE_URL}${url}`);
  
  const browser = await puppeteer.launch({ 
    headless: false, // Run in visible mode for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto(`${BASE_URL}${url}`, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get page content
    const content = await page.content();
    
    // Check for specific error messages
    const errorMessages = [
      'Ouch! :|',
      'Page Not Found',
      '404',
      '500',
      'Error',
      'Something went wrong',
      'Internal Server Error',
      'Application Error'
    ];
    
    console.log('   📄 Page content analysis:');
    console.log(`   Title: ${await page.title()}`);
    console.log(`   URL: ${page.url()}`);
    
    const foundErrors = errorMessages.filter(msg => content.includes(msg));
    if (foundErrors.length > 0) {
      console.log(`   ❌ Found error messages: ${foundErrors.join(', ')}`);
    } else {
      console.log(`   ✅ No error messages found`);
    }
    
    // Check for form elements
    const forms = await page.$$('form');
    const inputs = await page.$$('input');
    const buttons = await page.$$('button');
    
    console.log(`   📋 Forms: ${forms.length}`);
    console.log(`   📝 Inputs: ${inputs.length}`);
    console.log(`   🔘 Buttons: ${buttons.length}`);
    
    // Check for specific form fields
    const titleInput = await page.$('input[name="title"]');
    const descriptionTextarea = await page.$('textarea[name="description"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log(`   📝 Title input: ${titleInput ? 'Found' : 'Not found'}`);
    console.log(`   📝 Description textarea: ${descriptionTextarea ? 'Found' : 'Not found'}`);
    console.log(`   🔘 Submit button: ${submitButton ? 'Found' : 'Not found'}`);
    
    // Take a screenshot for visual debugging
    await page.screenshot({ path: `debug-${pageName.toLowerCase().replace(/\s+/g, '-')}.png` });
    console.log(`   📸 Screenshot saved: debug-${pageName.toLowerCase().replace(/\s+/g, '-')}.png`);
    
    // Get console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    console.log(`   🚨 Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(error => console.log(`     - ${error}`));
    }
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

async function debugAllCreatePages() {
  console.log('🚀 Debugging All Create Pages...');
  
  const createPages = [
    { url: '/events/create', name: 'Create Event' },
    { url: '/performers/create', name: 'Create Performer' },
    { url: '/venues/create', name: 'Create Venue' },
    { url: '/communities/create', name: 'Create Community' },
    { url: '/calendars/create', name: 'Create Calendar' }
  ];
  
  for (const page of createPages) {
    await debugCreatePage(page.url, page.name);
  }
  
  console.log('\n🎉 Debugging complete!');
}

debugAllCreatePages();
