'use strict';

var mockVisitorTracking = {
  getTrafficSource: function() {
    return 'http://trafficsource.com';
  },
  enable: jasmine.createSpy()
};

var conditionDelegateInjector = require('inject!../trafficSource');
var publicRequire = require('../../__tests__/helpers/stubPublicRequire')({
  resourceStubs: {
    'dtm.visitorTracking': mockVisitorTracking
  }
});
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  resourceProvider: publicRequire('resourceProvider')
});

var getConfig = function(source, sourceIsRegex) {
  return {
    source: source,
    sourceIsRegex: sourceIsRegex
  };
};

describe('traffic source condition delegate', function() {
  it('calls visitorTracking.enable', function() {
    expect(mockVisitorTracking.enable).toHaveBeenCalled();
  });

  it('returns true when the traffic source matches a string', function() {
    var config = getConfig('http://trafficsource.com', false);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the traffic source does not match a string', function() {
    var config = getConfig('http://foo.com', false);
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the traffic source matches a regex', function() {
    var config = getConfig('Traffic.ource', true);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the traffic source does not match a regex', function() {
    var config = getConfig('my\\.yahoo\\.com', true);
    expect(conditionDelegate(config)).toBe(false);
  });
});

