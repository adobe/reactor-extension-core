'use strict';

describe('volumechange event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../volumeChange');

  testStandardEvent(delegate, 'volumechange');
});
