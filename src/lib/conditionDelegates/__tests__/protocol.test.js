'use strict';

var conditionDelegate = require('../protocol');

var getConfig = function(protocol) {
  return {
    protocol: protocol
  };
};

describe('protocol condition delegate', function() {
  it('returns true when the browser protocol matches', function() {
    var config = getConfig('http:');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the browser protocol does not match', function() {
    var config = getConfig('javascript:');
    expect(conditionDelegate(config)).toBe(false);
  });
});
