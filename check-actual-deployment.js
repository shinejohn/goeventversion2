const https = require('https');
const http = require('http');

// Check what's actually deployed at your URLs
const urls = [
  'https://when-the-fun-production.up.railway.app',
  'https://when-the-fun-production.up.railway.app/community/magic-patterns-tech-talks',
  'https://when-the-fun-production.up.railway.app/community/bayarea-ai-sports-adventures',
  'https://when-the-fun-production.up.railway.app/community/bayareahikingcycling'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    console.log(`\nChecking: ${url}`);
    console.log('='.repeat(50));
    
    protocol.get(url, { 
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DeploymentChecker/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }, (res) => {
      let data = '';
      
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Check for key UI elements
        const hasThreads = data.includes('Thread Title') || data.includes('thread-title');
        const hasStats = data.includes('Members') && data.includes('Threads');
        const hasGuidelines = data.includes('Community Guidelines') || data.includes('guidelines');
        const hasMagicPatterns = data.includes('Magic Patterns') || data.includes('magic-patterns');
        
        // Check for error messages
        const has404 = data.includes('404') || data.includes('not found');
        const hasError = data.includes('error') || data.includes('Error');
        
        // Extract title
        const titleMatch = data.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'No title found';
        
        console.log(`\nPage Title: ${title}`);
        console.log(`Has Threads UI: ${hasThreads}`);
        console.log(`Has Stats: ${hasStats}`);
        console.log(`Has Guidelines: ${hasGuidelines}`);
        console.log(`Has Magic Patterns UI: ${hasMagicPatterns}`);
        console.log(`Has 404: ${has404}`);
        console.log(`Has Error: ${hasError}`);
        
        // Check content length
        console.log(`Content Length: ${data.length} bytes`);
        
        // Show first 500 chars of body content
        const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          const bodyContent = bodyMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 500);
          console.log(`\nBody Preview: ${bodyContent}...`);
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.log(`Error: ${err.message}`);
      resolve();
    });
  });
}

async function main() {
  console.log('Checking actual deployment status...');
  console.log('Time:', new Date().toISOString());
  
  for (const url of urls) {
    await checkUrl(url);
  }
}

main();
