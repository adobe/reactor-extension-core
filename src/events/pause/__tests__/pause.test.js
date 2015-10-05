'use strict';

describe('pause event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../pause');
  var delegate = delegateInjector({
    resourceProvider: publicRequire('resourceProvider')
  });

  testStandardEvent(delegate, 'pause');
});
