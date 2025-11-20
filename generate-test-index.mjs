#!/usr/bin/env node

import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';

const testFiles = fg.sync('./src/**/__tests__/**/*.test.{js,jsx}');

const imports = testFiles
  .map(f => `import '${f.replace(/\\/g, '/')}';`)
  .join('\n');

const output = `
// AUTO-GENERATED TEST INDEX
// Import mock globals first
import './helpers/mockDelegateWrapper.js';

${imports}
`;

const outFile = path.resolve('./testIndex.generated.js');
fs.writeFileSync(outFile, output);

console.log(`✅ Generated ${outFile} with ${testFiles.length} test files.`);
