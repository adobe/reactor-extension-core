'use strict';

var getObjectProperty = require('../getObjectProperty');

describe('getObjectProperty', function() {
  it('should return an object property value', function() {
    var obj = {
      my: {
        path: 'bar'
      }
    };

    expect(getObjectProperty(obj, 'my.path')).toBe('bar');
  });
});
