'use strict';

var mockVisitorTracking = {
  getMinutesOnSite: function() {
    return 5;
  },
  enable: jasmine.createSpy()
};

var conditionDelegateInjector = require('inject!../timeOnSite');
var conditionDelegate = conditionDelegateInjector({
  '../helpers/visitorTracking.js': mockVisitorTracking
});

var getSettings = function(minutes, operator) {
  return {
    minutes: minutes,
    operator: operator
  };
};

describe('time on site condition delegate', function() {
  it('calls visitorTracking.enable', function() {
    expect(mockVisitorTracking.enable).toHaveBeenCalled();
  });

  it('returns true when number of minutes is above "greater than" constraint', function() {
    var settings = getSettings(4, '>');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of minutes is below "greater than" constraint', function() {
    var settings = getSettings(6, '>');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when number of minutes is below "less than" constraint', function() {
    var settings = getSettings(6, '<');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of minutes is above "less than" constraint', function() {
    var settings = getSettings(4, '<');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when number of minutes matches "equals" constraint', function() {
    var settings = getSettings(5, '=');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of minutes does not match "equals" constraint', function() {
    var settings = getSettings(11, '=');
    expect(conditionDelegate(settings)).toBe(false);
  });
});
