#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface QueryInfo {
  file: string;
  lineNumber: number;
  query: string;
  table: string;
  columns: string[];
  joins: string[];
}

interface TableSchema {
  name: string;
  expectedColumns: Set<string>;
  expectedRelations: Set<string>;
}

const queries: QueryInfo[] = [];
const tableSchemas: Map<string, TableSchema> = new Map();

// Extract table name from various query patterns
function extractTableName(query: string): string | null {
  const patterns = [
    /from\s*\(\s*['"]([^'"]+)['"]\s*\)/i,
    /\.from\s*\(\s*['"]([^'"]+)['"]\s*\)/i,
    /rpc\s*\(\s*['"]([^'"]+)['"]/i,
  ];
  
  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// Extract column names from select statements
function extractColumns(query: string): string[] {
  const columns: string[] = [];
  
  // Match .select('column1, column2') patterns
  const selectMatch = query.match(/\.select\s*\(\s*['"`]([^'"`]+)['"`]/);
  if (selectMatch) {
    const selectContent = selectMatch[1];
    
    // Parse regular columns
    const columnParts = selectContent.split(',').map(s => s.trim());
    for (const part of columnParts) {
      // Skip joins and complex expressions
      if (!part.includes('(') && !part.includes(':')) {
        if (part === '*') {
          columns.push('*');
        } else {
          columns.push(part);
        }
      }
      
      // Handle renamed columns like "column:alias"
      const aliasMatch = part.match(/^([^:]+):/);
      if (aliasMatch && !part.includes('(')) {
        columns.push(aliasMatch[1]);
      }
    }
  }
  
  // Match .eq, .filter, etc patterns
  const filterPatterns = [
    /\.eq\s*\(\s*['"]([^'"]+)['"]/g,
    /\.gt\s*\(\s*['"]([^'"]+)['"]/g,
    /\.gte\s*\(\s*['"]([^'"]+)['"]/g,
    /\.lt\s*\(\s*['"]([^'"]+)['"]/g,
    /\.lte\s*\(\s*['"]([^'"]+)['"]/g,
    /\.like\s*\(\s*['"]([^'"]+)['"]/g,
    /\.ilike\s*\(\s*['"]([^'"]+)['"]/g,
    /\.in\s*\(\s*['"]([^'"]+)['"]/g,
    /\.contains\s*\(\s*['"]([^'"]+)['"]/g,
    /\.order\s*\(\s*['"]([^'"]+)['"]/g,
  ];
  
  for (const pattern of filterPatterns) {
    const matches = query.matchAll(pattern);
    for (const match of matches) {
      columns.push(match[1]);
    }
  }
  
  return [...new Set(columns)];
}

// Extract joins and relations
function extractJoins(query: string): string[] {
  const joins: string[] = [];
  
  // Match join patterns in select
  const selectMatch = query.match(/\.select\s*\(\s*['"`]([^'"`]+)['"`]/);
  if (selectMatch) {
    const selectContent = selectMatch[1];
    
    // Find relation patterns like "table:foreign_key(columns)"
    const relationPattern = /(\w+):(\w+)(?:\(([^)]+)\))?/g;
    const matches = selectContent.matchAll(relationPattern);
    
    for (const match of matches) {
      const [, alias, relation] = match;
      joins.push(`${alias || relation}:${relation}`);
    }
  }
  
  return joins;
}

// Scan a file for Supabase queries
function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let currentQuery = '';
  let queryStartLine = -1;
  let insideQuery = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect query start
    if ((line.includes('.from(') || line.includes('.rpc(')) && !insideQuery) {
      insideQuery = true;
      queryStartLine = i;
      currentQuery = line;
    } else if (insideQuery) {
      currentQuery += '\n' + line;
      
      // Simple heuristic to detect query end
      // Count opening and closing parentheses
      const openCount = (currentQuery.match(/\(/g) || []).length;
      const closeCount = (currentQuery.match(/\)/g) || []).length;
      
      if (closeCount >= openCount || line.includes('await') || line.includes('return')) {
        // Process the query
        const tableName = extractTableName(currentQuery);
        if (tableName) {
          const columns = extractColumns(currentQuery);
          const joins = extractJoins(currentQuery);
          
          queries.push({
            file: filePath,
            lineNumber: queryStartLine + 1,
            query: currentQuery.trim(),
            table: tableName,
            columns,
            joins,
          });
          
          // Update table schema expectations
          if (!tableSchemas.has(tableName)) {
            tableSchemas.set(tableName, {
              name: tableName,
              expectedColumns: new Set(),
              expectedRelations: new Set(),
            });
          }
          
          const schema = tableSchemas.get(tableName)!;
          columns.forEach(col => schema.expectedColumns.add(col));
          joins.forEach(join => schema.expectedRelations.add(join));
        }
        
        // Reset for next query
        insideQuery = false;
        currentQuery = '';
        queryStartLine = -1;
      }
    }
  }
}

// Main execution
async function main() {
  console.log('Scanning for database queries...\n');
  
  // Find all route files
  const routeFiles = glob.sync(
    '/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/apps/web/app/routes/**/*.{ts,tsx}',
    { ignore: ['**/*.test.*', '**/*.spec.*', '**/*+types*'] }
  );
  
  // Also scan component files that might have data access
  const componentFiles = glob.sync(
    '/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/apps/web/app/components/**/*.{ts,tsx}',
    { ignore: ['**/*.test.*', '**/*.spec.*'] }
  );
  
  const allFiles = [...routeFiles, ...componentFiles];
  
  console.log(`Found ${allFiles.length} files to scan\n`);
  
  // Scan each file
  for (const file of allFiles) {
    scanFile(file);
  }
  
  // Generate report
  console.log(`\nFound ${queries.length} database queries\n`);
  
  console.log('## Tables and Expected Schema:\n');
  
  const sortedTables = Array.from(tableSchemas.values()).sort((a, b) => a.name.localeCompare(b.name));
  
  for (const table of sortedTables) {
    console.log(`### Table: ${table.name}`);
    console.log('Expected columns:', Array.from(table.expectedColumns).sort().join(', '));
    if (table.expectedRelations.size > 0) {
      console.log('Expected relations:', Array.from(table.expectedRelations).sort().join(', '));
    }
    console.log('');
  }
  
  // Group queries by table
  const queriesByTable = new Map<string, QueryInfo[]>();
  for (const query of queries) {
    if (!queriesByTable.has(query.table)) {
      queriesByTable.set(query.table, []);
    }
    queriesByTable.get(query.table)!.push(query);
  }
  
  console.log('\n## Queries by Table:\n');
  
  for (const [table, tableQueries] of queriesByTable) {
    console.log(`### ${table} (${tableQueries.length} queries)`);
    for (const query of tableQueries) {
      const relativeFile = query.file.replace('/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/', '');
      console.log(`- ${relativeFile}:${query.lineNumber}`);
    }
    console.log('');
  }
  
  // Save detailed results
  const results = {
    timestamp: new Date().toISOString(),
    totalQueries: queries.length,
    tables: Array.from(tableSchemas.values()).map(schema => ({
      name: schema.name,
      expectedColumns: Array.from(schema.expectedColumns),
      expectedRelations: Array.from(schema.expectedRelations),
    })),
    queries: queries.map(q => ({
      ...q,
      file: q.file.replace('/users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun/', ''),
    })),
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'data-access-analysis.json'),
    JSON.stringify(results, null, 2)
  );
  
  // Also save a summary
  fs.writeFileSync(
    path.join(__dirname, 'data-access-summary.txt'),
    generateSummaryReport()
  );
  
  console.log('\nDetailed analysis saved to: scripts/data-access-analysis.json');
  console.log('Summary saved to: scripts/data-access-summary.txt');
}

function generateSummaryReport(): string {
  let report = 'DATA ACCESS ANALYSIS SUMMARY\n';
  report += '===========================\n\n';
  
  const sortedTables = Array.from(tableSchemas.values()).sort((a, b) => a.name.localeCompare(b.name));
  
  for (const table of sortedTables) {
    report += `TABLE: ${table.name}\n`;
    report += `Columns: ${Array.from(table.expectedColumns).sort().join(', ')}\n`;
    if (table.expectedRelations.size > 0) {
      report += `Relations: ${Array.from(table.expectedRelations).sort().join(', ')}\n`;
    }
    report += '\n';
  }
  
  return report;
}

main().catch(console.error);