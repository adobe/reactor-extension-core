'use strict';

var dataElementDelegate = require('../custom');

describe('custom data element delegate', function() {
  it('should return the return value of a user-defined script', function() {
    var settings = {
      script: function() {
        return 'foo';
      }
    };

    expect(dataElementDelegate(settings)).toBe('foo');
  });
});
