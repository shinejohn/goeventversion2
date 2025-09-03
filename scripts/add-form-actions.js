#!/usr/bin/env node

/**
 * Add Form Actions to Routes
 * 
 * This script adds action functions to routes that have forms
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Route files that commonly have forms
const formRoutes = [
  'apps/web/app/routes/auth/sign-in.tsx',
  'apps/web/app/routes/auth/sign-up.tsx',
  'apps/web/app/routes/auth/forgot-password.tsx',
  'apps/web/app/routes/contact/index.tsx',
  'apps/web/app/routes/book-it/venues/$id/book/index.tsx',
  'apps/web/app/routes/advertise/index.tsx',
  'apps/web/app/routes/bookings/index.tsx',
  'apps/web/app/routes/partner/index.tsx',
  'apps/web/app/routes/careers/index.tsx',
  'apps/web/app/routes/home/user/settings/index.tsx',
  'apps/web/app/routes/home/account/settings/index.tsx',
];

// Action template for different form types
const actionTemplates = {
  auth: `
export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // TODO: Implement authentication logic
  // const supabase = getSupabaseServerClient(request);
  // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  return json({ success: true });
};`,
  
  contact: `
export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  
  // TODO: Implement contact form submission
  // Send email or save to database
  
  return json({ success: true, message: 'Thank you for contacting us!' });
};`,
  
  booking: `
export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  
  // TODO: Implement booking logic
  // const supabase = getSupabaseServerClient(request);
  // const { data: booking, error } = await supabase.from('bookings').insert(data);
  
  return redirect('/bookings/confirmation');
};`,
  
  default: `
export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  
  // TODO: Implement form processing logic
  
  return json({ success: true });
};`
};

// Determine action type based on route
function getActionType(routePath) {
  if (routePath.includes('auth/')) return 'auth';
  if (routePath.includes('contact')) return 'contact';
  if (routePath.includes('book')) return 'booking';
  return 'default';
}

// Check if file already has an action
function hasAction(content) {
  return content.includes('export const action') || 
         content.includes('export async function action');
}

// Add necessary imports
function addImports(content) {
  let newContent = content;
  
  if (!content.includes('import { json')) {
    // Find the last import statement
    const lastImportMatch = content.match(/import[^;]+;(?![\s\S]*import)/);
    if (lastImportMatch) {
      const insertIndex = lastImportMatch.index + lastImportMatch[0].length;
      newContent = content.slice(0, insertIndex) + 
        '\nimport { json, redirect } from \'react-router\';' + 
        content.slice(insertIndex);
    }
  }
  
  return newContent;
}

// Stats
const stats = {
  filesProcessed: 0,
  actionsAdded: 0,
  alreadyHasAction: 0,
  errors: []
};

// Main execution
async function main() {
  console.log('🔍 Adding form actions to routes...\n');
  
  for (const routePath of formRoutes) {
    try {
      if (!fs.existsSync(routePath)) {
        console.log(`⚠️  Route not found: ${routePath}`);
        continue;
      }
      
      stats.filesProcessed++;
      let content = fs.readFileSync(routePath, 'utf8');
      
      // Check if already has action
      if (hasAction(content)) {
        stats.alreadyHasAction++;
        console.log(`✓ Already has action: ${routePath}`);
        continue;
      }
      
      // Add imports if needed
      content = addImports(content);
      
      // Get appropriate action template
      const actionType = getActionType(routePath);
      const actionCode = actionTemplates[actionType];
      
      // Find where to insert action (before default export)
      const defaultExportMatch = content.match(/export default function/);
      if (defaultExportMatch) {
        const insertIndex = defaultExportMatch.index;
        content = content.slice(0, insertIndex) + 
          actionCode + '\n\n' + 
          content.slice(insertIndex);
        
        // Write updated file
        fs.writeFileSync(routePath, content);
        stats.actionsAdded++;
        console.log(`✅ Added action to: ${routePath}`);
      } else {
        console.log(`⚠️  Could not find default export in: ${routePath}`);
      }
      
    } catch (error) {
      stats.errors.push({ file: routePath, error: error.message });
      console.error(`❌ Error processing ${routePath}: ${error.message}`);
    }
  }
  
  // Summary
  console.log('\n📊 Summary');
  console.log('==========');
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Actions added: ${stats.actionsAdded}`);
  console.log(`Already has action: ${stats.alreadyHasAction}`);
  console.log(`Errors: ${stats.errors.length}`);
}

main().catch(console.error);