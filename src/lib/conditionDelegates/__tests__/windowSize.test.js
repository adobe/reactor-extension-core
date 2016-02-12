'use strict';

var mockDocument = {
  documentElement: {
    clientWidth: 1366,
    clientHeight: 768
  }
};

var conditionDelegateInjector = require('inject!../windowSize');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  document: mockDocument,
  getResource: publicRequire('getResource')
});

var getConfig = function(width, widthOperator, height, heightOperator) {
  return {
    width: width,
    widthOperator: widthOperator,
    height: height,
    heightOperator: heightOperator
  };
};

describe('window size condition delegate', function() {
  it('returns true when dimension is above "greater than" constraint', function() {
    var config = getConfig(1365, '>', 768, '=');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension is below "greater than" constraint', function() {
    var config = getConfig(1366, '>', 768, '=');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when dimension is below "less than" constraint', function() {
    var config = getConfig(1366, '=', 769, '<');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension is above "less than" constraint', function() {
    var config = getConfig(1366, '=', 768, '<');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when dimension matches "equals" constraint', function() {
    var config = getConfig(1366, '=', 768, '=');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when dimension does not match "equals" constraint', function() {
    var config = getConfig(1366, '=', 767, '=');
    expect(conditionDelegate(config)).toBe(false);
  });
});
