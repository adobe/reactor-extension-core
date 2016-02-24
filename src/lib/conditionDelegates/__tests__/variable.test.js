'use strict';

var conditionDelegateInjector = require('inject!../variable');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();

describe('variable condition delegate', function() {
  var conditionDelegate;

  beforeAll(function() {
    conditionDelegate = conditionDelegateInjector({
      getVar: function(variableName) {
        if (variableName) {
          return 'foo';
        }
      },
      getExtension: publicRequire('getExtension')
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
});
