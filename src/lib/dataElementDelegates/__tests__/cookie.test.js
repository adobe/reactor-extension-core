'use strict';

var dataElementDelegate = require('inject!../cookie')({
  'cookie': require('@reactor/turbine/src/public/cookie'),
  'document': {
    cookie: 'foo=bar'
  }
});

describe('cookie data element delegate', function() {
  it('should return the value of a cookie', function() {
    var settings = {
      name: 'foo'
    };

    expect(dataElementDelegate(settings)).toBe('bar');
  });
});
