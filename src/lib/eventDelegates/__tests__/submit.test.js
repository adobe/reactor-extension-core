'use strict';

describe('submit event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../submit');
  var delegate = delegateInjector({
    getExtension: publicRequire('getExtension')
  });

  testStandardEvent(delegate, 'submit');
});
