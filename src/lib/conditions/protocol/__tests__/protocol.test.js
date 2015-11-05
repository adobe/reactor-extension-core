'use strict';

var conditionDelegate = require('../protocol');

var getConfig = function(protocols) {
  return {
    protocols: protocols
  };
};

describe('protocol condition delegate', function() {
  it('returns true when the browser protocol matches', function() {
    var config = getConfig(['bogus:', 'Http:']);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the browser protocol does not match', function() {
    var config = getConfig(['bogus:', 'foo:']);
    expect(conditionDelegate(config)).toBe(false);
  });
});
