#!/usr/bin/env node
/**
 * Migrates Jasmine focus/skip syntax to Vitest
 * - fdescribe → describe.only
 * - fit → it.only
 * - xdescribe → describe.skip
 * - xit → it.skip
 */

import fs from 'fs';
import path from 'path';
import globPkg from 'glob';
const { glob } = globPkg;

const migrations = [
  { pattern: /\bfdescribe\s*\(/g, replacement: 'describe.only(' },
  { pattern: /\bfit\s*\(/g, replacement: 'it.only(' },
  { pattern: /\bxdescribe\s*\(/g, replacement: 'describe.skip(' },
  { pattern: /\bxit\s*\(/g, replacement: 'it.skip(' },
];

async function migrateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let changed = false;

  for (const { pattern, replacement } of migrations) {
    if (pattern.test(newContent)) {
      newContent = newContent.replace(pattern, replacement);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ Migrated: ${filePath}`);
    return true;
  }

  return false;
}

async function main() {
  console.log('🔍 Finding test files...\n');

  const testFiles = glob.sync('src/**/__tests__/**/*.test.{js,jsx}', {
    absolute: true,
  });

  console.log(`Found ${testFiles.length} test files\n`);

  let migratedCount = 0;

  for (const file of testFiles) {
    if (await migrateFile(file)) {
      migratedCount++;
    }
  }

  console.log(`\n✨ Migration complete!`);
  console.log(`   ${migratedCount} file(s) updated`);
  console.log(`   ${testFiles.length - migratedCount} file(s) unchanged`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

