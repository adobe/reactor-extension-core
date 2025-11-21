#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read karma config
const { default: karmaConfig } = await import('../karma.conf.mjs');

// Extract config
let config = {};
karmaConfig({
  set: (cfg) => { config = cfg; }
});

// Check if all file patterns exist
const basePath = path.resolve(__dirname, '..', config.basePath || '');
const missingFiles = [];

config.files.forEach((file) => {
  const pattern = typeof file === 'string' ? file : file.pattern;
  if (pattern && !pattern.includes('*')) {
    const fullPath = path.resolve(basePath, pattern);
    if (!fs.existsSync(fullPath)) {
      missingFiles.push(pattern);
    }
  }
});

if (missingFiles.length > 0) {
  console.error('\n❌ ERROR: The following test files do not exist:\n');
  missingFiles.forEach(file => {
    console.error(`   - ${file}`);
  });
  console.error('\n');
  process.exit(1);
}

console.log('✅ All test file patterns are valid');

