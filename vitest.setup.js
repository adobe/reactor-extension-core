/**
 * Vitest setup file - runs before all tests
 */

import '@testing-library/jest-dom';
import { expect, beforeEach, vi } from 'vitest';
import Simulate from 'simulate';

// ============================================================
// Jasmine Compatibility Shims for Vitest
// ============================================================

/**
 * Jasmine-compatible API for Vitest
 * Minimal shims for patterns not yet migrated
 */
globalThis.jasmine = {
  // jasmine.clock() → vi fake timers
  clock: () => ({
    install: () => vi.useFakeTimers(),
    uninstall: () => vi.useRealTimers(),
    tick: (ms) => vi.advanceTimersByTime(ms),
    mockDate: (date) => vi.setSystemTime(date),
  }),
};

// Make Simulate available globally for tests that need it
globalThis.Simulate = Simulate;

// Set up turbine and require mocks (from mockDelegateWrapper.js logic)
import process from 'process';
globalThis.process = process;
process.env.NODE_ENV = 'test';

// Initialize turbine mock
function setupGlobals() {
  // Reset window._satellite
  if (typeof window !== 'undefined') {
    window._satellite = {};
  }

  // Setup turbine
  globalThis.turbine = {
    buildInfo: {
      turbineVersion: '1.0.0',
      buildDate: '2020-01-01T00:00:00.000Z',
    },
    logger: {
      log: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    },
    debugEnabled: false,
    getExtensionSettings: () => ({}),
    getHostedLibFileUrl: (file) => `https://example.com/${file}`,
    getSharedModule: () => ({}),
  };

  // Setup require mock
  globalThis.require = (path) => {
    if (path === '@adobe/reactor-window') {
      return window;
    }
    if (path === '@adobe/reactor-document') {
      return document;
    }
    if (path === '@adobe/reactor-cookie') {
      return {
        get: () => null,
        set: () => {},
        remove: () => {},
      };
    }
    if (path === '@adobe/reactor-query-string') {
      return {
        parse: () => ({}),
      };
    }
    throw new Error(`Module not found: ${path}`);
  };
}

// Setup before each test
beforeEach(() => {
  setupGlobals();
});

// Global mock functions for tests
globalThis.mockTurbineVariable = function (turbineDefinition) {
  if (typeof globalThis.turbine === 'undefined') {
    console.warn('globalThis.turbine was not defined before mockTurbineVariable was called.');
  }
  globalThis.turbine = turbineDefinition;
};

// Add custom matchers if needed
expect.extend({
  // Add any custom matchers here
});

