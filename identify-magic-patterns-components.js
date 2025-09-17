const fs = require('fs').promises;
const path = require('path');

async function identifyMagicPatternsComponents() {
  console.log('Magic Patterns Component Inventory');
  console.log('=================================\n');
  
  const componentsPath = path.join(__dirname, 'apps/web/app/components/magic-patterns');
  const routesPath = path.join(__dirname, 'apps/web/app/routes');
  
  const results = {
    components: [],
    routes: [],
    implementations: []
  };
  
  // 1. Check what Magic Patterns components exist
  console.log('1. Checking Magic Patterns components directory...');
  try {
    const files = await fs.readdir(componentsPath);
    console.log(`Found ${files.length} items in magic-patterns directory:`);
    
    for (const file of files) {
      const filePath = path.join(componentsPath, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isDirectory()) {
        console.log(`  📁 ${file}/`);
        results.components.push({ name: file, type: 'directory' });
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        console.log(`  📄 ${file}`);
        results.components.push({ name: file, type: 'file' });
      }
    }
  } catch (error) {
    console.log('  ❌ Error:', error.message);
  }
  
  // 2. Check which routes are using Magic Patterns
  console.log('\n2. Scanning routes for Magic Patterns usage...');
  await scanDirectory(routesPath, async (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      const content = await fs.readFile(filePath, 'utf8');
      if (content.includes('magic-patterns') || content.includes('Magic Patterns')) {
        const relativePath = path.relative(routesPath, filePath);
        console.log(`  ✅ ${relativePath}`);
        results.implementations.push(relativePath);
      }
    }
  });
  
  // 3. Check specific known Magic Patterns features
  console.log('\n3. Checking for specific Magic Patterns features...');
  const knownFeatures = [
    'EventCard',
    'VenueCard', 
    'PerformerCard',
    'CommunityHub',
    'CalendarView',
    'ShopProduct',
    'TicketCard',
    'BookingWizard'
  ];
  
  for (const feature of knownFeatures) {
    const exists = await checkFeatureExists(componentsPath, feature);
    console.log(`  ${exists ? '✅' : '❌'} ${feature}`);
  }
  
  // 4. Summary
  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY:');
  console.log('='.repeat(50));
  console.log(`Components found: ${results.components.length}`);
  console.log(`Routes using Magic Patterns: ${results.implementations.length}`);
  
  // 5. Recommendations
  console.log('\nRECOMMENDATIONS:');
  console.log('1. Start with components that already exist');
  console.log('2. Create missing components using Magic Patterns design');
  console.log('3. Test each component in isolation first');
  console.log('4. Integrate incrementally into routes');
  
  return results;
}

async function scanDirectory(dir, callback) {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
        await scanDirectory(filePath, callback);
      } else {
        await callback(filePath);
      }
    }
  } catch (error) {
    // Ignore errors
  }
}

async function checkFeatureExists(componentsPath, feature) {
  try {
    // Check for directory
    await fs.access(path.join(componentsPath, feature));
    return true;
  } catch {
    try {
      // Check for file
      await fs.access(path.join(componentsPath, `${feature}.tsx`));
      return true;
    } catch {
      return false;
    }
  }
}

// Run the inventory
identifyMagicPatternsComponents().catch(console.error);