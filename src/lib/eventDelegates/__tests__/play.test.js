'use strict';

describe('play event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../play');
  var delegate = delegateInjector({
    getResource: publicRequire('getResource')
  });

  testStandardEvent(delegate, 'play');
});
