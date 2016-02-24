'use strict';

var conditionDelegateInjector = require('inject!../dataElement');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  getExtension: publicRequire('getExtension')
});

describe('data element condition delegate', function() {
  var previousGetVar;

  beforeAll(function() {
    window._satellite = window._satellite || {};
    previousGetVar = window._satellite.getVar;
    window._satellite.getVar = function() {
      return 'foo';
    };
  });

  afterAll(function() {
    window._satellite.getVar = previousGetVar;
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
