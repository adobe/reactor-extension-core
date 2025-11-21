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
 * Allows existing Jasmine tests to run without modification
 */
globalThis.jasmine = {
  // jasmine.createSpy() → vi.fn() with Jasmine-compatible .calls API
  createSpy: (name) => {
    const spy = vi.fn().mockName(name || 'spy');
    
    // Add Jasmine-compatible .calls API
    Object.defineProperty(spy, 'calls', {
      get() {
        return {
          count: () => spy.mock.calls.length,
          all: () => spy.mock.calls.map((args, index) => ({
            args,
            returnValue: spy.mock.results[index]?.value
          })),
          mostRecent: () => {
            const calls = spy.mock.calls;
            const results = spy.mock.results;
            if (calls.length === 0) return undefined;
            return {
              args: calls[calls.length - 1],
              returnValue: results[results.length - 1]?.value
            };
          },
          first: () => {
            const calls = spy.mock.calls;
            const results = spy.mock.results;
            if (calls.length === 0) return undefined;
            return {
              args: calls[0],
              returnValue: results[0]?.value
            };
          },
          reset: () => spy.mockClear()
        };
      }
    });
    
    // Add Jasmine-compatible .and API
    spy.and = {
      returnValue: (value) => spy.mockReturnValue(value),
      returnValues: (...values) => spy.mockReturnValueOnce(...values),
      callThrough: () => spy.mockImplementation(function(...args) {
        return this?.constructor?.prototype?.[name]?.apply(this, args);
      }),
      callFake: (fn) => spy.mockImplementation(fn),
      throwError: (error) => spy.mockImplementation(() => {
        throw typeof error === 'string' ? new Error(error) : error;
      }),
      stub: () => spy.mockReset()
    };
    
    return spy;
  },
  
  // jasmine.createSpyObj() → object with multiple vi.fn()
  createSpyObj: (baseName, methodNames) => {
    const obj = {};
    methodNames.forEach((method) => {
      obj[method] = jasmine.createSpy(`${baseName}.${method}`);
    });
    return obj;
  },
  
  // jasmine.any() → expect.any()
  any: (constructor) => expect.any(constructor),
  
  // jasmine.anything() → expect.anything()
  anything: () => expect.anything(),
  
  // jasmine.objectContaining() → expect.objectContaining()
  objectContaining: (obj) => expect.objectContaining(obj),
  
  // jasmine.arrayContaining() → expect.arrayContaining()
  arrayContaining: (arr) => expect.arrayContaining(arr),
  
  // jasmine.stringMatching() → expect.stringMatching()
  stringMatching: (str) => expect.stringMatching(str),
  
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

