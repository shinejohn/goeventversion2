#!/usr/bin/env node
/**
 * PRIORITY DATABASE FIELD FIXER
 * Focus: Most Common → Least Common Issues
 * Target: Critical rendering files first
 */

const fs = require('fs');
const path = require('path');

// PRIORITY 1: Most Critical Files (SSR pages that must render)
const CRITICAL_FILES = [
  './apps/web/app/routes/events/index.tsx',           // Events page
  './apps/web/app/routes/venues/index.tsx',           // Venues page  
  './apps/web/app/routes/performers/index.tsx',       // Performers page
  './apps/web/app/routes/index.tsx',                  // Homepage
  './apps/web/app/routes/events/$id.tsx',             // Event detail
  './apps/web/app/routes/venues/$id.tsx',             // Venue detail
  './apps/web/app/routes/performers/$id.tsx',         // Performer detail
];

// PRIORITY 2: Most Common Field Issues (by frequency)
const FIELD_FIXES_BY_PRIORITY = [
  // 1. UNKNOWN FIELDS → DATABASE FIELDS (Most Critical)
  {
    category: 'UNKNOWN_TO_DATABASE',
    priority: 1,
    fixes: [
      { wrong: 'count', correct: 'total_reviews', context: 'pagination/counting' },
      { wrong: 'totalCount', correct: 'total_reviews', context: 'pagination' },
      { wrong: 'image', correct: 'images', context: 'single image reference' },
      { wrong: 'stats', correct: 'status', context: 'status/statistics confusion' },
      { wrong: 'stage', correct: 'state', context: 'US state field' },
    ]
  },
  
  // 2. FUZZY MATCHES (Typos/Similar names)
  {
    category: 'FUZZY_MATCHES',
    priority: 2, 
    fixes: [
      { wrong: 'start_datetime', correct: 'start_date', context: 'event dates' },
      { wrong: 'publishedAt', correct: 'published_at', context: 'publication dates' },
    ]
  },
  
  // 3. CASE CONVERSION (camelCase → snake_case)
  {
    category: 'CASE_CONVERSION', 
    priority: 3,
    fixes: [
      { wrong: 'paymentStatus', correct: 'payment_status', context: 'booking payments' },
      { wrong: 'userId', correct: 'user_id', context: 'foreign keys' },
      { wrong: 'accountId', correct: 'account_id', context: 'foreign keys' },
      { wrong: 'publishedAt', correct: 'published_at', context: 'timestamps' },
      { wrong: 'isActive', correct: 'is_active', context: 'boolean flags' },
    ]
  },
  
  // 4. KNOWN MAPPINGS (Fields we already identified)
  {
    category: 'KNOWN_MAPPINGS',
    priority: 4,
    fixes: [
      { wrong: 'reviewCount', correct: 'total_reviews', context: 'review counts' },
      { wrong: 'rating', correct: 'average_rating', context: 'ratings' },
      { wrong: 'venueType', correct: 'venue_type', context: 'venue categories' },
      { wrong: 'pricePerHour', correct: 'price_per_hour', context: 'pricing' },
      { wrong: 'startDate', correct: 'start_date', context: 'event dates' },
      { wrong: 'endDate', correct: 'end_date', context: 'event dates' },
    ]
  }
];

class PriorityFixer {
  constructor() {
    this.fixedFiles = [];
    this.totalFixes = 0;
  }

  // Fix critical files first
  async fixCriticalFiles() {
    console.log('🎯 PHASE 1: Fixing Critical SSR Files\n');
    
    for (const filePath of CRITICAL_FILES) {
      if (fs.existsSync(filePath)) {
        console.log(`🔧 Fixing critical file: ${filePath}`);
        await this.fixSingleFile(filePath, 'CRITICAL');
      } else {
        console.log(`⚠️ Critical file not found: ${filePath}`);
      }
    }
  }

  // Apply fixes by priority level
  async fixByPriority() {
    console.log('\n🎯 PHASE 2: Fixing by Issue Priority\n');
    
    // Sort by priority (1 = highest)
    const sortedFixes = FIELD_FIXES_BY_PRIORITY.sort((a, b) => a.priority - b.priority);
    
    for (const fixGroup of sortedFixes) {
      console.log(`\n📋 Priority ${fixGroup.priority}: ${fixGroup.category}`);
      console.log(`   Fixing ${fixGroup.fixes.length} field mapping issues...\n`);
      
      for (const fix of fixGroup.fixes) {
        await this.applyGlobalFix(fix);
      }
    }
  }

