'use strict';

describe('play event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../play');
  var delegate = delegateInjector({
    getExtension: publicRequire('getExtension')
  });

  testStandardEvent(delegate, 'play');
});
