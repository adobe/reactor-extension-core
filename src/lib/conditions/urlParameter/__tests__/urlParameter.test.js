'use strict';

var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = require('inject!../urlParameter')({
  textMatch: publicRequire('textMatch'),
  getQueryParam: function() {
    return 'foo';
  }
});

var getConfig = function(name, value, valueIsRegex) {
  return {
    name: name,
    value: value,
    valueIsRegex: valueIsRegex
  };
};

describe('url parameter condition delegate', function() {
  it('returns true when value matches using regular string', function() {
    var config = getConfig('testParam', 'foo', false);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when value does not match using regular string', function() {
    var config = getConfig('testParam', 'goo', false);
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when value matches using regex', function() {
    var config = getConfig('testParam', '^F[ojd]o$', true);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when value does not match using regex', function() {
    var config = getConfig('testParam', '^g[ojd]o$', true);
    expect(conditionDelegate(config)).toBe(false);
  });
});
