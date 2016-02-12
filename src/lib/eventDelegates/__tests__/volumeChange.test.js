'use strict';

describe('volumechange event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../volumeChange');
  var delegate = delegateInjector({
    getResource: publicRequire('getResource')
  });

  testStandardEvent(delegate, 'volumechange');
});
