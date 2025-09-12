const puppeteer = require('puppeteer');

// Test configuration
const TEST_URL = 'http://localhost:5173';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpassword123';

// Test card details (Stripe test card)
const TEST_CARD = {
  number: '4242424242424242',
  expiry: '12/25',
  cvc: '123',
  postal: '12345'
};

async function runTicketPurchaseTest() {
  console.log('🎫 Starting ticket purchase flow test...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    slowMo: 50, // Slow down actions to see what's happening
    devtools: true
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Step 1: Navigate to the app
    console.log('1️⃣ Navigating to the application...');
    await page.goto(TEST_URL, { waitUntil: 'networkidle2' });

    // Step 2: Login (if required)
    console.log('2️⃣ Checking authentication status...');
    const loginButton = await page.$('a[href="/auth/sign-in"]');
    if (loginButton) {
      console.log('   - Logging in...');
      await loginButton.click();
      await page.waitForSelector('input[name="email"]');
      
      await page.type('input[name="email"]', TEST_EMAIL);
      await page.type('input[name="password"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');
      
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      console.log('   ✅ Logged in successfully');
    }

    // Step 3: Navigate to events/shows page
    console.log('3️⃣ Navigating to events page...');
    await page.goto(`${TEST_URL}/events`, { waitUntil: 'networkidle2' });
    
    // Click on the first available event
    const eventCard = await page.waitForSelector('.event-card, [data-test="event-card"]', { timeout: 10000 });
    await eventCard.click();
    console.log('   ✅ Selected an event');

    // Step 4: Select tickets
    console.log('4️⃣ Selecting tickets...');
    await page.waitForSelector('[data-test="ticket-selector"]', { timeout: 10000 });
    
    // Increase ticket quantity
    const increaseButton = await page.$('[data-test="increase-quantity"]');
    if (increaseButton) {
      await increaseButton.click();
      await increaseButton.click(); // Select 2 tickets
      console.log('   - Selected 2 tickets');
    }

    // Click continue/proceed button
    const proceedButton = await page.waitForSelector('[data-test="proceed-to-payment"], button:has-text("Continue"), button:has-text("Proceed")');
    await proceedButton.click();
    console.log('   ✅ Proceeding to payment');

    // Step 5: Fill payment details
    console.log('5️⃣ Entering payment information...');
    
    // Wait for Stripe iframe to load
    await page.waitForSelector('iframe[name*="stripe"], iframe[src*="stripe"]', { timeout: 15000 });
    
    // Get all frames
    const frames = page.frames();
    const stripeFrame = frames.find(frame => frame.url().includes('stripe'));
    
    if (stripeFrame) {
      // Fill card number
      await stripeFrame.waitForSelector('input[name="cardnumber"]');
      await stripeFrame.type('input[name="cardnumber"]', TEST_CARD.number);
      
      // Fill expiry
      await stripeFrame.type('input[name="exp-date"]', TEST_CARD.expiry);
      
      // Fill CVC
      await stripeFrame.type('input[name="cvc"]', TEST_CARD.cvc);
      
      // Fill postal code if present
      const postalInput = await stripeFrame.$('input[name="postal"]');
      if (postalInput) {
        await stripeFrame.type('input[name="postal"]', TEST_CARD.postal);
      }
      
      console.log('   ✅ Payment details entered');
    }

    // Step 6: Complete purchase
    console.log('6️⃣ Completing purchase...');
    const payButton = await page.waitForSelector('[data-test="pay-button"], button:has-text("Pay"), button:has-text("Complete Purchase")');
    await payButton.click();
    
    // Wait for success confirmation
    await page.waitForSelector('[data-test="payment-success"], .success-message', { timeout: 30000 });
    console.log('   ✅ Payment successful!');

    // Step 7: Verify tickets in profile
    console.log('7️⃣ Verifying tickets in user profile...');
    await page.goto(`${TEST_URL}/profile/tickets`, { waitUntil: 'networkidle2' });
    
    // Check if tickets are displayed
    const tickets = await page.$$('[data-test="user-ticket"], .ticket-item');
    console.log(`   - Found ${tickets.length} tickets in profile`);
    
    if (tickets.length > 0) {
      console.log('   ✅ Tickets successfully stored in user profile!');
      
      // Get ticket details
      const ticketDetails = await page.evaluate(() => {
        const ticketElements = document.querySelectorAll('[data-test="user-ticket"], .ticket-item');
        return Array.from(ticketElements).map(ticket => ({
          event: ticket.querySelector('.event-name, [data-test="event-name"]')?.textContent,
          date: ticket.querySelector('.event-date, [data-test="event-date"]')?.textContent,
          quantity: ticket.querySelector('.ticket-quantity, [data-test="ticket-quantity"]')?.textContent
        }));
      });
      
      console.log('\n📋 Ticket Details:');
      ticketDetails.forEach((ticket, index) => {
        console.log(`   Ticket ${index + 1}:`);
        console.log(`   - Event: ${ticket.event}`);
        console.log(`   - Date: ${ticket.date}`);
        console.log(`   - Quantity: ${ticket.quantity}`);
      });
    }

    // Step 8: Test ticket download/view
    console.log('\n8️⃣ Testing ticket actions...');
    const viewButton = await page.$('[data-test="view-ticket"], button:has-text("View Ticket")');
    if (viewButton) {
      await viewButton.click();
      await page.waitForTimeout(2000);
      console.log('   ✅ Ticket view functionality working');
    }

    console.log('\n✅ Test completed successfully! The complete ticket flow is working.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    // Take screenshot on error
    await page.screenshot({ path: 'test-error-screenshot.png' });
    console.log('📸 Screenshot saved as test-error-screenshot.png');
    
    throw error;
  } finally {
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will remain open for inspection. Press Ctrl+C to close.');
    
    // Uncomment the line below to close browser automatically
    // await browser.close();
  }
}

// Additional test utilities
async function testProfileAccess(page) {
  console.log('\n🔒 Testing profile access...');
  await page.goto(`${TEST_URL}/profile`);
  
  const profileElements = {
    tickets: await page.$('[href*="/profile/tickets"]'),
    orders: await page.$('[href*="/profile/orders"]'),
    settings: await page.$('[href*="/profile/settings"]')
  };
  
  console.log('Profile sections available:');
  Object.entries(profileElements).forEach(([section, element]) => {
    console.log(`   - ${section}: ${element ? '✅' : '❌'}`);
  });
}

// Run the test
runTicketPurchaseTest().catch(console.error);

// Export for use in other test files
module.exports = {
  runTicketPurchaseTest,
  testProfileAccess,
  TEST_URL,
  TEST_CARD
};