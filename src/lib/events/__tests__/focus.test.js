'use strict';

var publicRequire = require('../../__tests__/helpers/publicRequire');

describe('focus event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');

  var createBubblyInjector = require('inject!../../helpers/createBubbly');
  var createBubbly = createBubblyInjector({
    'weak-map': publicRequire('weak-map')
  });

  var delegateInjector = require('inject!../focus');
  var delegate = delegateInjector({
    '../helpers/createBubbly.js': createBubbly
  });

  testStandardEvent(delegate, 'focus');
});
