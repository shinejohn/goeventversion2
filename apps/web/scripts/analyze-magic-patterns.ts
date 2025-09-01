// apps/web/scripts/analyze-magic-patterns.ts
import { Project, SyntaxKind } from 'ts-morph';
import fs from 'fs-extra';
import path from 'path';
import { z } from 'zod';

const MAGIC_PATTERNS_DIR = path.resolve('../../../magic/src');
const OUTPUT_DIR = './app/components/magic-patterns';
const TYPES_OUTPUT = './app/types/magic-patterns.ts';

async function analyzeMagicPatterns() {
  console.log('🔍 Analyzing Magic Patterns components...');
  console.log('📁 Looking in:', MAGIC_PATTERNS_DIR);
  
  const project = new Project({
    tsConfigFilePath: './tsconfig.json',
  });
  
  // Ensure output directories exist
  await fs.ensureDir(OUTPUT_DIR);
  await fs.ensureDir(path.dirname(TYPES_OUTPUT));
  
  // Copy Magic Patterns components (READ-ONLY)
  await fs.copy(MAGIC_PATTERNS_DIR, OUTPUT_DIR, {
    overwrite: false,
    filter: (src) => {
      // Only copy .tsx, .ts, .css files
      return /\.(tsx?|css)$/.test(src) || fs.lstatSync(src).isDirectory();
    }
  });
  
  // Mark directory as read-only
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'README.md'),
    '# ⚠️ MAGIC PATTERNS COMPONENTS - DO NOT MODIFY\n\nThese components are auto-copied from Magic Patterns.\nANY MODIFICATIONS WILL BE LOST.\n\nTo customize, create wrapper components in /app/components/containers/'
  );
  
  // Analyze components and extract types
  const sourceFiles = project.addSourceFilesAtPaths(
    `${OUTPUT_DIR}/**/*.{ts,tsx}`
  );
  
  console.log(`📄 Found ${sourceFiles.length} source files to analyze`);
  
  const componentTypes: string[] = [];
  const components: { name: string; path: string; hasProps: boolean }[] = [];
  
  for (const file of sourceFiles) {
    const filePath = file.getFilePath();
    const relativePath = path.relative(OUTPUT_DIR, filePath);
    
    // Skip non-component files
    if (filePath.includes('index.') || filePath.includes('.test.') || filePath.includes('.stories.')) {
      continue;
    }
    
    console.log(`\n📄 Analyzing: ${relativePath}`);
    
    const interfaces = file.getInterfaces();
    
    for (const int of interfaces) {
      const intName = int.getName();
      if (intName && intName.endsWith('Props')) {
        console.log(`  🧩 Found interface: ${intName}`);
        const properties = int.getProperties();
        
        // Generate Zod schema
        let zodSchema = `export const ${intName}Schema = z.object({\n`;
        
        properties.forEach(prop => {
          const propName = prop.getName();
          const propType = prop.getType().getText();
          const isOptional = prop.hasQuestionToken();
          
          // Simple type mapping (extend as needed)
          let zodType = 'z.unknown()';
          if (propType === 'string') zodType = 'z.string()';
          else if (propType === 'number') zodType = 'z.number()';
          else if (propType === 'boolean') zodType = 'z.boolean()';
          else if (propType.includes('[]')) zodType = 'z.array(z.unknown())';
          else if (propType.includes('Date')) zodType = 'z.date()';
          else if (propType.includes('{') && propType.includes('}')) zodType = 'z.record(z.unknown())';
          
          if (isOptional) zodType += '.optional()';
          
          zodSchema += `  ${propName}: ${zodType},\n`;
        });
        
        zodSchema += '});\n\n';
        componentTypes.push(zodSchema);
        
        // Export type from Zod schema
        componentTypes.push(
          `export type ${intName} = z.infer<typeof ${intName}Schema>;\n\n`
        );
        
        components.push({
          name: intName.replace('Props', ''),
          path: relativePath,
          hasProps: true
        });
      }
    }
    
    // Check for React components even without explicit Props interface
    const defaultExport = file.getDefaultExportSymbol();
    if (defaultExport && !components.find(c => c.path === relativePath)) {
      const componentName = path.basename(filePath, path.extname(filePath));
      console.log(`  🧩 Found component without Props interface: ${componentName}`);
      
      components.push({
        name: componentName,
        path: relativePath,
        hasProps: false
      });
    }
  }
  
  // Write types file
  await fs.writeFile(
    TYPES_OUTPUT,
    `// Auto-generated types from Magic Patterns components\n` +
    `// DO NOT EDIT - Run 'pnpm analyze:mp' to regenerate\n\n` +
    `import { z } from 'zod';\n\n` +
    componentTypes.join('')
  );
  
  // Generate component registry
  const componentRegistry = `// Auto-generated component registry
// DO NOT EDIT - Run 'pnpm analyze:mp' to regenerate

export const MagicPatternsComponents = {
${components.map(c => `  '${c.name}': () => import('./${c.path}'),`).join('\n')}
} as const;

export type MagicPatternsComponentName = keyof typeof MagicPatternsComponents;
`;
  
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'index.ts'),
    componentRegistry
  );
  
  console.log('\n✅ Magic Patterns analysis complete!');
  console.log(`📁 Components copied to: ${OUTPUT_DIR}`);
  console.log(`📝 Types generated at: ${TYPES_OUTPUT}`);
  console.log(`🧩 Found ${components.length} components (${components.filter(c => c.hasProps).length} with Props interfaces)`);
}

analyzeMagicPatterns().catch(console.error);