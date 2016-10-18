'use strict';

describe('ended event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../ended');

  testStandardEvent(delegate, 'ended');
});
