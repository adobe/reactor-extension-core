'use strict';

describe('orientationchange event type', function() {
  var delegate;
  var orientationChangeCallbacks = [];

  // We can't use the real window object to mock orientation changes because some browsers won't
  // let us set the orientation property.
  var mockWindow = {
    addEventListener: function(type, callback) {
      if (type === 'orientationchange') {
        orientationChangeCallbacks.push(callback);
      }
    }
  };

  var triggerOrientationChange = function() {
    // Act as though window triggered an orientationchange event.
    orientationChangeCallbacks.forEach(function(callback) {
      callback({
        type: 'orientationchange',
        target: mockWindow,
        currentTarget: mockWindow
      });
    });
  };

  var assertTriggerCall = function(options) {
    expect(options.call.args[0].type).toBe('orientationchange');
    expect(options.call.args[0].target).toBe(mockWindow);
    expect(options.call.args[0].orientation).toBe(options.orientation);
    expect(options.call.args[1]).toBe(mockWindow);
  };

  beforeAll(function() {
    var delegateInjector = require('inject!../orientationchange');
    delegate = delegateInjector({
      window: mockWindow
    });
  });

  it('triggers rule when orientation changes', function() {
    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toEqual(0);

    mockWindow.orientation = 0;

    triggerOrientationChange();

    expect(trigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: trigger.calls.mostRecent(),
      orientation: 'portrait'
    });

    mockWindow.orientation = 90;

    triggerOrientationChange();

    expect(trigger.calls.count()).toEqual(2);

    assertTriggerCall({
      call: trigger.calls.mostRecent(),
      orientation: 'landscape'
    });
  });
});
