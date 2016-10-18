'use strict';

describe('loadeddata event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../loadedData');

  testStandardEvent(delegate, 'loadeddata');
});
