#!/usr/bin/env node
/**
 * Database Field Scanner
 * Scans all React components and route files to identify database field references
 * and validates them against the actual database schema
 */

const fs = require('fs');
const path = require('path');

// Known database tables and their correct field names (snake_case)
const DATABASE_SCHEMA = {
  venues: [
    'id', 'name', 'description', 'address', 'city', 'state', 'country',
    'venue_type', 'capacity', 'price_per_hour', 'amenities', 'images',
    'average_rating', 'total_reviews', 'is_active', 'verified',
    'image_url', 'slug', 'community_id', 'account_id',
    'created_at', 'updated_at', 'listed_date'
  ],
  events: [
    'id', 'title', 'description', 'start_date', 'end_date', 'venue_id',
    'organizer_id', 'category', 'status', 'price', 'max_attendees',
    'images', 'tags', 'created_at', 'updated_at', 'published_at'
  ],
  performer_profiles: [
    'id', 'user_id', 'stage_name', 'bio', 'genres', 'experience_years',
    'hourly_rate', 'travel_radius', 'equipment', 'portfolio_images',
    'demo_videos', 'rating', 'total_reviews', 'status',
    'created_at', 'updated_at'
  ],
  communities: [
    'id', 'name', 'description', 'slug', 'image_url', 'banner_url',
    'location', 'member_count', 'created_at', 'updated_at'
  ]
};

// Common field name mappings (wrong → correct)
const FIELD_MAPPINGS = {
  // Rating fields
  'rating': 'average_rating',
  'reviewCount': 'total_reviews',
  'review_count': 'total_reviews',
  
  // Venue fields
  'venueType': 'venue_type',
  'pricePerHour': 'price_per_hour',
  
  // Date fields
  'startDate': 'start_date',
  'endDate': 'end_date',
  'createdDate': 'created_at',
  'updatedDate': 'updated_at',
  'publishedDate': 'published_at',
  'listedDate': 'listed_date',
  
  // Other common patterns
  'firstName': 'first_name',
  'lastName': 'last_name',
  'imageUrl': 'image_url',
  'userId': 'user_id',
  'venueId': 'venue_id',
  'eventId': 'event_id'
};

// Scan directories
const SCAN_DIRECTORIES = [
  './apps/web/app/components/magic-patterns/pages',
  './apps/web/app/components/magic-patterns/components',
  './apps/web/app/routes',
  './apps/web/app/types'
];

class DatabaseFieldScanner {
  constructor() {
    this.issues = [];
    this.scannedFiles = [];
  }

