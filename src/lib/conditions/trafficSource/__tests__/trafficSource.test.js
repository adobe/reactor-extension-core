'use strict';

var mockVisitorTracking = {
  getTrafficSource: function() {
    return 'http://trafficsource.com';
  }
};

var conditionDelegateInjector = require('inject!../trafficSource');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')({
  resourceStubs: {
    'dtm.visitorTracking': mockVisitorTracking
  }
});
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  resourceProvider: publicRequire('resourceProvider')
});

var getConfig = function(source) {
  return {
    source: source
  };
};

describe('traffic source condition delegate', function() {
  it('returns true when the traffic source matches a string', function() {
    var config = getConfig('http://trafficsource.com');
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the traffic source does not match a string', function() {
    var config = getConfig('http://foo.com');
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the traffic source matches a regex', function() {
    var config = getConfig(/traffic.ource/i);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the traffic source does not match a regex', function() {
    var config = getConfig(['http://foo.com', /my\.yahoo\.com/i]);
    expect(conditionDelegate(config)).toBe(false);
  });
});

