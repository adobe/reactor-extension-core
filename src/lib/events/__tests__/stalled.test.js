'use strict';

describe('stalled event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../stalled');

  testStandardEvent(delegate, 'stalled');
});
