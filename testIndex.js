'use strict';

require('@babel/polyfill');
var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

// TEST_BASE_PATH is defined inside karma.conf.js.
var testsContext = require.context(TEST_BASE_PATH, true, /__tests__\/.*\.test\.jsx?$/);
testsContext.keys().forEach(testsContext);

// This is necessary for the coverage report to show all source files even when they're not
// included by tests. However, the source files will throw errors if they have require() statements
// in them since they're expecting Turbine's injected require function which is why we must
// wrap in a try-catch. When the source files are required by tests, the tests inject everything
// necessary for them to work properly.
var srcContext = require.context(TEST_BASE_PATH, true, /^((?!__tests__).)*\.jsx?$/);
srcContext.keys().forEach(function(src) {
  try {
    srcContext(src);
  } catch (e) {
    // Do nothing.
  }
});

// Some tests will try to install a jasmine clock. In order to effectively install a clock,
// the tests need to install it before a setTimeout or setInterval is used in the module they
// are testing. Since we just required() all modules, the modules have typically already started
// their setTimeouts or setIntervals making installing an effective clock from tests difficult. By
// clearing the cache here, it allows the tests to effectively install the clock before
// requiring the module anew.
Object.keys(require.cache).forEach(function(key) { delete require.cache[key]; });
