'use strict';

describe('play event type', function() {
  var testStandardEvent = require('./helpers/testStandardEvent');
  var delegate = require('../play');

  testStandardEvent(delegate, 'play');
});
