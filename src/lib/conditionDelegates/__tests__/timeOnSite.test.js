'use strict';

var mockVisitorTracking = {
  getMinutesOnSite: function() {
    return 5;
  }
};

var conditionDelegateInjector = require('inject!../timeOnSite');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')({
  resourceStubs: {
    'dtm.visitorTracking': mockVisitorTracking
  }
});
var conditionDelegate = conditionDelegateInjector({
  resourceProvider: publicRequire('resourceProvider')
});

var getConfig = function(minutes, operator) {
  return {
    minutes: minutes,
    operator: operator
  };
};

describe('time on site condition delegate', function() {
  it('returns true when number of minutes is above "greater than" constraint', function() {
    var config = getConfig(4, '>');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when number of minutes is below "greater than" constraint', function() {
    var config = getConfig(6, '>');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when number of minutes is below "less than" constraint', function() {
    var config = getConfig(6, '<');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when number of minutes is above "less than" constraint', function() {
    var config = getConfig(4, '<');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when number of minutes matches "equals" constraint', function() {
    var config = getConfig(5, '=');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when number of minutes does not match "equals" constraint', function() {
    var config = getConfig(11, '=');
    expect(conditionDelegate(config)).toBe(false);
  });
});
