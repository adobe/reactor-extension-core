'use strict';

var conditionDelegateInjector = require('inject!../variable');

describe('variable condition delegate', function() {
  var conditionDelegate;

  beforeAll(function() {
    conditionDelegate = conditionDelegateInjector({
      window: {
        test: 'foo'
      }
    });
  });

  it('returns true when the variable matches the string value', function() {
    var settings = { name: 'test', value: 'foo' };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the variable does not match the string value', function() {
    var settings = { name: 'test', value: 'cake' };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the variable matches the regex value', function() {
    var settings = { name: 'test', value: 'F.o', valueIsRegex: true };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the variable does not match the regex value', function() {
    var settings = { name: 'test', value: 'g.o', valueIsRegex: true };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('strips window from the variable name', function() {
    var settings = { name: 'window.test', value: 'foo' };
    expect(conditionDelegate(settings)).toBe(true);
  });
});
