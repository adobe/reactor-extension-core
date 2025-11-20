/**
 * A real library looks like this:
 *
 * "script": function(module, exports, require, turbine) {
 *    var something = require('./some-module.js')
 *    module.exports = function(settings) {
 *      turbine.logger.log('hello');
 *    }
 * }
 *
 * In this context, module, require, and turbine were "free" variables wrapped
 * around the delegate code. We can't easily do that for our tests, so we'll
 * place "require" and "turbine" on globalThis for jasmine (not on window).
 *
 * We don't need to do anything for module.exports because the bundler in this
 * project handles those for us. and the globalThis require and turbine are
 * only necessary when running the tests, not when building the code bundles.
 */

/* START.TESTS_ONLY */
// make process available globally because we bundle karma as modules now.
import process from 'process';
globalThis.process = process;
process.env.NODE_ENV = 'test';

// these definitions are more involved than a simple "provide the window" or "provide the document"
import loadScript from '@adobe/reactor-load-script';
import queryString from '@adobe/reactor-query-string';
import cookie from '@adobe/reactor-cookie';
// these definitions are more involved than a simple "provide the window" or "provide the document"

function setupGlobals() {
  // this window._satellite is decorating karma's window object to get it ready for tests
  window._satellite = {};
  globalThis.turbine = {
    logger: {
      warn: jasmine.createSpy('warn'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      debug: jasmine.createSpy('debug')
    }
  };
  // --- mock Turbine's public "require" function ---
  globalThis.require = function publicRequire(path) {
    // not using @adobe/reactor window because all that does is provide the
    // window, and we should place a _satellite object on it.
    if (path === '@adobe/reactor-window') {
      // this _satellite is different from our definition above for window._satellite.
      // this _satellite is what's required to be there for a production default export
      // function.
      //
      // Example:
      // export default validateInjection({
      //   window: require('@adobe/reactor-window'),
      // });
      //
      // window._satellite above is for jasmine test runner and for the source code
      // in a jasmine context to have access to window._satellite by default.
      return {
        location: { href: jasmine.createSpy('href') },
        _satellite: {},
        navigator: {
          userAgent: window.navigator.userAgent,
          appVersion: window.navigator.appVersion
        },
        setInterval: window.setInterval.bind(window),
        clearInterval: window.clearInterval.bind(window),
        setTimeout: window.setTimeout.bind(window),
        clearTimeout: window.clearTimeout.bind(window),
        addEventListener: window.addEventListener.bind(window),
        removeEventListener: window.removeEventListener.bind(window)
      };
    }
    // sometimes and import of a source file for a test will trigger an import of
    // an underlying dependency whose default export relies on certain things being
    // available with its real methods.
    if (path === '@adobe/reactor-promise') {
      return Promise;
    }
    if (path === '@adobe/reactor-document') {
      return document;
    }
    if (path === '@adobe/reactor-object-assign') {
      return Object.assign;
    }
    if (path === '@adobe/reactor-load-script') {
      return loadScript;
    }
    if (path === '@adobe/reactor-query-string') {
      return queryString;
    }

    // we don't really care what it was, just mock it.
    return jasmine.createSpy(path);
  };
  // --- mock Turbine's public "require" function ---
}
setupGlobals();

// cleanup any changes to the "clean" global mocks before each test runs
beforeEach(() => {
  setupGlobals();
});

/**
 * mockTurbineVariable is how we can easily decide on a per-test basis what we
 * want to define what things are available on the turbine "free" variable. The
 * reason this isn't part of an injector is because if you were going to inject
 * turbine, then you'd have to inject module.exports, which doesn't make sense.
 *
 * require, turbine, and module.exports are all special in the sense that we're
 * pretending they're all a part of an official runtime variable.
 * @param {object} turbineDefinition
 */
globalThis.mockTurbineVariable = function (turbineDefinition) {
  globalThis.turbine = turbineDefinition;
};
/* END.TESTS_ONLY */
