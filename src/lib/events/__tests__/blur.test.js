'use strict';

describe('blur event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../blur');

  testStandardEvent(delegate, 'blur');
});
