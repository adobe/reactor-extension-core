'use strict';

var mockVisitorTracking = {
  getLifetimePageViewCount: jasmine.createSpy().and.callFake(function() {
    return 5;
  }),
  getSessionPageViewCount: jasmine.createSpy().and.callFake(function() {
    return 5;
  })
};

var conditionDelegateInjector = require('inject!../pageViews');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')({
  resourceStubs: {
    'dtm/visitorTracking': mockVisitorTracking
  }
});
var conditionDelegate = conditionDelegateInjector({
  resourceProvider: publicRequire('resourceProvider')
});

var DURATIONS = [
  'lifetime',
  'session'
];

var getConfig = function(count, operator, duration) {
  return {
    count: count,
    operator: operator,
    duration: duration
  };
};

describe('page views condition delegate', function() {
  beforeEach(function() {
    mockVisitorTracking.getLifetimePageViewCount.calls.reset();
    mockVisitorTracking.getSessionPageViewCount.calls.reset();
  });

  DURATIONS.forEach(function(duration) {
    describe('with "' + duration + '" duration', function() {
      // Make sure we're calling the correct method with respect to duration.
      var assertCorrectMethodCall = function() {
        var lifetimeCallCount = mockVisitorTracking.getLifetimePageViewCount.calls.count();
        var sessionCallCount = mockVisitorTracking.getSessionPageViewCount.calls.count();
        expect(lifetimeCallCount).toBe(duration === 'lifetime' ? 1 : 0);
        expect(sessionCallCount).toBe(duration === 'session' ? 1 : 0);
      };

      it('returns true when number of page views is above "greater than" constraint', function() {
        var config = getConfig(4, '>', duration);
        expect(conditionDelegate(config)).toBe(true);
        assertCorrectMethodCall();
      });

      it('returns false when number of page views is below "greater than" constraint', function() {
        var config = getConfig(6, '>', duration);
        expect(conditionDelegate(config)).toBe(false);
        assertCorrectMethodCall();
      });

      it('returns true when number of page views is below "less than" constraint', function() {
        var config = getConfig(6, '<', duration);
        expect(conditionDelegate(config)).toBe(true);
        assertCorrectMethodCall();
      });

      it('returns false when number of page views is above "less than" constraint', function() {
        var config = getConfig(4, '<', duration);
        expect(conditionDelegate(config)).toBe(false);
        assertCorrectMethodCall();
      });

      it('returns true when number of page views matches "equals" constraint', function() {
        var config = getConfig(5, '=', duration);
        expect(conditionDelegate(config)).toBe(true);
        assertCorrectMethodCall();
      });

      it('returns false when number of page views does not match "equals" constraint', function() {
        var config = getConfig(11, '=', duration);
        expect(conditionDelegate(config)).toBe(false);
        assertCorrectMethodCall();
      });
    });
  });
});
