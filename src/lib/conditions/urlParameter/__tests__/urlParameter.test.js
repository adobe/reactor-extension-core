'use strict';

var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = require('inject!../urlParameter')({
  textMatch: publicRequire('textMatch'),
  getQueryParam: function() {
    return 'foo';
  }
});

var getConfig = function(name, value) {
  return {
    name: name,
    value: value
  };
};

describe('url parameter condition delegate', function() {
  it('returns true when value matches using regular string', function() {
    var config = getConfig('testParam', 'foo');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when value does not match using regular string', function() {
    var config = getConfig('testParam', 'goo');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when value matches using regex', function() {
    var config = getConfig('testParam', /^f[ojd]o$/i);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when value does not match using regex', function() {
    var config = getConfig('testParam', /^g[ojd]o$/i);
    expect(conditionDelegate(config)).toBe(false);
  });
});
