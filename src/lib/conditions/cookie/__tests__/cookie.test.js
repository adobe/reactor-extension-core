'use strict';

var conditionDelegateInjector = require('inject!../cookie');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  getCookie: function() {
    return 'foo';
  }
});

describe('cookie condition delegate', function() {

  it('returns true when the cookie matches the string value', function() {
    var config = { name: 'test', value: 'foo' };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the cookie does not match the string value', function() {
    var config = { name: 'test', value: 'cake' };
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the cookie matches the regex value', function() {
    var config = { name: 'test', value: 'F.o', valueIsRegex: true };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the cookie does not match the regex value', function() {
    var config = { name: 'test', value: 'g.o', valueIsRegex: true };
    expect(conditionDelegate(config)).toBe(false);
  });
});