  // Extract field references from code
  extractFieldReferences(content, filePath) {
    const fieldReferences = new Set();
    
    // Patterns to match field access
    const patterns = [
      // Direct property access: object.fieldName
      /(\w+)\.(\w+)/g,
      // Array access with quotes: object['fieldName'] or object["fieldName"]
      /\w+\[['"](\w+)['"]\]/g,
      // Destructuring: { fieldName } = object
      /\{\s*(\w+)\s*\}/g,
      // Select queries: .select('field1, field2')
      /\.select\(['"`]([^'"`]+)['"`]\)/g,
      // Filter/where clauses: .eq('fieldName', value)
      /\.(eq|neq|gt|gte|lt|lte|like|ilike)\(['"`](\w+)['"`]/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[2]) {
          fieldReferences.add(match[2]);
        } else if (match[1]) {
          fieldReferences.add(match[1]);
        }
      }
    });

    return Array.from(fieldReferences);
  }

  // Check if field exists in any table or if there's a mapping
  validateField(fieldName) {
    // Check if field exists in any table
    for (const [table, fields] of Object.entries(DATABASE_SCHEMA)) {
      if (fields.includes(fieldName)) {
        return { valid: true, table, field: fieldName };
      }
    }

    // Check if there's a known mapping
    if (FIELD_MAPPINGS[fieldName]) {
      const correctField = FIELD_MAPPINGS[fieldName];
      // Verify the correct field exists in schema
      for (const [table, fields] of Object.entries(DATABASE_SCHEMA)) {
        if (fields.includes(correctField)) {
          return { 
            valid: false, 
            issue: 'field_mapping',
            wrongField: fieldName,
            correctField: correctField,
            table: table
          };
        }
      }
    }

    // Check for camelCase that should be snake_case
    const snakeCase = fieldName.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (snakeCase !== fieldName) {
      for (const [table, fields] of Object.entries(DATABASE_SCHEMA)) {
        if (fields.includes(snakeCase)) {
          return {
            valid: false,
            issue: 'case_conversion',
            wrongField: fieldName,
            correctField: snakeCase,
            table: table
          };
        }
      }
    }

    return { valid: false, issue: 'unknown_field', field: fieldName };
  }

  // Scan a single file
  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fieldReferences = this.extractFieldReferences(content, filePath);
      
      const fileIssues = [];
      
      fieldReferences.forEach(field => {
        const validation = this.validateField(field);
        if (!validation.valid) {
          fileIssues.push({
            file: filePath,
            field: field,
            ...validation
          });
        }
      });

      if (fileIssues.length > 0) {
        this.issues.push(...fileIssues);
      }

      this.scannedFiles.push({
        file: filePath,
        fieldCount: fieldReferences.length,
        issues: fileIssues.length
      });

    } catch (error) {
      console.error(`Error scanning ${filePath}:`, error.message);
    }
  }

  // Recursively scan directory
  scanDirectory(dir) {
    if (!fs.existsSync(dir)) {
      console.warn(`Directory not found: ${dir}`);
      return;
    }

    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.scanDirectory(filePath);
      } else if (file.match(/\.(tsx?|jsx?)$/)) {
        this.scanFile(filePath);
      }
    });
  }

  // Generate report
  generateReport() {
    console.log('\n=== DATABASE FIELD SCANNER REPORT ===\n');
    
    console.log(`📊 SCAN SUMMARY:`);
    console.log(`- Files scanned: ${this.scannedFiles.length}`);
    console.log(`- Total issues found: ${this.issues.length}`);
    
    if (this.issues.length === 0) {
      console.log('\n✅ No database field issues found!');
      return;
    }

    // Group issues by type
    const issuesByType = {};
    this.issues.forEach(issue => {
      if (!issuesByType[issue.issue]) {
        issuesByType[issue.issue] = [];
      }
      issuesByType[issue.issue].push(issue);
    });

    console.log('\n🔍 ISSUES BY TYPE:');
    
    Object.entries(issuesByType).forEach(([type, issues]) => {
      console.log(`\n${type.toUpperCase()} (${issues.length} issues):`);
      
      issues.forEach(issue => {
        const relativePath = issue.file.replace(process.cwd(), '.');
        console.log(`  ❌ ${relativePath}`);
        
        if (issue.wrongField && issue.correctField) {
          console.log(`     ${issue.wrongField} → ${issue.correctField} (table: ${issue.table})`);
        } else {
          console.log(`     Unknown field: ${issue.field}`);
        }
      });
    });

    // Generate fix script
    this.generateFixScript();
  }

  // Generate automated fix script
  generateFixScript() {
    const fixableIssues = this.issues.filter(issue => 
      issue.issue === 'field_mapping' || issue.issue === 'case_conversion'
    );

    if (fixableIssues.length === 0) {
      console.log('\n❌ No automatically fixable issues found.');
      return;
    }

    console.log(`\n🔧 GENERATING FIX SCRIPT (${fixableIssues.length} fixable issues)...`);
    
    let fixScript = '#!/bin/bash\n';
    fixScript += '# Auto-generated database field fix script\n\n';
    
    const fixesByFile = {};
    fixableIssues.forEach(issue => {
      if (!fixesByFile[issue.file]) {
        fixesByFile[issue.file] = [];
      }
      fixesByFile[issue.file].push({
        wrong: issue.wrongField,
        correct: issue.correctField
      });
    });

    Object.entries(fixesByFile).forEach(([file, fixes]) => {
      fixes.forEach(fix => {
        // Generate sed command for each fix
        fixScript += `echo "Fixing ${fix.wrong} → ${fix.correct} in ${file}"\n`;
        fixScript += `sed -i.bak 's/\\b${fix.wrong}\\b/${fix.correct}/g' "${file}"\n`;
      });
    });

    fs.writeFileSync('./fix-database-fields.sh', fixScript);
    fs.chmodSync('./fix-database-fields.sh', '755');
    
    console.log('\n✅ Fix script generated: ./fix-database-fields.sh');
    console.log('Run: ./fix-database-fields.sh');
  }

  // Run the complete scan
  run() {
    console.log('🔍 Starting database field scan...\n');
    
    SCAN_DIRECTORIES.forEach(dir => {
      console.log(`Scanning: ${dir}`);
      this.scanDirectory(dir);
    });
    
    this.generateReport();
  }
}

// Run the scanner
const scanner = new DatabaseFieldScanner();
scanner.run();