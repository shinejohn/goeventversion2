const puppeteer = require('puppeteer');
const fs = require('fs');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:5174';

// Test results
const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  tests: [],
  summary: { total: 0, passed: 0, failed: 0, errors: [] }
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function addTestResult(name, status, details = {}) {
  testResults.tests.push({ name, status, details, timestamp: new Date().toISOString() });
  testResults.summary.total++;
  if (status === 'passed') testResults.summary.passed++;
  else if (status === 'failed') testResults.summary.failed++;
}

async function testPageData(page, url, expectedDataTypes = []) {
  try {
    log(`Testing data presentation on ${url}`);
    
    const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
    
    if (!response || response.status() !== 200) {
      addTestResult(`Data Test - ${url}`, 'failed', { error: `HTTP ${response?.status() || 'No response'}` });
      return false;
    }

    // Check for actual data content
    const dataChecks = {
      hasEventCards: await page.$$eval('.event-card, [data-test*="event"], .event-item', els => els.length > 0),
      hasVenueCards: await page.$$eval('.venue-card, [data-test*="venue"], .venue-item', els => els.length > 0),
      hasPerformerCards: await page.$$eval('.performer-card, [data-test*="performer"], .performer-item', els => els.length > 0),
      hasCommunityCards: await page.$$eval('.community-card, [data-test*="community"], .community-item', els => els.length > 0),
      hasCalendarCards: await page.$$eval('.calendar-card, [data-test*="calendar"], .calendar-item', els => els.length > 0),
      hasTicketCards: await page.$$eval('.ticket-card, [data-test*="ticket"], .ticket-item', els => els.length > 0),
      hasShopItems: await page.$$eval('.product-card, [data-test*="product"], .shop-item', els => els.length > 0),
      hasFormInputs: await page.$$eval('input, textarea, select', els => els.length > 0),
      hasClickableButtons: await page.$$eval('button, [role="button"], .btn', els => els.length > 0),
      hasLinks: await page.$$eval('a[href]', els => els.length > 0),
      hasImages: await page.$$eval('img[src]', els => els.length > 0),
      hasTextContent: await page.evaluate(() => document.body.innerText.length > 100)
    };

    // Check for specific content patterns
    const contentChecks = {
      hasEventTitles: await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        return text.includes('event') || text.includes('concert') || text.includes('show') || text.includes('festival');
      }),
      hasVenueNames: await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        return text.includes('venue') || text.includes('theater') || text.includes('hall') || text.includes('center');
      }),
      hasPerformerNames: await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        return text.includes('performer') || text.includes('artist') || text.includes('band') || text.includes('musician');
      }),
      hasPricing: await page.evaluate(() => {
        const text = document.body.innerText;
        return /\$[\d,]+/.test(text) || text.includes('free') || text.includes('price');
      }),
      hasDates: await page.evaluate(() => {
        const text = document.body.innerText;
        return /\d{1,2}\/\d{1,2}\/\d{4}/.test(text) || /\d{4}-\d{2}-\d{2}/.test(text) || text.includes('today') || text.includes('tomorrow');
      }),
      hasLocations: await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        return text.includes('location') || text.includes('address') || text.includes('city') || text.includes('state');
      })
    };

    // Check for error states
    const errorChecks = {
      hasErrorMessages: await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        return text.includes('error') || text.includes('not found') || text.includes('failed') || text.includes('loading');
      }),
      hasEmptyStates: await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        return text.includes('no results') || text.includes('no data') || text.includes('coming soon') || text.includes('no events');
      }),
      hasLoadingStates: await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        return text.includes('loading') || text.includes('please wait') || text.includes('fetching');
      })
    };

    const allChecks = { ...dataChecks, ...contentChecks, ...errorChecks };
    
    // Determine if page has meaningful data
    const hasData = dataChecks.hasEventCards || dataChecks.hasVenueCards || dataChecks.hasPerformerCards || 
                   dataChecks.hasCommunityCards || dataChecks.hasCalendarCards || dataChecks.hasTicketCards || 
                   dataChecks.hasShopItems || contentChecks.hasEventTitles || contentChecks.hasVenueNames || 
                   contentChecks.hasPerformerNames;

    const hasErrors = errorChecks.hasErrorMessages;
    const hasEmptyState = errorChecks.hasEmptyStates;

    let status = 'passed';
    let details = { ...allChecks, hasData, hasErrors, hasEmptyState };

    if (hasErrors) {
      status = 'failed';
      details.error = 'Page contains error messages';
    } else if (!hasData && !hasEmptyState) {
      status = 'failed';
      details.error = 'No meaningful data found on page';
    } else if (hasEmptyState) {
      status = 'warning';
      details.warning = 'Page shows empty state (may be expected)';
    }

    addTestResult(`Data Test - ${url}`, status, details);
    return status === 'passed';

  } catch (error) {
    log(`Error testing ${url}: ${error.message}`, 'error');
    addTestResult(`Data Test - ${url}`, 'failed', { error: error.message });
    return false;
  }
}

