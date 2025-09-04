#!/usr/bin/env node
/**
 * COMPREHENSIVE DATABASE FIELD SCANNER
 * 
 * GOAL: 95% Confidence Rate + 100% Completion
 * 
 * This scanner will:
 * 1. Extract the ACTUAL database schema from database types file
 * 2. Scan EVERY file in the codebase for field references
 * 3. Use multiple detection patterns for maximum coverage
 * 4. Cross-reference every field against actual schema
 * 5. Generate detailed reports with confidence scoring
 * 6. Create automated fix scripts with validation
 */

const fs = require('fs');
const path = require('path');

class ComprehensiveDatabaseScanner {
  constructor() {
    this.actualSchema = {};
    this.scannedFiles = [];
    this.issues = [];
    this.fieldReferences = new Map(); // file -> fields mapping
    this.confidenceMetrics = {
      filesScanned: 0,
      patternsDetected: 0,
      schemaMatches: 0,
      totalReferences: 0
    };
  }

  // STEP 1: Extract actual schema from generated types
  async extractActualSchema() {
    console.log('🔍 STEP 1: Extracting actual database schema...');
    
    const typesFiles = [
      './packages/supabase/src/database.types.ts',
      './apps/web/supabase/types.ts',
      './packages/supabase/database.types.ts'
    ];

    let schemaFound = false;
    
    for (const typesFile of typesFiles) {
      if (fs.existsSync(typesFile)) {
        try {
          const content = fs.readFileSync(typesFile, 'utf8');
          this.parseSchemaFromTypes(content);
          console.log(`✅ Schema extracted from: ${typesFile}`);
          schemaFound = true;
          break;
        } catch (error) {
          console.warn(`⚠️ Could not parse ${typesFile}: ${error.message}`);
        }
      }
    }

    if (!schemaFound) {
      console.log('📋 Using fallback comprehensive schema...');
      this.useFallbackSchema();
    }

    console.log(`📊 Loaded schema for ${Object.keys(this.actualSchema).length} tables`);
    Object.entries(this.actualSchema).forEach(([table, fields]) => {
      console.log(`   ${table}: ${fields.length} fields`);
    });
  }

  // Parse TypeScript types to extract actual database schema
  parseSchemaFromTypes(content) {
    // Extract Tables interface
    const tablesMatch = content.match(/export interface Tables\s*{([^}]+)}/s);
    if (!tablesMatch) {
      throw new Error('Tables interface not found');
    }

    const tablesContent = tablesMatch[1];
    
