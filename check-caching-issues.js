const https = require('https');

// Configuration
const RAILWAY_APP_URL = 'https://when-the-fun-production.up.railway.app';

async function checkCachingIssues() {
  console.log('Checking for caching issues...');
  console.log('='.repeat(50));
  
  // Test community pages with different cache-busting strategies
  const testPaths = [
    '/community/magic-patterns-tech-talks',
    '/community/bayarea-ai-sports-adventures'
  ];
  
  for (const path of testPaths) {
    console.log(`\nTesting: ${path}`);
    console.log('-'.repeat(40));
    
    // Test 1: Normal request
    await makeRequest(path, 'Normal Request');
    
    // Test 2: With cache buster query param
    const cacheBuster = Date.now();
    await makeRequest(`${path}?cb=${cacheBuster}`, 'With Cache Buster');
    
    // Test 3: With no-cache headers
    await makeRequest(path, 'With No-Cache Headers', {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    });
    
    // Test 4: Check if Railway CDN is caching
    await checkCDNCaching(path);
  }
}

async function makeRequest(path, testName, additionalHeaders = {}) {
  return new Promise((resolve) => {
    const url = `${RAILWAY_APP_URL}${path}`;
    console.log(`\n${testName}:`);
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CacheChecker/1.0)',
        'Accept': 'text/html',
        ...additionalHeaders
      }
    }, (res) => {
      let data = '';
      
      // Check response headers
      console.log(`Status: ${res.statusCode}`);
      console.log(`Cache-Control: ${res.headers['cache-control']}`);
      console.log(`CF-Cache-Status: ${res.headers['cf-cache-status']}`);
      console.log(`X-Cache: ${res.headers['x-cache']}`);
      console.log(`Age: ${res.headers['age']}`);
      console.log(`Last-Modified: ${res.headers['last-modified']}`);
      console.log(`ETag: ${res.headers['etag']}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Check content
        const hasOldContent = data.includes('Community Not Found');
        const hasNewContent = data.includes('Magic Patterns') || 
                              data.includes('threads') || 
                              data.includes('guidelines');
        
        console.log(`Has old content: ${hasOldContent}`);
        console.log(`Has new content: ${hasNewContent}`);
        console.log(`Content length: ${data.length}`);
        
        // Look for deployment identifiers
        const deploymentMatch = data.match(/deployment-id['"]:?\s*['"]([^'"]+)['"]/i);
        if (deploymentMatch) {
          console.log(`Deployment ID: ${deploymentMatch[1]}`);
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.log(`Error: ${err.message}`);
      resolve();
    });
  });
}

async function checkCDNCaching(path) {
  console.log(`\nCDN Cache Test for ${path}:`);
  
  // Make two requests in quick succession
  const results = [];
  
  for (let i = 0; i < 2; i++) {
    const startTime = Date.now();
    await new Promise((resolve) => {
      https.get(`${RAILWAY_APP_URL}${path}`, {
        headers: {
          'User-Agent': `CacheTest-${i}`,
        }
      }, (res) => {
        const responseTime = Date.now() - startTime;
        results.push({
          attempt: i + 1,
          status: res.statusCode,
          cacheStatus: res.headers['cf-cache-status'],
          age: res.headers['age'],
          responseTime
        });
        
        res.on('data', () => {});
        res.on('end', resolve);
      }).on('error', resolve);
    });
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('CDN Cache Results:', results);
  
  // Check if second request was faster (likely cached)
  if (results.length === 2) {
    const timeDiff = results[0].responseTime - results[1].responseTime;
    if (timeDiff > 50) {
      console.log('⚠️  Second request was faster - possible CDN caching');
    } else {
      console.log('✓ Similar response times - likely no CDN caching');
    }
  }
}

// Run the checks
checkCachingIssues().catch(console.error);
