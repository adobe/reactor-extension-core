'use strict';

describe('ended event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../ended');
  var delegate = delegateInjector({
    getExtension: publicRequire('getExtension')
  });

  testStandardEvent(delegate, 'ended');
});