  // Fix a single file with all applicable fixes
  async fixSingleFile(filePath, phase = '') {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let changesMade = 0;
      const appliedFixes = [];
      
      // Apply all relevant fixes to this file
      for (const fixGroup of FIELD_FIXES_BY_PRIORITY) {
        for (const fix of fixGroup.fixes) {
          const pattern = new RegExp(`\\b${fix.wrong}\\b`, 'g');
          const matches = content.match(pattern);
          
          if (matches) {
            content = content.replace(pattern, fix.correct);
            changesMade += matches.length;
            appliedFixes.push(`${fix.wrong} → ${fix.correct} (${matches.length}x)`);
          }
        }
      }
      
      if (changesMade > 0) {
        // Create backup
        fs.writeFileSync(`${filePath}.backup`, fs.readFileSync(filePath));
        
        // Apply changes
        fs.writeFileSync(filePath, content);
        
        console.log(`   ✅ ${changesMade} fixes applied ${phase ? `[${phase}]` : ''}`);
        appliedFixes.forEach(fix => console.log(`      - ${fix}`));
        
        this.fixedFiles.push(filePath);
        this.totalFixes += changesMade;
      } else {
        console.log(`   ➖ No fixes needed ${phase ? `[${phase}]` : ''}`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error fixing ${filePath}: ${error.message}`);
    }
  }

  // Apply a fix globally across all relevant files
  async applyGlobalFix(fix) {
    console.log(`🔍 Searching for: ${fix.wrong} → ${fix.correct}`);
    
    // Find all files containing this field
    const searchDirs = [
      './apps/web/app/routes',
      './apps/web/app/components/magic-patterns/pages',
      './apps/web/app/components/magic-patterns/components'
    ];
    
    const matchingFiles = [];
    
    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        const files = this.findFilesWithPattern(dir, fix.wrong);
        matchingFiles.push(...files);
      }
    }
    
    if (matchingFiles.length === 0) {
      console.log(`   ➖ No files found with '${fix.wrong}'`);
      return;
    }
    
    console.log(`   📁 Found in ${matchingFiles.length} files`);
    
    // Apply fix to each file
    for (const file of matchingFiles) {
      await this.applySingleFix(file, fix);
    }
  }

  // Find files containing a specific pattern
  findFilesWithPattern(dir, pattern) {
    const matchingFiles = [];
    
    const scanDir = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDir(fullPath);
        } else if (item.match(/\.(tsx?|jsx?)$/)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(pattern)) {
              matchingFiles.push(fullPath);
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    };
    
    scanDir(dir);
    return matchingFiles;
  }

  // Apply a single fix to a single file
  async applySingleFix(filePath, fix) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const pattern = new RegExp(`\\b${fix.wrong}\\b`, 'g');
      const matches = content.match(pattern);
      
      if (matches) {
        // Create backup if it doesn't exist
        const backupPath = `${filePath}.backup`;
        if (!fs.existsSync(backupPath)) {
          fs.writeFileSync(backupPath, content);
        }
        
        // Apply fix
        content = content.replace(pattern, fix.correct);
        fs.writeFileSync(filePath, content);
        
        console.log(`      ✅ ${matches.length}x in ${filePath.replace(process.cwd(), '.')}`);
        this.totalFixes += matches.length;
        
        if (!this.fixedFiles.includes(filePath)) {
          this.fixedFiles.push(filePath);
        }
      }
      
    } catch (error) {
      console.error(`      ❌ Error fixing ${filePath}: ${error.message}`);
    }
  }

  // Generate summary report
  generateSummary() {
    console.log('\n📊 PRIORITY FIX SUMMARY');
    console.log('========================');
    console.log(`✅ Files Fixed: ${this.fixedFiles.length}`);
    console.log(`✅ Total Fixes Applied: ${this.totalFixes}`);
    console.log(`📁 Backup Files Created: ${this.fixedFiles.length}`);
    
    if (this.fixedFiles.length > 0) {
      console.log('\n📋 Files Modified:');
      this.fixedFiles.forEach(file => {
        const relativePath = file.replace(process.cwd(), '.');
        console.log(`   - ${relativePath}`);
      });
    }
    
    console.log('\n🔧 Next Steps:');
    console.log('   1. Test critical pages: /events, /venues, /performers');
    console.log('   2. Check Railway deployment logs');
    console.log('   3. Run comprehensive scanner again');
    console.log('   4. Address remaining unknown fields manually');
  }

  // Main execution
  async run() {
    console.log('🚀 PRIORITY DATABASE FIELD FIXER');
    console.log('Strategy: Most Common → Least Common Issues\n');
    
    try {
      await this.fixCriticalFiles();
      await this.fixByPriority();
      this.generateSummary();
      
    } catch (error) {
      console.error('❌ FATAL ERROR:', error.message);
    }
  }
}

// Execute the priority fixer
const fixer = new PriorityFixer();
fixer.run();