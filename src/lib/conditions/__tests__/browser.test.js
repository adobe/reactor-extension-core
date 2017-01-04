'use strict';

var mockClientInfo = {
  browser: 'Foo'
};

var conditionDelegateInjector = require('inject!../browser');
var conditionDelegate = conditionDelegateInjector({
  '@turbine/client-info': mockClientInfo
});

var getSettings = function(browsers) {
  return {
    browsers: browsers
  };
};

describe('browser condition delegate', function() {
  it('returns true when the current browser matches one of the selected browsers', function() {
    var settings = getSettings(['Shoe', 'Goo', 'Foo', 'Moo']);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the current browser does not match any of the ' +
      'selected browsers', function() {
    var settings = getSettings(['Shoe', 'Goo', 'Boo', 'Moo']);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
