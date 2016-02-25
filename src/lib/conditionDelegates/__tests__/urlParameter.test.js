'use strict';

var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = require('inject!../urlParameter')({
  'get-extension': publicRequire('get-extension'),
  getQueryParam: function() {
    return 'foo';
  }
});

var getSettings = function(name, value, valueIsRegex) {
  return {
    name: name,
    value: value,
    valueIsRegex: valueIsRegex
  };
};

describe('url parameter condition delegate', function() {
  it('returns true when value matches using regular string', function() {
    var settings = getSettings('testParam', 'foo', false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when value does not match using regular string', function() {
    var settings = getSettings('testParam', 'goo', false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when value matches using regex', function() {
    var settings = getSettings('testParam', '^F[ojd]o$', true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when value does not match using regex', function() {
    var settings = getSettings('testParam', '^g[ojd]o$', true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
