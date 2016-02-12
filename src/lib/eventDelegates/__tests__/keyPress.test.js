'use strict';

describe('keypress event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../keyPress');
  var delegate = delegateInjector({
    getResource: publicRequire('getResource')
  });

  testStandardEvent(delegate, 'keypress');
});
