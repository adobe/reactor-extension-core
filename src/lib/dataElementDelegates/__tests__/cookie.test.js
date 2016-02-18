'use strict';

var dataElementDelegate = require('inject!../cookie')({
  getCookie: function() {
    return 'bar';
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
