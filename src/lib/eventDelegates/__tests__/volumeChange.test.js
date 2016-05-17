'use strict';

describe('volumechange event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');

  var createBubblyInjector = require('inject!../../helpers/createBubbly');
  var createBubbly = createBubblyInjector({
    'create-data-stash': require('@reactor/turbine/src/public/createDataStash')
  });

  var delegateInjector = require('inject!../volumeChange');
  var delegate = delegateInjector({
    '../helpers/createBubbly.js': createBubbly
  });

  testStandardEvent(delegate, 'volumechange');
});
