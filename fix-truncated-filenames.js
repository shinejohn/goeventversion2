#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directory containing misc routes
const miscDir = path.join(__dirname, 'apps', 'web', 'app', 'routes', 'misc');

// Mapping of truncated filenames to their correct names
const filenameMappings = {
  'agedirectory.tsx': 'pagedirectory.tsx',
  'areerspage.tsx': 'careerspage.tsx',
  'arketreportpage.tsx': 'marketreportpage.tsx',
  'artnerwithuspage.tsx': 'partnerwithuspage.tsx',
  'azzquartetpage.tsx': 'jazzquartetpage.tsx',
  'boutpage.tsx': 'aboutpage.tsx',
  'dpackagespage.tsx': 'adpackagespage.tsx',
  'dvertisepage.tsx': 'advertisepage.tsx',
  'dvertisingcontactpage.tsx': 'advertisingcontactpage.tsx',
  'dvertisingsolutionspage.tsx': 'advertisingsolutionspage.tsx',
  'earpage.tsx': 'gearpage.tsx',
  'eedpage.tsx': 'feedpage.tsx',
  'icketdetailpage.tsx': 'ticketdetailpage.tsx',
  'icketpurchasepage.tsx': 'ticketpurchasepage.tsx',
  'icketselectionpage.tsx': 'ticketselectionpage.tsx',
  'igcreatorpage.tsx': 'gigcreatorpage.tsx',
  'mailcampaignspage.tsx': 'emailcampaignspage.tsx',
  'omepage.tsx': 'homepage.tsx',
  'omepageshowcasepage.tsx': 'homepageshowcasepage.tsx',
  'ontactuspage.tsx': 'contactuspage.tsx',
  'otfoundpage.tsx': 'notfoundpage.tsx',
  'owitworkspage.tsx': 'howitworkspage.tsx',
  'rbanloftpage.tsx': 'urbanloftpage.tsx',
  'ressmediapage.tsx': 'pressmediapage.tsx',
  'riendspage.tsx': 'friendspage.tsx',
  'roupspage.tsx': 'groupspage.tsx',
  'uickpageaccess.tsx': 'quickpageaccess.tsx',
  'unsetmusicfestivalpage.tsx': 'sunsetmusicfestivalpage.tsx'
};

console.log('🔧 Fixing truncated filenames in misc directory...\n');

let filesRenamed = 0;
let errors = 0;

// Process each file mapping
Object.entries(filenameMappings).forEach(([oldName, newName]) => {
  const oldPath = path.join(miscDir, oldName);
  const newPath = path.join(miscDir, newName);
  
  try {
    if (fs.existsSync(oldPath)) {
      // Rename the file
      fs.renameSync(oldPath, newPath);
      console.log(`✅ Renamed: ${oldName} → ${newName}`);
      filesRenamed++;
    } else {
      console.log(`⚠️  Skipped: ${oldName} (file not found)`);
    }
  } catch (error) {
    console.error(`❌ Error renaming ${oldName}: ${error.message}`);
    errors++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`- Files renamed: ${filesRenamed}`);
console.log(`- Errors: ${errors}`);

// Now update the routes.ts file to use the correct filenames
console.log('\n🔍 Updating references in routes.ts...\n');

const routesPath = path.join(__dirname, 'apps', 'web', 'app', 'routes.ts');
let routesContent = fs.readFileSync(routesPath, 'utf8');
let updatedReferences = 0;

// Update references in routes.ts
Object.entries(filenameMappings).forEach(([oldName, newName]) => {
  const oldRef = oldName.replace('.tsx', '');
  const newRef = newName.replace('.tsx', '');
  
  // Look for references like 'routes/misc/boutpage.tsx'
  const oldPattern = new RegExp(`routes/misc/${oldRef}\\.tsx`, 'g');
  const matches = routesContent.match(oldPattern);
  
  if (matches && matches.length > 0) {
    routesContent = routesContent.replace(oldPattern, `routes/misc/${newRef}.tsx`);
    console.log(`✅ Updated reference: misc/${oldRef}.tsx → misc/${newRef}.tsx`);
    updatedReferences += matches.length;
  }
});

// Write the updated routes.ts file
fs.writeFileSync(routesPath, routesContent);

console.log(`\n✅ Updated ${updatedReferences} references in routes.ts`);
console.log('\n🎉 Truncated filename fix completed!');