/**
 * Vitest setup file - runs before all tests
 */

import '@testing-library/jest-dom';
import { expect, beforeEach, vi } from 'vitest';
import Simulate from 'simulate';

// Make Simulate available globally for tests that need it
globalThis.Simulate = Simulate;

// Fix for React Spectrum Provider expecting specific DOM structure
// The Provider component tries to inject Typekit styles but fails in JSDOM
// Add missing DOM elements that React Spectrum expects
if (typeof document !== 'undefined') {
  // Ensure document.head exists and has parentNode
  if (!document.head) {
    const head = document.createElement('head');
    if (document.documentElement) {
      document.documentElement.insertBefore(head, document.body);
    }
  }
  
  // Ensure document.documentElement exists
  if (!document.documentElement) {
    const html = document.createElement('html');
    while (document.firstChild) {
      html.appendChild(document.firstChild);
    }
    document.appendChild(html);
  }
}

// Mock IntersectionObserver for JSDOM (not available by default)
// This was implicitly available in Karma through polyfills
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  class IntersectionObserverMock {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observedElements = new Set();
    }

    observe(element) {
      this.observedElements.add(element);
      // Immediately trigger callback as if element is intersecting
      // Tests can override this behavior if needed
      this.callback([{
        target: element,
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRect: element.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now()
      }], this);
    }

    unobserve(element) {
      this.observedElements.delete(element);
    }

    disconnect() {
      this.observedElements.clear();
    }

    takeRecords() {
      return [];
    }
  }

  window.IntersectionObserver = IntersectionObserverMock;
  global.IntersectionObserver = IntersectionObserverMock;
}

// Set up turbine and require mocks (from mockDelegateWrapper.js logic)
import process from 'process';
globalThis.process = process;
process.env.NODE_ENV = 'test';

// Initialize window._satellite IMMEDIATELY before any imports
// This must happen at setup file load time, not in beforeEach()
// because source files try to set properties on _satellite at import time
if (typeof window !== 'undefined') {
  window._satellite = {};
}

// Initialize turbine mock
function setupGlobals() {
  // Reset window._satellite (keep the object, just clear properties)
  if (typeof window !== 'undefined') {
    // Don't replace the object, just clear it
    Object.keys(window._satellite).forEach(key => {
      delete window._satellite[key];
    });
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

// Setup before each test to reset state
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

