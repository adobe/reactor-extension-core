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

function setupGlobals() {
  // Mocked globals for the "production code exports".
  // In production, Turbine wraps delegates like: function(module, exports, require, turbine)
  // so these need to be accessible as free variables, not window properties.
  // Define them right away to ensure they're definitely defined before anything happens.
  window._satellite = jasmine.createSpy('_satellite');
  globalThis.turbine = jasmine.createSpy('turbine');
  // --- mock Turbine's public "require" function ---
  globalThis.require = function publicRequire(path) {
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
      window._satellite = {};
      return window;
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
