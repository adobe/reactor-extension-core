'use strict';

var mockVisitorTracking = {
  enable: jasmine.createSpy()
};

var conditionDelegateInjector = require('inject!../newReturning');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')({
  resourceStubs: {
    'dtm/resources/visitorTracking': mockVisitorTracking
  }
});
var conditionDelegate = conditionDelegateInjector({
  getExtension: publicRequire('getExtension')
});

var getConfig = function(isNewVisitor) {
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

    var config = getConfig(true);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns true when isNewVisitor = false and the visitor is returning', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return false;
    };

    var config = getConfig(false);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when isNewVisitor = false and the visitor is new', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return true;
    };

    var config = getConfig(false);
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns false when isNewVisitor = true and the visitor is returning', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return false;
    };

    var config = getConfig(true);
    expect(conditionDelegate(config)).toBe(false);
  });
});
