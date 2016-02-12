'use strict';

describe('stalled event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../stalled');
  var delegate = delegateInjector({
    getResource: publicRequire('getResource')
  });

  testStandardEvent(delegate, 'stalled');
});
