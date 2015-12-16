'use strict';

var mockClientInfo = {
  deviceType: 'Foo'
};

var conditionDelegateInjector = require('inject!../deviceType');
var conditionDelegate = conditionDelegateInjector({
  clientInfo: mockClientInfo
});

var getConfig = function(deviceTypes) {
  return {
    deviceTypes: deviceTypes
  };
};

describe('device type condition delegate', function() {
  it('returns true when the current device type matches one of the selected ' +
      'device types', function() {
    var config = getConfig(['Shoe', 'Goo', 'Foo', 'Moo']);
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the current device type does not match any of the selected ' +
      'device types', function() {
    var config = getConfig(['Shoe', 'Goo', 'Boo', 'Moo']);
    expect(conditionDelegate(config)).toBe(false);
  });
});
