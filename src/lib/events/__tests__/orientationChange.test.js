/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { injectOrientationChange } from '../orientationChange.js';

describe('orientation change event delegate', function () {
  let delegate;
  const orientationChangeCallbacks = [];

  // We can't use the real window object to mock orientation changes because some browsers won't
  // let us set the orientation property.
  const mockWindow = {
    addEventListener: function (type, callback) {
      if (type === 'orientationchange') {
        orientationChangeCallbacks.push(callback);
      }
    }
  };

  const triggerOrientationChange = function () {
    // Act as though window triggered an orientationchange event.
    orientationChangeCallbacks.forEach(function (callback) {
      callback({
        type: 'orientationchange',
        target: mockWindow,
        currentTarget: mockWindow
      });
    });
  };

  const assertTriggerCall = function (options) {
    expect(options.call.args[0]).toEqual({
      element: mockWindow,
      target: mockWindow,
      nativeEvent: jasmine.any(Object)
    });
  };

  beforeAll(function () {
    delegate = injectOrientationChange({
      window: mockWindow
    });
  });

  it('triggers rule when orientation changes', function () {
    const trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toEqual(0);

    triggerOrientationChange();

    expect(trigger.calls.count()).toEqual(1);

    assertTriggerCall({
      call: trigger.calls.mostRecent()
    });
  });
});
