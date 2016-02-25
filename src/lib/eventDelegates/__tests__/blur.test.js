'use strict';

describe('blur event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../blur');
  var delegate = delegateInjector({
    'get-extension': publicRequire('get-extension')
  });

  testStandardEvent(delegate, 'blur');
});
