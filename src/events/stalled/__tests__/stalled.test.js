'use strict';

describe('stalled event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../stalled');
  var delegate = delegateInjector({
    resourceProvider: publicRequire('resourceProvider')
  });

  testStandardEvent(delegate, 'stalled');
});
