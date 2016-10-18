'use strict';

describe('keypress event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../keyPress');

  testStandardEvent(delegate, 'keypress');
});
