const puppeteer = require('puppeteer');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:5174';
const RAILWAY_URL = 'https://goeventversion2-production.up.railway.app';

// Test results
const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  railwayUrl: RAILWAY_URL,
  tests: [],
  summary: { total: 0, passed: 0, failed: 0, errors: [] }
};

async function testShopPage(browser, url, label) {
  const page = await browser.newPage();
  const test = {
    name: `Shop Page - ${label}`,
    url: `${url}/shop`,
    status: 'pending',
    details: {}
  };

  try {
    console.log(`Testing ${test.name}...`);
    
    // Navigate to shop page
    await page.goto(`${url}/shop`, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Check page title
    const title = await page.title();
    test.details.title = title;
    test.details.isFanShop = title.includes('Fan Shop') || title.includes('Merchandise');
    
    // Check for fan merchandise content
    const heroTitle = await page.$eval('h1', el => el.textContent).catch(() => 'Not found');
    test.details.heroTitle = heroTitle;
    test.details.isFanMerchandise = heroTitle.includes('Fan Shop') || heroTitle.includes('merchandise');
    
    // Check for merchandise categories
    const categories = await page.$$eval('a[href*="category"] span', els => els.map(el => el.textContent)).catch(() => []);
    test.details.categories = categories;
    test.details.hasMerchandiseCategories = categories.some(cat => 
      cat.includes('T-Shirt') || cat.includes('Hoodie') || cat.includes('Hat') || cat.includes('Sticker')
    );
    
    // Check for products
    const productCount = await page.$eval('span:contains("products")', el => {
      const text = el.textContent;
      const match = text.match(/(\d+)\s*products/);
      return match ? parseInt(match[1]) : 0;
    }).catch(() => 0);
    test.details.productCount = productCount;
    
    // Check for merchandise products
    const productNames = await page.$$eval('[data-test*="product"], .product-card h3, .product h3', els => 
      els.map(el => el.textContent)
    ).catch(() => []);
    test.details.productNames = productNames;
    test.details.hasMerchandiseProducts = productNames.some(name => 
      name.includes('T-Shirt') || name.includes('Hoodie') || name.includes('Cap') || name.includes('Sticker')
    );
    
    // Overall assessment
    const isWorking = test.details.isFanShop || test.details.isFanMerchandise || test.details.hasMerchandiseCategories;
    test.status = isWorking ? 'passed' : 'failed';
    
    if (!isWorking) {
      test.details.issues = [
        'Not showing fan merchandise content',
        'Still showing equipment categories',
        'Missing merchandise products'
      ];
    }
    
  } catch (error) {
    test.status = 'failed';
    test.details.error = error.message;
  } finally {
    await page.close();
  }
  
  return test;
}

async function runTests() {
  console.log('🚀 Starting Shop Fan Merchandise Tests...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Test local development
    testResults.tests.push(await testShopPage(browser, BASE_URL, 'Local Development'));
    
    // Test Railway production
    testResults.tests.push(await testShopPage(browser, RAILWAY_URL, 'Railway Production'));
    
  } catch (error) {
    console.error('Test execution error:', error);
    testResults.summary.errors.push(error.message);
  } finally {
    await browser.close();
  }
  
  // Calculate summary
  testResults.summary.total = testResults.tests.length;
  testResults.summary.passed = testResults.tests.filter(t => t.status === 'passed').length;
  testResults.summary.failed = testResults.tests.filter(t => t.status === 'failed').length;
  
  // Display results
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`✅ Passed: ${testResults.summary.passed}`);
  console.log(`❌ Failed: ${testResults.summary.failed}`);
  console.log(`⚠️  Errors: ${testResults.summary.errors.length}`);
  
  console.log('\n📋 DETAILED RESULTS');
  console.log('===================');
  
  testResults.tests.forEach((test, index) => {
    console.log(`\n${index + 1}. ${test.name}`);
    console.log(`   URL: ${test.url}`);
    console.log(`   Status: ${test.status === 'passed' ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`   Title: ${test.details.title || 'N/A'}`);
    console.log(`   Hero Title: ${test.details.heroTitle || 'N/A'}`);
    console.log(`   Categories: ${test.details.categories?.join(', ') || 'N/A'}`);
    console.log(`   Product Count: ${test.details.productCount || 0}`);
    console.log(`   Product Names: ${test.details.productNames?.join(', ') || 'N/A'}`);
    
    if (test.details.issues) {
      console.log(`   Issues: ${test.details.issues.join(', ')}`);
    }
    
    if (test.details.error) {
      console.log(`   Error: ${test.details.error}`);
    }
  });
  
  // Save results
  const filename = `shop-test-report-${Date.now()}.json`;
  require('fs').writeFileSync(filename, JSON.stringify(testResults, null, 2));
  console.log(`\n💾 Results saved to: ${filename}`);
  
  return testResults;
}

// Run tests
runTests().then(results => {
  process.exit(results.summary.failed > 0 ? 1 : 0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
