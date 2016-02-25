'use strict';

var mockWindow = {
  screen: {
    width: 1366,
    height: 768
  }
};

var conditionDelegateInjector = require('inject!../screenResolution');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  window: mockWindow,
  'get-extension': publicRequire('get-extension')
});

var getSettings = function(width, widthOperator, height, heightOperator) {
  return {
    width: width,
    widthOperator: widthOperator,
    height: height,
    heightOperator: heightOperator
  };
};

describe('screen resolution condition delegate', function() {
  it('returns true when dimension is above "greater than" constraint', function() {
    var settings = getSettings(1365, '>', 768, '=');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when dimension is below "greater than" constraint', function() {
    var settings = getSettings(1366, '>', 768, '=');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when dimension is below "less than" constraint', function() {
    var settings = getSettings(1366, '=', 769, '<');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when dimension is above "less than" constraint', function() {
    var settings = getSettings(1366, '=', 768, '<');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when dimension matches "equals" constraint', function() {
    var settings = getSettings(1366, '=', 768, '=');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when dimension does not match "equals" constraint', function() {
    var settings = getSettings(1366, '=', 767, '=');
    expect(conditionDelegate(settings)).toBe(false);
  });
});
