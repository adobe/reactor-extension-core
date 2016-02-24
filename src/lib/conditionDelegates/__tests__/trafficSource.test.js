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
    'dtm/resources/visitorTracking': mockVisitorTracking
  }
});
var conditionDelegate = conditionDelegateInjector({
  getExtension: publicRequire('getExtension')
});

var getSettings = function(source, sourceIsRegex) {
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
    var settings = getSettings('http://trafficsource.com', false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the traffic source does not match a string', function() {
    var settings = getSettings('http://foo.com', false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the traffic source matches a regex', function() {
    var settings = getSettings('Traffic.ource', true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the traffic source does not match a regex', function() {
    var settings = getSettings('my\\.yahoo\\.com', true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});

