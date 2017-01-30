/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

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
    expect(options.call.args[0]).toBe(mockWindow);
    expect(options.call.args[1].type).toBe('orientationchange');
    expect(options.call.args[1].target).toBe(mockWindow);
    expect(options.call.args[1].orientation).toBe(options.orientation);
  };

  beforeAll(function() {
    var delegateInjector = require('inject!../orientationChange');
    delegate = delegateInjector({
      '@turbine/window': mockWindow
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
