'use strict';

var conditionDelegate = require('../protocol');

var getSettings = function(protocol) {
  return {
    protocol: protocol
  };
};

describe('protocol condition delegate', function() {
  it('returns true when the browser protocol matches', function() {
    var settings = getSettings('http:');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the browser protocol does not match', function() {
    var settings = getSettings('javascript:');
    expect(conditionDelegate(settings)).toBe(false);
  });
});
