'use strict';

describe('pause event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../pause');

  testStandardEvent(delegate, 'pause');
});
