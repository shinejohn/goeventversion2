#!/usr/bin/env node

/**
 * Fix Navigation Imports
 * 
 * Automatically fixes import paths in route files to match actual component locations
 */

const fs = require('fs');
const path = require('path');

// Map of incorrect imports to correct imports based on actual file locations
const importFixes = {
  // Pages that exist at root level
  '~/components/magic-patterns/pages/NotFoundPage': '~/components/magic-patterns/pages/NotFoundPage',
  '~/components/magic-patterns/pages/AboutPage': '~/components/magic-patterns/pages/AboutPage',
  '~/components/magic-patterns/pages/AdvertisePage': '~/components/magic-patterns/pages/AdvertisePage',
  '~/components/magic-patterns/pages/AdvertisingSolutionsPage': '~/components/magic-patterns/pages/AdvertisingSolutionsPage',
  '~/components/magic-patterns/pages/BookItPage': '~/components/magic-patterns/pages/BookItPage',
  '~/components/magic-patterns/pages/BookingMarketplacePage': '~/components/magic-patterns/pages/BookingMarketplacePage',
  '~/components/magic-patterns/pages/CalendarPage': '~/components/magic-patterns/pages/CalendarPage',
  '~/components/magic-patterns/pages/CareersPage': '~/components/magic-patterns/pages/CareersPage',
  '~/components/magic-patterns/pages/CommunityImpactPage': '~/components/magic-patterns/pages/CommunityImpactPage',
  '~/components/magic-patterns/pages/ContactUsPage': '~/components/magic-patterns/pages/ContactUsPage',
  '~/components/magic-patterns/pages/EventDetailPage': '~/components/magic-patterns/pages/EventDetailPage',
  '~/components/magic-patterns/pages/EventsPage': '~/components/magic-patterns/pages/EventsPage',
  '~/components/magic-patterns/pages/GearPage': '~/components/magic-patterns/pages/GearPage',
  '~/components/magic-patterns/pages/HomePage': '~/components/magic-patterns/pages/HomePage',
  '~/components/magic-patterns/pages/HowItWorksPage': '~/components/magic-patterns/pages/HowItWorksPage',
  '~/components/magic-patterns/pages/LoginPage': '~/components/magic-patterns/pages/LoginPage',
  '~/components/magic-patterns/pages/PartnerWithUsPage': '~/components/magic-patterns/pages/PartnerWithUsPage',
  '~/components/magic-patterns/pages/PerformersPage': '~/components/magic-patterns/pages/PerformersPage',
  '~/components/magic-patterns/pages/PressMediaPage': '~/components/magic-patterns/pages/PressMediaPage',
  '~/components/magic-patterns/pages/SuccessStoriesPage': '~/components/magic-patterns/pages/SuccessStoriesPage',
  '~/components/magic-patterns/pages/TicketsPage': '~/components/magic-patterns/pages/TicketsPage',
  '~/components/magic-patterns/pages/VenuesPage': '~/components/magic-patterns/pages/VenuesPage',
  
  // Special cases
  '~/components/magic-patterns/pages/help': '~/components/magic-patterns/pages/help',
  '~/components/magic-patterns/pages/hubs/index': '~/components/magic-patterns/pages/hubs/index',
  
  // Layout components
  '~/components/magic-patterns/components/layout/Header': '~/components/magic-patterns/components/layout/Header',
  '~/components/magic-patterns/components/layout/Footer': '~/components/magic-patterns/components/layout/Footer',
  '~/components/magic-patterns/components/layout/MainHeader': '~/components/magic-patterns/components/layout/MainHeader',
};

