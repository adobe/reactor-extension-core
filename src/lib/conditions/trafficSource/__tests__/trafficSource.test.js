'use strict';

var mockVisitorTracking = {
  getTrafficSource: function() {
    return 'http://trafficsource.com';
  }
};

var conditionDelegateInjector = require('inject!../trafficSource');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')({
  resourceStubs: {
    'dtm/visitorTracking': mockVisitorTracking
  }
});
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  resourceProvider: publicRequire('resourceProvider')
});

var getConfig = function(sources) {
  return {
    sources: sources
  };
};

describe('traffic source condition delegate', function() {
  it('returns true when the traffic source matches one of the string options', function() {
    var config = getConfig(['http://foo.com', 'http://trafficsource.com']);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the traffic source does not match one of the string options', function() {
    var config = getConfig(['http://foo.com', 'http://bar.com']);
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the traffic source matches a regex options', function() {
    var config = getConfig(['http://foo.com', /traffic.ource/i]);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the traffic source does not match the regex option', function() {
    var config = getConfig(['http://foo.com', /my\.yahoo\.com/i]);
    expect(conditionDelegate(config)).toBe(false);
  });
});