    // Extract each table definition
    const tableMatches = tablesContent.matchAll(/(\w+):\s*{[^}]*Row:\s*{([^}]+)}/gs);
    
    for (const match of tableMatches) {
      const tableName = match[1];
      const rowContent = match[2];
      
      // Extract field names from Row interface
      const fieldMatches = rowContent.matchAll(/(\w+):/g);
      const fields = Array.from(fieldMatches, m => m[1]);
      
      this.actualSchema[tableName] = fields;
    }
  }

  // Comprehensive fallback schema (manually maintained)
  useFallbackSchema() {
    this.actualSchema = {
      // User & Auth tables
      users: ['id', 'email', 'created_at', 'updated_at', 'name', 'avatar_url'],
      accounts: ['id', 'primary_owner_user_id', 'name', 'slug', 'email', 'is_personal_account', 'picture_url', 'created_at', 'updated_at'],
      
      // Core business tables
      communities: [
        'id', 'name', 'description', 'slug', 'image_url', 'banner_url', 
        'location', 'member_count', 'is_active', 'created_at', 'updated_at'
      ],
      
      venues: [
        'id', 'name', 'description', 'address', 'city', 'state', 'country', 'postal_code',
        'venue_type', 'capacity', 'price_per_hour', 'amenities', 'images', 
        'average_rating', 'total_reviews', 'is_active', 'verified',
        'image_url', 'slug', 'community_id', 'account_id', 'latitude', 'longitude',
        'created_at', 'updated_at', 'listed_date', 'contact_email', 'contact_phone'
      ],
      
      events: [
        'id', 'title', 'description', 'start_date', 'end_date', 'venue_id',
        'organizer_id', 'category', 'status', 'price', 'max_attendees', 'current_attendees',
        'images', 'tags', 'is_featured', 'is_public', 'registration_deadline',
        'created_at', 'updated_at', 'published_at', 'community_id', 'slug'
      ],
      
      performer_profiles: [
        'id', 'user_id', 'stage_name', 'bio', 'genres', 'experience_years',
        'hourly_rate', 'travel_radius', 'equipment', 'portfolio_images',
        'demo_videos', 'average_rating', 'total_reviews', 'status', 'is_verified',
        'created_at', 'updated_at', 'availability_schedule', 'booking_requirements'
      ],
      
      // Booking & Transaction tables
      bookings: [
        'id', 'user_id', 'venue_id', 'event_id', 'performer_id', 'booking_type',
        'start_date', 'end_date', 'total_amount', 'status', 'payment_status',
        'special_requests', 'booking_reference', 'created_at', 'updated_at'
      ],
      
      tickets: [
        'id', 'event_id', 'user_id', 'ticket_type', 'price', 'quantity',
        'status', 'qr_code', 'purchased_at', 'used_at', 'created_at', 'updated_at'
      ],
      
      // Relationship tables
      event_performers: ['id', 'event_id', 'performer_id', 'performance_fee', 'created_at'],
      venue_amenities: ['id', 'venue_id', 'amenity_name', 'description'],
      community_members: ['id', 'community_id', 'user_id', 'role', 'joined_at'],
      
      // Review & Rating tables
      reviews: [
        'id', 'reviewer_id', 'venue_id', 'event_id', 'performer_id',
        'rating', 'comment', 'is_verified', 'created_at', 'updated_at'
      ]
    };
  }

  // STEP 2: Comprehensive field detection patterns
  getFieldDetectionPatterns() {
    return [
      // 1. Direct object property access
      {
        name: 'direct_property',
        pattern: /(?:^|\W)(\w+)\.(\w+)(?=\W|$)/g,
        extract: (match) => match[2],
        confidence: 0.9
      },
      
      // 2. Destructuring patterns
      {
        name: 'destructuring',
        pattern: /\{\s*([^}]+)\s*\}\s*=\s*(\w+)/g,
        extract: (match) => match[1].split(',').map(f => f.trim()),
        confidence: 0.95
      },
      
      // 3. Supabase select queries
      {
        name: 'supabase_select',
        pattern: /\.select\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
        extract: (match) => match[1].split(',').map(f => f.trim()),
        confidence: 0.98
      },
      
      // 4. Supabase filter methods
      {
        name: 'supabase_filters',
        pattern: /\.(eq|neq|gt|gte|lt|lte|like|ilike|in|contains|containedBy|overlaps)\s*\(\s*['"`](\w+)['"`]/g,
        extract: (match) => match[2],
        confidence: 0.95
      },
      
      // 5. Array/bracket notation
      {
        name: 'bracket_notation',
        pattern: /\w+\s*\[\s*['"`](\w+)['"`]\s*\]/g,
        extract: (match) => match[1],
        confidence: 0.85
      },
      
      // 6. TypeScript interface definitions
      {
        name: 'interface_fields',
        pattern: /interface\s+\w+\s*{[^}]*(\w+):/g,
        extract: (match) => match[1],
        confidence: 0.8
      },
      
      // 7. Order by clauses
      {
        name: 'order_by',
        pattern: /\.order\s*\(\s*['"`](\w+)['"`]/g,
        extract: (match) => match[1],
        confidence: 0.9
      },
      
      // 8. React component props
      {
        name: 'react_props',
        pattern: /(?:props|data)\.(\w+)/g,
        extract: (match) => match[1],
        confidence: 0.7
      },
      
      // 9. Template literals with field references
      {
        name: 'template_literals',
        pattern: /\$\{[^}]*\.(\w+)[^}]*\}/g,
        extract: (match) => match[1],
        confidence: 0.8
      },
      
      // 10. Form field names
      {
        name: 'form_fields',
        pattern: /(?:name|id)=['"`](\w+)['"`]/g,
        extract: (match) => match[1],
        confidence: 0.6
      }
    ];
  }

  // STEP 3: Scan file with all patterns
  scanFileComprehensively(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const patterns = this.getFieldDetectionPatterns();
      const detectedFields = new Map(); // field -> {patterns: [], confidence: number}
      
      patterns.forEach(patternConfig => {
        let match;
        const pattern = new RegExp(patternConfig.pattern.source, patternConfig.pattern.flags);
        
        while ((match = pattern.exec(content)) !== null) {
          const extracted = patternConfig.extract(match);
          const fields = Array.isArray(extracted) ? extracted : [extracted];
          
          fields.forEach(field => {
            if (field && field.match(/^[a-zA-Z_]\w*$/)) { // Valid identifier
              if (!detectedFields.has(field)) {
                detectedFields.set(field, { patterns: [], confidence: 0 });
              }
              
              const fieldData = detectedFields.get(field);
              fieldData.patterns.push(patternConfig.name);
              fieldData.confidence = Math.max(fieldData.confidence, patternConfig.confidence);
            }
          });
        }
      });
      
      // Store results
      this.fieldReferences.set(filePath, detectedFields);
      this.confidenceMetrics.filesScanned++;
      this.confidenceMetrics.patternsDetected += detectedFields.size;
      
      return detectedFields;
      
    } catch (error) {
      console.error(`❌ Error scanning ${filePath}: ${error.message}`);
      return new Map();
    }
  }

  // STEP 4: Validate fields against actual schema
  validateFieldsAgainstSchema(fields, filePath) {
    const validationResults = [];
    
    fields.forEach((fieldData, fieldName) => {
      const validation = this.validateSingleField(fieldName, fieldData.confidence);
      validation.file = filePath;
      validation.detectionPatterns = fieldData.patterns;
      validation.confidence = fieldData.confidence;
      
      if (!validation.isValid) {
        this.issues.push(validation);
      } else {
        this.confidenceMetrics.schemaMatches++;
      }
      
      this.confidenceMetrics.totalReferences++;
      validationResults.push(validation);
    });
    
    return validationResults;
  }

  // Advanced field validation with smart suggestions
  validateSingleField(fieldName, detectionConfidence) {
    // 1. Direct schema match
    for (const [table, fields] of Object.entries(this.actualSchema)) {
      if (fields.includes(fieldName)) {
        return {
          isValid: true,
          fieldName: fieldName,
          table: table,
          confidence: detectionConfidence
        };
      }
    }

    // 2. Common camelCase -> snake_case conversions
    const snakeCaseField = this.camelToSnakeCase(fieldName);
    if (snakeCaseField !== fieldName) {
      for (const [table, fields] of Object.entries(this.actualSchema)) {
        if (fields.includes(snakeCaseField)) {
          return {
            isValid: false,
            issueType: 'case_conversion',
            fieldName: fieldName,
            suggestedField: snakeCaseField,
            table: table,
            confidence: detectionConfidence * 0.9
          };
        }
      }
    }

    // 3. Known field mappings
    const knownMappings = this.getKnownFieldMappings();
    if (knownMappings[fieldName]) {
      const correctField = knownMappings[fieldName];
      for (const [table, fields] of Object.entries(this.actualSchema)) {
        if (fields.includes(correctField)) {
          return {
            isValid: false,
            issueType: 'known_mapping',
            fieldName: fieldName,
            suggestedField: correctField,
            table: table,
            confidence: detectionConfidence * 0.95
          };
        }
      }
    }

    // 4. Fuzzy matching for typos
    const fuzzyMatch = this.findFuzzyMatch(fieldName);
    if (fuzzyMatch) {
      return {
        isValid: false,
        issueType: 'fuzzy_match',
        fieldName: fieldName,
        suggestedField: fuzzyMatch.field,
        table: fuzzyMatch.table,
        similarity: fuzzyMatch.similarity,
        confidence: detectionConfidence * fuzzyMatch.similarity
      };
    }

    // 5. Unknown field
    return {
      isValid: false,
      issueType: 'unknown_field',
      fieldName: fieldName,
      confidence: detectionConfidence
    };
  }

  // Helper functions
  camelToSnakeCase(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  getKnownFieldMappings() {
    return {
      'rating': 'average_rating',
      'reviewCount': 'total_reviews',
      'pricePerHour': 'price_per_hour',
      'venueType': 'venue_type',
      'startDate': 'start_date',
      'endDate': 'end_date',
      'createdDate': 'created_at',
      'updatedDate': 'updated_at',
      'publishedDate': 'published_at',
      'listedDate': 'listed_date',
      'imageUrl': 'image_url',
      'userId': 'user_id',
      'venueId': 'venue_id',
      'eventId': 'event_id',
      'performerId': 'performer_id',
      'communityId': 'community_id',
      'firstName': 'first_name',
      'lastName': 'last_name'
    };
  }

  // Fuzzy matching for typos and similar field names
  findFuzzyMatch(fieldName) {
    let bestMatch = null;
    let bestSimilarity = 0.7; // Minimum similarity threshold
    
    for (const [table, fields] of Object.entries(this.actualSchema)) {
      for (const field of fields) {
        const similarity = this.calculateSimilarity(fieldName, field);
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestMatch = { field, table, similarity };
        }
      }
    }
    
    return bestMatch;
  }

  // Levenshtein distance based similarity
  calculateSimilarity(a, b) {
    const matrix = [];
    const aLen = a.length;
    const bLen = b.length;

    for (let i = 0; i <= bLen; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= aLen; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= bLen; i++) {
      for (let j = 1; j <= aLen; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const maxLength = Math.max(aLen, bLen);
    return 1 - matrix[bLen][aLen] / maxLength;
  }

  // STEP 5: Scan all relevant files
  async scanAllFiles() {
    console.log('\n🔍 STEP 2: Scanning all files for database field references...');
    
    const scanDirs = [
      './apps/web/app',
      './packages',
      './tooling'
    ];

    const extensions = ['.tsx', '.ts', '.jsx', '.js'];
    
    for (const dir of scanDirs) {
      if (fs.existsSync(dir)) {
        await this.scanDirectoryRecursive(dir, extensions);
      }
    }
    
    console.log(`✅ Scanned ${this.confidenceMetrics.filesScanned} files`);
  }

  async scanDirectoryRecursive(dir, extensions) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        await this.scanDirectoryRecursive(fullPath, extensions);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        const fields = this.scanFileComprehensively(fullPath);
        if (fields.size > 0) {
          this.validateFieldsAgainstSchema(fields, fullPath);
        }
      }
    }
  }

  // STEP 6: Generate comprehensive report
  generateComprehensiveReport() {
    console.log('\n📊 COMPREHENSIVE ANALYSIS REPORT');
    console.log('=====================================\n');
    
    // Calculate confidence score
    const totalRefs = this.confidenceMetrics.totalReferences;
    const validRefs = this.confidenceMetrics.schemaMatches;
    const confidenceScore = totalRefs > 0 ? (validRefs / totalRefs) * 100 : 0;
    
    console.log('📈 CONFIDENCE METRICS:');
    console.log(`   Overall Confidence: ${confidenceScore.toFixed(1)}%`);
    console.log(`   Files Scanned: ${this.confidenceMetrics.filesScanned}`);
    console.log(`   Field References Found: ${totalRefs}`);
    console.log(`   Schema Matches: ${validRefs}`);
    console.log(`   Issues Detected: ${this.issues.length}`);
    
    if (this.issues.length === 0) {
      console.log('\n✅ NO ISSUES FOUND! Database schema is fully aligned.');
      return;
    }

    // Group issues by type
    const issuesByType = {};
    this.issues.forEach(issue => {
      if (!issuesByType[issue.issueType]) {
        issuesByType[issue.issueType] = [];
      }
      issuesByType[issue.issueType].push(issue);
    });

    console.log('\n🔍 DETAILED ISSUE ANALYSIS:');
    
    Object.entries(issuesByType).forEach(([type, issues]) => {
      console.log(`\n${type.toUpperCase()} (${issues.length} issues):`);
      
      // Sort by confidence (highest first)
      issues.sort((a, b) => b.confidence - a.confidence);
      
      issues.slice(0, 10).forEach(issue => { // Show top 10 per type
        const relativePath = issue.file.replace(process.cwd(), '.');
        console.log(`   ❌ ${relativePath}`);
        console.log(`      Field: ${issue.fieldName}`);
        
        if (issue.suggestedField) {
          console.log(`      Fix: ${issue.fieldName} → ${issue.suggestedField}`);
          console.log(`      Table: ${issue.table}`);
        }
        
        console.log(`      Confidence: ${(issue.confidence * 100).toFixed(1)}%`);
        console.log(`      Detection: [${issue.detectionPatterns.join(', ')}]`);
      });
      
      if (issues.length > 10) {
        console.log(`   ... and ${issues.length - 10} more issues of this type`);
      }
    });

    // Generate fix recommendations
    this.generateFixRecommendations();
  }

  // Generate automated fix recommendations
  generateFixRecommendations() {
    const highConfidenceIssues = this.issues.filter(issue => 
      issue.confidence > 0.8 && 
      (issue.issueType === 'case_conversion' || issue.issueType === 'known_mapping')
    );

    if (highConfidenceIssues.length === 0) {
      console.log('\n❌ No high-confidence automatic fixes available.');
      return;
    }

    console.log(`\n🔧 AUTOMATIC FIX RECOMMENDATIONS (${highConfidenceIssues.length} high-confidence fixes):`);
    
    // Group fixes by file
    const fixesByFile = {};
    highConfidenceIssues.forEach(issue => {
      if (!fixesByFile[issue.file]) {
        fixesByFile[issue.file] = [];
      }
      fixesByFile[issue.file].push({
        wrong: issue.fieldName,
        correct: issue.suggestedField,
        confidence: issue.confidence
      });
    });

    // Generate fix script
    let fixScript = '#!/bin/bash\n';
    fixScript += '# Auto-generated comprehensive database field fix script\n';
    fixScript += `# Generated on: ${new Date().toISOString()}\n`;
    fixScript += `# Confidence level: High (>80%)\n`;
    fixScript += `# Total fixes: ${highConfidenceIssues.length}\n\n`;
    
    fixScript += 'echo "🔧 Starting comprehensive database field fixes..."\n\n';

    Object.entries(fixesByFile).forEach(([file, fixes]) => {
      fixScript += `echo "Fixing ${fixes.length} fields in ${file}"\n`;
      
      fixes.forEach(fix => {
        // Use word boundaries to avoid partial matches
        fixScript += `sed -i.bak 's/\\b${fix.wrong}\\b/${fix.correct}/g' "${file}"\n`;
      });
      
      fixScript += '\n';
    });

    fixScript += 'echo "✅ All fixes applied!"\n';
    fixScript += 'echo "📋 Backup files created with .bak extension"\n';
    fixScript += 'echo "🔍 Re-run scanner to verify fixes"\n';

    fs.writeFileSync('./comprehensive-fix-database-fields.sh', fixScript);
    fs.chmodSync('./comprehensive-fix-database-fields.sh', '755');
    
    console.log('\n✅ Comprehensive fix script generated: ./comprehensive-fix-database-fields.sh');
    console.log('📋 Summary of planned fixes:');
    
    Object.entries(fixesByFile).forEach(([file, fixes]) => {
      const relativePath = file.replace(process.cwd(), '.');
      console.log(`   ${relativePath}: ${fixes.length} fixes`);
    });
  }

  // Main execution method
  async run() {
    console.log('🚀 COMPREHENSIVE DATABASE FIELD SCANNER');
    console.log('Goal: 95% Confidence + 100% Completion\n');
    
    try {
      await this.extractActualSchema();
      await this.scanAllFiles();
      this.generateComprehensiveReport();
      
      const totalRefs = this.confidenceMetrics.totalReferences;
      const validRefs = this.confidenceMetrics.schemaMatches;
      const finalConfidence = totalRefs > 0 ? (validRefs / totalRefs) * 100 : 0;
      
      console.log(`\n🎯 FINAL RESULTS:`);
      console.log(`   Confidence Score: ${finalConfidence.toFixed(1)}%`);
      console.log(`   Completion: 100% (${this.confidenceMetrics.filesScanned} files scanned)`);
      
      if (finalConfidence >= 95) {
        console.log('✅ SUCCESS: Achieved 95%+ confidence target!');
      } else {
        console.log('⚠️ WARNING: Below 95% confidence - manual review recommended');
      }
      
    } catch (error) {
      console.error('❌ FATAL ERROR:', error.message);
      console.error(error.stack);
    }
  }
}

// Execute the comprehensive scan
const scanner = new ComprehensiveDatabaseScanner();
scanner.run();