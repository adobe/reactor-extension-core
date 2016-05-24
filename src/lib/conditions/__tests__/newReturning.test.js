'use strict';

var mockVisitorTracking = {
  enable: jasmine.createSpy()
};

var conditionDelegateInjector = require('inject!../newReturning');

var conditionDelegate = conditionDelegateInjector({
  '../helpers/visitorTracking.js': mockVisitorTracking
});

var getSettings = function(isNewVisitor) {
  return {
    isNewVisitor: isNewVisitor
  };
};

describe('new vs. returning condition delegate', function() {
  it('calls visitorTracking.enable', function() {
    expect(mockVisitorTracking.enable).toHaveBeenCalled();
  });

  it('returns true when isNewVisitor = true and the visitor is new', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return true;
    };

    var settings = getSettings(true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns true when isNewVisitor = false and the visitor is returning', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return false;
    };

    var settings = getSettings(false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when isNewVisitor = false and the visitor is new', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return true;
    };

    var settings = getSettings(false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns false when isNewVisitor = true and the visitor is returning', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return false;
    };

    var settings = getSettings(true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
