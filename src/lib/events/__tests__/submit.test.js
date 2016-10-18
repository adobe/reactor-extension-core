'use strict';

describe('submit event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../submit');

  testStandardEvent(delegate, 'submit');
});
