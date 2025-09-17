const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Configuration
const RAILWAY_APP_URL = 'https://when-the-fun-production.up.railway.app';

async function testCacheBust() {
  console.log('Testing cache busting strategies...');
  console.log('='.repeat(50));
  
  // Test URLs
  const testUrls = [
    '/community/magic-patterns-tech-talks',
    '/community/bayarea-ai-sports-adventures'
  ];
  
  for (const path of testUrls) {
    console.log(`\nTesting ${path} with various cache-busting methods:`);
    console.log('-'.repeat(50));
    
    // Method 1: Timestamp query parameter
    const timestamp = Date.now();
    await testWithCacheBuster(`${path}?_t=${timestamp}`, 'Timestamp Cache Buster');
    
    // Method 2: Random string query parameter
    const random = Math.random().toString(36).substring(7);
    await testWithCacheBuster(`${path}?_r=${random}`, 'Random Cache Buster');
    
    // Method 3: Version parameter
    await testWithCacheBuster(`${path}?v=2.0.${Date.now()}`, 'Version Cache Buster');
    
    // Method 4: Multiple cache busters
    await testWithCacheBuster(`${path}?_t=${timestamp}&_r=${random}&force=true`, 'Multiple Cache Busters');
    
    // Method 5: Try with curl to bypass any browser caching
    await testWithCurl(path);
  }
  
  // Check Railway deployment status
  await checkRailwayDeploymentStatus();
}

async function testWithCacheBuster(path, method) {
  return new Promise((resolve) => {
    const url = `${RAILWAY_APP_URL}${path}`;
    console.log(`\n${method}:`);
    console.log(`URL: ${url}`);
    
    https.get(url, {
      headers: {
        'User-Agent': 'CacheBuster/1.0',
        'Accept': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'If-None-Match': '"invalid-etag"',
        'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT'
      }
    }, (res) => {
      let data = '';
      
      console.log(`Status: ${res.statusCode}`);
      console.log(`Cache headers: ${res.headers['cache-control']}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const hasNewUI = data.includes('Magic Patterns') || 
                         data.includes('threads') || 
                         data.includes('guidelines') ||
                         data.includes('Thread Title');
        const hasOldUI = data.includes('Community Not Found');
        
        console.log(`Has new Magic Patterns UI: ${hasNewUI}`);
        console.log(`Has old error message: ${hasOldUI}`);
        
        // Check for deployment markers
        const timestampMatch = data.match(/<!-- Deployment: ([^>]+) -->/);
        if (timestampMatch) {
          console.log(`Deployment marker: ${timestampMatch[1]}`);
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.log(`Error: ${err.message}`);
      resolve();
    });
  });
}

async function testWithCurl(path) {
  console.log(`\nTesting with curl (bypasses all browser caching):`);
  
  try {
    const url = `${RAILWAY_APP_URL}${path}`;
    const { stdout } = await execAsync(`curl -s -H "Cache-Control: no-cache" "${url}" | head -n 50`);
    
    const hasNewUI = stdout.includes('Magic Patterns') || stdout.includes('thread');
    const hasOldUI = stdout.includes('Community Not Found');
    
    console.log(`Curl test - Has new UI: ${hasNewUI}`);
    console.log(`Curl test - Has old UI: ${hasOldUI}`);
  } catch (error) {
    console.log(`Curl test failed: ${error.message}`);
  }
}

async function checkRailwayDeploymentStatus() {
  console.log(`\n${'='.repeat(50)}`);
  console.log('Checking Railway deployment status...');
  
  // Check the main page to see what version is deployed
  return new Promise((resolve) => {
    https.get(RAILWAY_APP_URL, {
      headers: {
        'User-Agent': 'DeploymentChecker/1.0'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Look for any deployment identifiers
        console.log(`Main page status: ${res.statusCode}`);
        
        // Check for Railway deployment ID in headers or content
        if (res.headers['x-railway-deployment-id']) {
          console.log(`Railway Deployment ID: ${res.headers['x-railway-deployment-id']}`);
        }
        
        // Look for version info in the HTML
        const versionMatch = data.match(/data-version="([^"]+)"/);
        if (versionMatch) {
          console.log(`App Version: ${versionMatch[1]}`);
        }
        
        // Check for build timestamp
        const buildMatch = data.match(/<!-- Built: ([^>]+) -->/);
        if (buildMatch) {
          console.log(`Build Time: ${buildMatch[1]}`);
        }
        
        console.log('\nSuggestions:');
        console.log('1. Check Railway dashboard for deployment status');
        console.log('2. Try forcing a new deployment with: railway up --force');
        console.log('3. Check if CDN/Cloudflare is caching old content');
        console.log('4. Verify the correct branch is deployed');
        
        resolve();
      });
    }).on('error', (err) => {
      console.log(`Error checking deployment: ${err.message}`);
      resolve();
    });
  });
}

// Run the cache bust tests
testCacheBust().catch(console.error);
