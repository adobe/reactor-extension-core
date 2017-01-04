'use strict';

var mockDocument = {
  location: {
    hostname: 'foo.adobe.com'
  }
};

var conditionDelegateInjector = require('inject!../domain');
var conditionDelegate = conditionDelegateInjector({
  '@turbine/document': mockDocument
});

var getSettings = function(domains) {
  return {
    domains: domains
  };
};

describe('domain condition delegate', function() {
  it('returns true when the domain matches', function() {
    var settings = getSettings(['example\.com$', 'Adobe\.com$']);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the domain does not match', function() {
    var settings = getSettings(['example\.com$', 'yahoo\.com$']);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
