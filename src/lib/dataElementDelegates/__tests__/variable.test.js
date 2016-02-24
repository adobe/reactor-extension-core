'use strict';

var dataElementDelegate = require('inject!../variable')({
  window: {
    my: {
      path: 'bar'
    }
  }
});

describe('variable data element delegate', function() {
  it('should return an object property value', function() {
    var settings = {
      path: 'my.path'
    };

    var value = dataElementDelegate(settings);

    expect(value).toBe('bar');
  });
});
