'use strict';

var conditionDelegateInjector = require('inject!../registeredUser');

describe('registered user condition delegate', function() {
  it('returns the data element value', function() {
    var dataElementValue;

    var getDataElementValue = jasmine.createSpy().and.callFake(function() {
      return dataElementValue;
    });

    var conditionDelegate = conditionDelegateInjector({
      '@turbine/get-data-element-value': getDataElementValue
    });

    var settings = {
      dataElement: 'foo'
    };

    dataElementValue = true;
    expect(conditionDelegate(settings)).toBe(true);

    dataElementValue = false;
    expect(conditionDelegate(settings)).toBe(false);

    dataElementValue = undefined;
    expect(conditionDelegate(settings)).toBe(false);

    expect(getDataElementValue).toHaveBeenCalledWith('foo', true);
  });
});
