'use strict';

var getQueryParamSpy = jasmine.createSpy().and.returnValue('bar');
var dataElementDelegate = require('inject!../queryParameter')({
  '@turbine/get-query-param': getQueryParamSpy
});

describe('queryParam data element delegate', function() {
  it('should return a query parameter value', function() {
    var settings = {
      name: 'foo',
      caseInsensitive: true
    };

    var value = dataElementDelegate(settings);

    expect(value).toBe('bar');
    expect(getQueryParamSpy.calls.argsFor(0)).toEqual(['foo', true]);
  });
});
