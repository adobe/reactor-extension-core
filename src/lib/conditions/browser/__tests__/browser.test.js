'use strict';

var mockClientInfo = {
  browser: 'Foo'
};

var conditionDelegateInjector = require('inject!../browser');
var conditionDelegate = conditionDelegateInjector({
  clientInfo: mockClientInfo
});

var getConfig = function(browsers) {
  return {
    browsers: browsers
  };
};

describe('browser condition delegate', function() {
  it('returns true when the current browser matches one of the selected browsers', function() {
    var config = getConfig(['Shoe', 'Goo', 'Foo', 'Moo']);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the current browser does not match any of the ' +
      'selected browsers', function() {
    var config = getConfig(['Shoe', 'Goo', 'Boo', 'Moo']);
    expect(conditionDelegate(config)).toBe(false);
  });
});
