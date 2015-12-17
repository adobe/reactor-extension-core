'use strict';

var getObjectPropertySpy = jasmine.createSpy().and.returnValue('bar');
var dataElementDelegate = require('inject!../variable')({
  getObjectProperty: getObjectPropertySpy
});

describe('variable data element delegate', function() {
  it('should return an object property value', function() {
    var config = {
      path: 'my.path.var'
    };

    var value = dataElementDelegate(config);

    expect(value).toBe('bar');
    expect(getObjectPropertySpy.calls.argsFor(0)).toEqual([window, 'my.path.var']);
  });
});
