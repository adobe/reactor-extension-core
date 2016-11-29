'use strict';

var conditionDelegateInjector = require('inject!../dataElement');

describe('data element condition delegate', function() {
  var conditionDelegate;

  beforeAll(function() {
    conditionDelegate = conditionDelegateInjector({
      'get-data-element-value': function(variableName) {
        if (variableName) {
          return 'foo';
        }
      }
    });
  });

  it('returns true when the data element matches the string value', function() {
    var settings = { name: 'test', value: 'foo' };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the data element does not match the string value', function() {
    var settings = { name: 'test', value: 'cake' };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the data element matches the regex value', function() {
    var settings = { name: 'test', value: 'F.o', valueIsRegex: true };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the data element does not match the regex value', function() {
    var settings = { name: 'test', value: 'g.o', valueIsRegex: true };
    expect(conditionDelegate(settings)).toBe(false);
  });
});
