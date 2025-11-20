/**
 * Setup test environment variables before tests run
 * This file is loaded before any test files and sets up process.env properly
 */

// The process polyfill provides an empty process.env object
// We need to populate it with the values we want for tests
if (typeof process !== 'undefined' && process.env) {
  process.env.NODE_ENV = 'test';
}

// For browsers that might not have the process polyfill loaded yet,
// we'll also set it on globalThis if it exists
if (typeof globalThis !== 'undefined') {
  if (!globalThis.process) {
    globalThis.process = { env: {} };
  }
  if (!globalThis.process.env) {
    globalThis.process.env = {};
  }
  globalThis.process.env.NODE_ENV = 'test';
}

