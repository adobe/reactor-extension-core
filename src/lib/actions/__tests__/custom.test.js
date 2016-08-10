'use strict';

var publicRequire = require('../../__tests__/helpers/publicRequire');
var Promise = publicRequire('promise');
var injectDelegate = require('inject!../custom');

var getInjectedDelegate = function(options) {
  options = options || {};
  return injectDelegate({
    'load-script': options.loadScript || publicRequire('load-script'),
    'get-var': options.getVar || publicRequire('get-var'),
    'logger': options.logger || publicRequire('logger'),
    'once': publicRequire('once')
  });
};

describe('custom action delegate', function() {
  it('appropriately executes command sequence before page is loaded', function(done) {
    var domContentLoadedListeners = [];

    spyOn(document, 'addEventListener').and.callFake(function(type, listener) {
      if (type === 'DOMContentLoaded') {
        domContentLoadedListeners.push(listener);
      }
    });

    var simulateDomContentLoaded = function() {
      domContentLoadedListeners.forEach(function(listener) {
        listener();
      });
    };

    spyOn(document, 'write');
    spyOn(document.body, 'appendChild');

    var mockLoadScript = jasmine.createSpy().and.callFake(function() {
      return new Promise(function() {});
    });

    var mockGetVar = jasmine.createSpy().and.returnValue('bar');

    var delegate = getInjectedDelegate({
      loadScript: mockLoadScript,
      getVar: mockGetVar
    });

    var aRelatedElement = {};
    var aEvent = {
      target: {}
    };
    delegate({
      name: 'A Code',
      codeId: 'a',
      source: '//example.com/files/a.js',
      language: 'javascript',
      global: false,
      sequential: true
    }, aRelatedElement, aEvent);

    var bRelatedElement = {};
    var bEvent = {
      target: {}
    };
    delegate({
      name: 'B Code',
      codeId: 'b',
      source: '//example.com/files/b.js',
      language: 'javascript',
      sequential: false
    }, bRelatedElement, bEvent);

    var cRelatedElement = {};
    var cEvent = {
      target: {}
    };
    delegate({
      name: 'C Code',
      codeId: 'c',
      source: '//example.com/files/c.js',
      language: 'javascript',
      global: true,
      sequential: true
    }, cRelatedElement, cEvent);

    var dRelatedElement = {};
    var dEvent = {
      target: {}
    };
    delegate({
      name: 'D Code',
      codeId: 'd',
      source: '//example.com/files/d.html',
      language: 'html',
      sequential: false,
      tokens: ['foo']
    }, dRelatedElement, dEvent);

    var eRelatedElement = {};
    var eEvent = {
      target: {}
    };
    delegate({
      name: 'E Code',
      codeId: 'e',
      source: '\u003cscript\u003econsole.log("test");\u003c/script\u003e',
      language: 'html',
      sequential: true
    }, eRelatedElement, eEvent);

    // Writing of script tags occurs right away because we essentially let the browser
    // enforce any sequentiality.

    // Item A
    expect(document.write.calls.argsFor(0)).toEqual([
      '<script src="//example.com/files/a.js" data-dtmblockingcodeid="a"></script>'
    ]);

    // Item B
    expect(mockLoadScript.calls.argsFor(0)).toEqual([
      '//example.com/files/b.js'
    ]);

    // Item C
    expect(document.write.calls.argsFor(1)).toEqual([
      '<script src="//example.com/files/c.js" data-dtmblockingcodeid="c"></script>'
    ]);

    // Item D
    // It waits until DOMContentLoaded before adding the iframe to body.
    expect(document.body.appendChild.calls.count()).toBe(0);

    // Item E
    expect(document.write.calls.argsFor(2)).toEqual([
      '\u003cscript\u003econsole.log("test");\u003c/script\u003e'
    ]);

    // Simulate Item A load completion
    var aCallbackSpy = jasmine.createSpy();
    _satellite._customJSLoaded('a', aCallbackSpy);

    expect(aCallbackSpy.calls.count()).toBe(1);
    expect(aCallbackSpy.calls.first()).toEqual({
      object: aRelatedElement,
      args: [
        aEvent,
        aEvent.target
      ],
      returnValue: undefined
    });

    // Simulate Item C load completion
    // Item C is global so it has no callback. Just make sure it doesn't throw errors.
    _satellite._customJSLoaded('c');

    simulateDomContentLoaded();

    // Simulate Item B load completion.
    var bCallbackSpy = jasmine.createSpy();
    _satellite._customJSLoaded('b', bCallbackSpy);

    expect(bCallbackSpy.calls.count()).toBe(1);
    expect(bCallbackSpy.calls.first()).toEqual({
      object: bRelatedElement,
      args: [
        bEvent,
        bEvent.target
      ],
      returnValue: undefined
    });

    // Loading of item D continues now that DOMContentLoaded has occurred and the body element is
    // available.
    var iframe = document.body.appendChild.calls.argsFor(0)[0];
    expect(iframe).toEqual(jasmine.any(HTMLIFrameElement));
    expect(iframe.src).toEqual('http://example.com/files/d.html?foo=bar');

    setTimeout(function() {
      expect(delegate.__isMemoryCleanedUp()).toBe(true);
      done();
    });
  });

  it('appropriately executes command sequence after page is loaded', function(done) {
    spyOn(document, 'addEventListener').and.callFake(function(type, listener) {
      if (type === 'DOMContentLoaded') {
        listener();
      }
    });

    spyOn(document.body, 'appendChild');

    var mockLoadScriptPromiseResolvers = [];
    var mockLoadScript = jasmine.createSpy().and.callFake(function() {
      return new Promise(function(resolve, reject) {
        mockLoadScriptPromiseResolvers.push(resolve);
      });
    });

    var mockGetVar = jasmine.createSpy().and.returnValue('bar');

    var mockLogger = {
      error: jasmine.createSpy()
    };

    var delegate = getInjectedDelegate({
      loadScript: mockLoadScript,
      getVar: mockGetVar,
      logger: mockLogger
    });

    var aRelatedElement = {};
    var aEvent = {
      target: {}
    };
    delegate({
      name: 'A Code',
      codeId: 'a',
      source: '//example.com/files/a.js',
      language: 'javascript',
      global: false,
      sequential: true
    }, aRelatedElement, aEvent);

    var bRelatedElement = {};
    var bEvent = {
      target: {}
    };
    delegate({
      name: 'B Code',
      codeId: 'b',
      source: '//example.com/files/b.js',
      language: 'javascript',
      sequential: false
    }, bRelatedElement, bEvent);

    var cRelatedElement = {};
    var cEvent = {
      target: {}
    };
    delegate({
      name: 'C Code',
      codeId: 'c',
      source: '//example.com/files/c.js',
      language: 'javascript',
      global: true,
      sequential: true
    }, cRelatedElement, cEvent);

    var dRelatedElement = {};
    var dEvent = {
      target: {}
    };
    delegate({
      name: 'D Code',
      codeId: 'd',
      source: '//example.com/files/d.html',
      language: 'html',
      sequential: false,
      tokens: ['foo']
    }, dRelatedElement, dEvent);

    var eRelatedElement = {};
    var eEvent = {
      target: {}
    };
    delegate({
      name: 'E Code',
      codeId: 'e',
      source: '\u003cscript\u003econsole.log("test");\u003c/script\u003e',
      language: 'html',
      sequential: true
    }, eRelatedElement, eEvent);

    // Item A
    // mockWriteHtml should fail because the page has loaded. Because of this, a script element will
    // be created and added to the document (via loadScript) and subsequent sequential items won't
    // be executed until the first script finishes loading.
    expect(mockLoadScript.calls.argsFor(0)).toEqual([
      '//example.com/files/a.js'
    ]);

    // Item B should begin loading immediately because it's non-sequential
    expect(mockLoadScript.calls.argsFor(1)).toEqual([
      '//example.com/files/b.js'
    ]);

    // Item C should not have started loading yet.
    expect(mockLoadScript.calls.count()).toBe(2);

    // Item D should begin loading immediately because it's non-sequential
    expect(document.body.appendChild.calls.argsFor(0)).toEqual([
      jasmine.any(HTMLIFrameElement)
    ]);

    // Simulate Item A load completion
    mockLoadScriptPromiseResolvers[0]();
    var aCallbackSpy = jasmine.createSpy();
    _satellite._customJSLoaded('a', aCallbackSpy);

    expect(aCallbackSpy.calls.count()).toBe(1);
    expect(aCallbackSpy.calls.first()).toEqual({
      object: aRelatedElement,
      args: [
        aEvent,
        aEvent.target
      ],
      returnValue: undefined
    });

    // Simulate Item B load completion.
    mockLoadScriptPromiseResolvers[1]();
    var bCallbackSpy = jasmine.createSpy();
    _satellite._customJSLoaded('b', bCallbackSpy);

    expect(bCallbackSpy.calls.count()).toBe(1);
    expect(bCallbackSpy.calls.first()).toEqual({
      object: bRelatedElement,
      args: [
        bEvent,
        bEvent.target
      ],
      returnValue: undefined
    });

    // The load script promise resolves asynchronously so we have to use setTimeout before
    /// checking that the next item has started to load.
    setTimeout(function() {
      // Item C should have started loading now that A is complete
      expect(mockLoadScript.calls.count()).toBe(3);
      expect(mockLoadScript.calls.argsFor(2)).toEqual([
        '//example.com/files/c.js'
      ]);

      // Made sure Item E hasn't started yet.
      expect(mockLogger.error.calls.count()).toBe(0);

      // Simulate Item C load completion
      // Item C is global so it has no callback. Just make sure it doesn't throw errors.
      mockLoadScriptPromiseResolvers[2]();
      _satellite._customJSLoaded('c');

      // Simulate Item E which tries to write sequential HTML after DOMContentLoaded and
      // should fail.
      setTimeout(function() {
        expect(mockLogger.error.calls.count()).toBe(1);
        expect(mockLogger.error.calls.argsFor(0)).toEqual([
          'Unable to write sequential HTML for E Code. Sequential HTML ' +
          'is not supported for rules that fire after the page has loaded.'
        ]);

        setTimeout(function() {
          expect(delegate.__isMemoryCleanedUp()).toBe(true);
          done();
        });
      });
    });
  });

  it('continues to the next sequential item when a sequential item fails to load', function(done) {
    // We only test this assuming DOMContentLoaded has already fired. Before it fires, all items
    // are document.write'd out and we let the browser take care of sequentiality.
    spyOn(document, 'addEventListener').and.callFake(function(type, listener) {
      if (type === 'DOMContentLoaded') {
        listener();
      }
    });

    var mockLoadScriptPromiseRejectors = [];
    var mockLoadScript = jasmine.createSpy().and.callFake(function() {
      return new Promise(function(resolve, reject) {
        mockLoadScriptPromiseRejectors.push(reject);
      });
    });

    var mockLogger = {
      error: jasmine.createSpy()
    };

    var delegate = getInjectedDelegate({
      loadScript: mockLoadScript,
      logger: mockLogger
    });

    delegate({
      name: 'A Code',
      codeId: 'a',
      source: '//example.com/files/a.js',
      language: 'javascript',
      sequential: true
    });

    delegate({
      name: 'B Code',
      codeId: 'b',
      source: '\u003cscript\u003econsole.log("test");\u003c/script\u003e',
      language: 'html',
      sequential: true
    });

    delegate({
      name: 'C Code',
      codeId: 'c',
      source: '//example.com/files/c.js',
      language: 'javascript',
      sequential: true
    });

    expect(mockLoadScript.calls.count()).toBe(1);

    // Simulate Item A failing to load.
    mockLoadScriptPromiseRejectors[0]();

    // Promises are resolved/rejected asynchronously so we have to setTimeout.
    setTimeout(function() {
      // Item B fails.
      expect(mockLogger.error.calls.count(1));

      // Item C should immediately start loading.
      expect(mockLoadScript.calls.count()).toBe(2);

      // Simulate Item C failing to load.
      mockLoadScriptPromiseRejectors[1]();

      setTimeout(function() {
        // Make sure memory is cleaned up.
        expect(delegate.__isMemoryCleanedUp()).toBe(true);

        done();
      });
    });
  });

  // Cover any memory cleanup scenarios that aren't covered in the previous tests.

  it('cleans up memory when pre-page-load sequential JavaScript fails to load', function() {
    spyOn(document, 'write');

    // The delegate will watch for an error event coming from window. We'll call its callback
    // with the event.
    spyOn(window, 'addEventListener').and.callFake(function(type, callback) {
      var event = {
        target: {
          hasAttribute: function() {
            return true;
          },
          getAttribute: function() {
            return 'a';
          }
        }
      };

      callback(event);
    });

    var delegate = getInjectedDelegate();

    delegate({
      name: 'A Code',
      codeId: 'a',
      source: '//example.com/files/a.js',
      language: 'javascript',
      sequential: true
    });

    expect(window.addEventListener.calls.argsFor(0)).toEqual([
      'error',
      jasmine.any(Function),
      true
    ]);
    expect(delegate.__isMemoryCleanedUp()).toBe(true);
  });

  it('cleans up memory when non-sequential JavaScript fails to load', function(done) {
    var mockLoadScript = jasmine.createSpy().and.callFake(function() {
      return Promise.reject();
    });

    var delegate = getInjectedDelegate({
      loadScript: mockLoadScript
    });

    delegate({
      name: 'A Code',
      codeId: 'a',
      source: '//example.com/files/a.js',
      language: 'javascript',
      sequential: false
    });

    expect(mockLoadScript.calls.argsFor(0)).toEqual([
      '//example.com/files/a.js'
    ]);

    setTimeout(function() {
      expect(delegate.__isMemoryCleanedUp()).toBe(true);
      done();
    });
  });
});
