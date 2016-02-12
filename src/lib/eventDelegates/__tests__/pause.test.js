'use strict';

describe('pause event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../pause');
  var delegate = delegateInjector({
    getResource: publicRequire('getResource')
  });

  testStandardEvent(delegate, 'pause');
});