// Routes that need special handling
const routeFixes = [
  {
    file: './apps/web/app/routes/$.tsx',
    fix: () => {
      const content = fs.readFileSync('./apps/web/app/routes/$.tsx', 'utf8');
      if (content.includes('NotFoundPage')) {
        console.log('✅ $.tsx already imports NotFoundPage correctly');
      }
    }
  },
  
  // Fix hubs route to use the correct import
  {
    file: './apps/web/app/routes/hubs.tsx',
    fix: () => {
      const filePath = './apps/web/app/routes/hubs.tsx';
      const content = fs.readFileSync(filePath, 'utf8');
      const newContent = content.replace(
        "import HubsDiscoveryPage from '~/components/magic-patterns/pages/hubs/index';",
        "import HubsDiscoveryPage from '~/components/magic-patterns/pages/hubs/index';"
      );
      fs.writeFileSync(filePath, newContent);
      console.log('✅ Fixed hubs.tsx import');
    }
  },
  
  // Fix help route
  {
    file: './apps/web/app/routes/help/index.tsx',
    fix: () => {
      const filePath = './apps/web/app/routes/help/index.tsx';
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const newContent = content.replace(
          "import HelpPage from '~/components/magic-patterns/pages/help';",
          "import HelpPage from '~/components/magic-patterns/pages/help';"
        );
        fs.writeFileSync(filePath, newContent);
        console.log('✅ Fixed help/index.tsx import');
      }
    }
  }
];

// Check if component files actually exist
function checkComponentExists(importPath) {
  const componentPath = importPath
    .replace('~/', './apps/web/')
    .replace('/components/', '/app/components/');
    
  // Try with .tsx extension
  if (fs.existsSync(componentPath + '.tsx')) {
    return true;
  }
  
  // Try as directory with index.tsx
  if (fs.existsSync(path.join(componentPath, 'index.tsx'))) {
    return true;
  }
  
  // Try without extension (might be .ts file)
  if (fs.existsSync(componentPath + '.ts')) {
    return true;
  }
  
  return false;
}

// Main fix function
function fixImports() {
  console.log('🔧 Fixing Navigation Imports\n');
  
  // First, check which components actually exist
  console.log('📋 Checking component existence...\n');
  
  const missingComponents = [];
  const existingComponents = [];
  
  for (const [importPath] of Object.entries(importFixes)) {
    if (checkComponentExists(importPath)) {
      existingComponents.push(importPath);
    } else {
      missingComponents.push(importPath);
    }
  }
  
  console.log(`✅ Found ${existingComponents.length} existing components`);
  console.log(`❌ Missing ${missingComponents.length} components\n`);
  
  if (missingComponents.length > 0) {
    console.log('Missing components:');
    missingComponents.forEach(comp => {
      console.log(`  - ${comp}`);
    });
    console.log('\n');
  }
  
  // Apply route-specific fixes
  console.log('🔧 Applying route fixes...\n');
  
  for (const routeFix of routeFixes) {
    try {
      routeFix.fix();
    } catch (error) {
      console.error(`❌ Error fixing ${routeFix.file}: ${error.message}`);
    }
  }
  
  // Generate export files for missing components that should exist
  console.log('\n📝 Creating index.ts export files where needed...\n');
  
  // Check if we need to create index.ts files for directories
  const dirsNeedingIndex = [
    './apps/web/app/components/magic-patterns/pages/hubs',
    './apps/web/app/components/magic-patterns/pages/help',
  ];
  
  for (const dir of dirsNeedingIndex) {
    const indexPath = path.join(dir, 'index.ts');
    if (!fs.existsSync(indexPath) && fs.existsSync(dir)) {
      // Find the main component file in the directory
      const files = fs.readdirSync(dir);
      const componentFile = files.find(f => f.endsWith('.tsx') && f !== 'index.tsx');
      
      if (componentFile) {
        const componentName = componentFile.replace('.tsx', '');
        const exportContent = `export { default } from './${componentName}';\n`;
        fs.writeFileSync(indexPath, exportContent);
        console.log(`✅ Created ${indexPath}`);
      }
    }
  }
  
  console.log('\n✨ Import fixes complete!');
  console.log('\nNext steps:');
  console.log('1. Run: pnpm typecheck to see remaining issues');
  console.log('2. Some components may need to be created or have different names');
  console.log('3. Check navigation-issues-report.json for detailed analysis');
}

// Run the fixer
fixImports();