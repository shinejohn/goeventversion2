#!/usr/bin/env node

/**
 * Fix corrupted route names in routes.ts
 */

const fs = require('fs');

try {
  const routesPath = 'apps/web/app/routes.ts';
  let content = fs.readFileSync(routesPath, 'utf8');
  
  // Fix corrupted route paths by removing the broken section
  const startMarker = '  // ADDITIONAL MAGIC PATTERNS ROUTES';
  const endMarker = '    // PHASE 1: Core Booking Experience';
  
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);
  
  if (startIndex !== -1 && endIndex !== -1) {
    const beforeSection = content.substring(0, startIndex);
    const afterSection = content.substring(endIndex);
    
    // Clean up the content by removing the corrupted routes
    const cleanedContent = beforeSection + '  ' + afterSection;
    
    fs.writeFileSync(routesPath, cleanedContent);
    console.log('✅ Fixed corrupted routes in routes.ts');
  } else {
    console.log('⚠️ Could not find route markers');
  }
  
} catch (error) {
  console.error('❌ Error fixing routes:', error.message);
}