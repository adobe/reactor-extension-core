#!/usr/bin/env node
/**
 * Script to convert Jasmine matchers to Vitest matchers
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { join, extname } from 'path';

// Matcher conversions
const conversions = [
  // Jasmine-specific matchers that don't exist in Vitest
  { from: /\.toBeTrue\(\)/g, to: '.toBe(true)', name: 'toBeTrue → toBe(true)' },
  { from: /\.toBeFalse\(\)/g, to: '.toBe(false)', name: 'toBeFalse → toBe(false)' },
];

async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        yield* walkDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = extname(entry.name);
      if ((entry.name.includes('.test.js') || entry.name.includes('.test.jsx')) && 
          (ext === '.js' || ext === '.jsx')) {
        yield fullPath;
      }
    }
  }
}

async function migrateMatchers() {
  console.log('🔍 Finding test files...');
  
  const testFiles = [];
  for await (const file of walkDir('src')) {
    testFiles.push(file);
  }

  if (testFiles.length === 0) {
    console.log('No test files found');
    return;
  }

  console.log(`Found ${testFiles.length} test files\n`);

  let totalReplacements = 0;
  let filesUpdated = 0;

  for (const file of testFiles) {
    let content = await readFile(file, 'utf8');
    const originalContent = content;
    let fileReplacements = 0;

    // Apply each conversion
    for (const { from, to } of conversions) {
      const matches = content.match(from);
      if (matches) {
        fileReplacements += matches.length;
        content = content.replace(from, to);
      }
    }

    // Write back if changed
    if (content !== originalContent) {
      await writeFile(file, content, 'utf8');
      console.log(`✓ ${file} (${fileReplacements} replacements)`);
      totalReplacements += fileReplacements;
      filesUpdated++;
    }
  }

  console.log(`\n✨ Migration complete!`);
  console.log(`   ${totalReplacements} matchers converted`);
  console.log(`   ${filesUpdated} file(s) updated`);
  console.log(`   ${testFiles.length - filesUpdated} file(s) unchanged`);
}

migrateMatchers().catch(console.error);
