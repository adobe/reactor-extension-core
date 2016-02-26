'use strict';

describe('loadeddata event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../loadedData');
  var delegate = delegateInjector({
    'get-extension': publicRequire('get-extension')
  });

  testStandardEvent(delegate, 'loadeddata');
});
