'use strict';

describe('focus event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../focus');

  testStandardEvent(delegate, 'focus');
});
