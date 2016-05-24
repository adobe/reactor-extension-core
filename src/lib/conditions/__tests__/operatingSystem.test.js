'use strict';

var mockClientInfo = {
  os: 'Foo'
};

var conditionDelegateInjector = require('inject!../operatingSystem');
var conditionDelegate = conditionDelegateInjector({
  'client-info': mockClientInfo
});

var getSettings = function(operatingSystems) {
  return {
    operatingSystems: operatingSystems
  };
};

describe('operating system condition delegate', function() {
  it('returns true when the current OS matches one of the selected OSs', function() {
    var settings = getSettings(['Shoe', 'Goo', 'Foo', 'Moo']);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the current OS does not match any of the selected OSs', function() {
    var settings = getSettings(['Shoe', 'Goo', 'Boo', 'Moo']);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