async function testButtonFunctionality(page, url) {
  try {
    log(`Testing button functionality on ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Test form submissions
    const forms = await page.$$('form');
    let formTestResults = [];
    
    for (let i = 0; i < Math.min(forms.length, 3); i++) {
      try {
        // Check if form has required fields
        const requiredFields = await page.$$eval(`form:nth-of-type(${i + 1}) input[required], form:nth-of-type(${i + 1}) textarea[required], form:nth-of-type(${i + 1}) select[required]`, els => els.length);
        
        if (requiredFields > 0) {
          // Try to fill out the form
          const inputs = await page.$$(`form:nth-of-type(${i + 1}) input, form:nth-of-type(${i + 1}) textarea, form:nth-of-type(${i + 1}) select`);
          
          for (let j = 0; j < Math.min(inputs.length, 5); j++) {
            const inputType = await page.evaluate(el => el.type, inputs[j]);
            const inputName = await page.evaluate(el => el.name, inputs[j]);
            
            if (inputType === 'text' || inputType === 'email') {
              await inputs[j].type(`test-${inputName || 'value'}`);
            } else if (inputType === 'password') {
              await inputs[j].type('TestPassword123!');
            } else if (inputType === 'number') {
              await inputs[j].type('123');
            }
          }
          
          // Try to submit the form
          const submitButton = await page.$(`form:nth-of-type(${i + 1}) button[type="submit"], form:nth-of-type(${i + 1}) input[type="submit"]`);
          if (submitButton) {
            await submitButton.click();
            await page.waitForTimeout(1000); // Wait for potential navigation
            formTestResults.push({ formIndex: i, submitted: true });
          }
        }
      } catch (error) {
        formTestResults.push({ formIndex: i, error: error.message });
      }
    }

    // Test navigation buttons
    const navButtons = await page.$$('button, [role="button"], .btn');
    let navTestResults = [];
    
    for (let i = 0; i < Math.min(navButtons.length, 10); i++) {
      try {
        const buttonText = await page.evaluate(el => el.textContent?.trim(), navButtons[i]);
        const isDisabled = await page.evaluate(el => el.disabled, navButtons[i]);
        
        if (!isDisabled && buttonText && buttonText.length > 0) {
          await navButtons[i].click();
          await page.waitForTimeout(500);
          navTestResults.push({ buttonIndex: i, text: buttonText, clicked: true });
        }
      } catch (error) {
        navTestResults.push({ buttonIndex: i, error: error.message });
      }
    }

    // Test links
    const links = await page.$$('a[href]');
    let linkTestResults = [];
    
    for (let i = 0; i < Math.min(links.length, 10); i++) {
      try {
        const href = await page.evaluate(el => el.href, links[i]);
        const linkText = await page.evaluate(el => el.textContent?.trim(), links[i]);
        
        if (href && !href.includes('javascript:') && !href.includes('#')) {
          await links[i].click();
          await page.waitForTimeout(500);
          linkTestResults.push({ linkIndex: i, href, text: linkText, clicked: true });
        }
      } catch (error) {
        linkTestResults.push({ linkIndex: i, error: error.message });
      }
    }

    const hasFormIssues = formTestResults.some(r => r.error);
    const hasNavIssues = navTestResults.some(r => r.error);
    const hasLinkIssues = linkTestResults.some(r => r.error);

    let status = 'passed';
    if (hasFormIssues || hasNavIssues || hasLinkIssues) {
      status = 'warning';
    }

    addTestResult(`Functionality Test - ${url}`, status, {
      forms: formTestResults,
      navigation: navTestResults,
      links: linkTestResults,
      hasFormIssues,
      hasNavIssues,
      hasLinkIssues
    });

    return status === 'passed';

  } catch (error) {
    log(`Error testing functionality on ${url}: ${error.message}`, 'error');
    addTestResult(`Functionality Test - ${url}`, 'failed', { error: error.message });
    return false;
  }
}

async function runDetailedTests() {
  log('🔍 Starting Detailed Verification Tests');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Test key pages for data presentation
  const testPages = [
    { url: `${BASE_URL}/`, name: 'Homepage' },
    { url: `${BASE_URL}/events`, name: 'Events' },
    { url: `${BASE_URL}/venues`, name: 'Venues' },
    { url: `${BASE_URL}/performers`, name: 'Performers' },
    { url: `${BASE_URL}/communities`, name: 'Communities' },
    { url: `${BASE_URL}/calendars`, name: 'Calendars' },
    { url: `${BASE_URL}/tickets`, name: 'Tickets' },
    { url: `${BASE_URL}/shop`, name: 'Shop' },
    { url: `${BASE_URL}/book-it`, name: 'Book It' },
    { url: `${BASE_URL}/events/1`, name: 'Event Detail' },
    { url: `${BASE_URL}/venues/1`, name: 'Venue Detail' },
    { url: `${BASE_URL}/performers/1`, name: 'Performer Detail' },
    { url: `${BASE_URL}/c/jazz-lovers`, name: 'Community Detail' },
    { url: `${BASE_URL}/calendars/jazz-events`, name: 'Calendar Detail' }
  ];

  for (const testPage of testPages) {
    await testPageData(page, testPage.url);
    await testButtonFunctionality(page, testPage.url);
  }

  await browser.close();

  // Generate report
  const reportFile = `detailed-verification-report-${Date.now()}.json`;
  fs.writeFileSync(reportFile, JSON.stringify(testResults, null, 2));
  
  log(`📊 Detailed Test Summary:`);
  log(`Total Tests: ${testResults.summary.total}`);
  log(`Passed: ${testResults.summary.passed}`);
  log(`Failed: ${testResults.summary.failed}`);
  log(`Report saved to: ${reportFile}`);

  // Show detailed results
  testResults.tests.forEach(test => {
    const status = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⚠️';
    log(`${status} ${test.name} - ${test.status.toUpperCase()}`);
    
    if (test.details.error) {
      log(`   Error: ${test.details.error}`, 'error');
    }
    if (test.details.warning) {
      log(`   Warning: ${test.details.warning}`, 'warning');
    }
    if (test.details.hasData !== undefined) {
      log(`   Has Data: ${test.details.hasData ? 'Yes' : 'No'}`);
    }
    if (test.details.hasErrors) {
      log(`   Has Errors: ${test.details.hasErrors ? 'Yes' : 'No'}`);
    }
  });
}

runDetailedTests().catch(console.error);
