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

import { injectTabBlur } from '../tabBlur.js';
import runVisibilityApi from '../helpers/visibilityApi.js';
import { vi } from 'vitest';
const { hiddenProperty, visibilityChangeEventType } = runVisibilityApi();

let visibilityChangeListener;

const mockDocument = {
  location: 'somelocation',
  addEventListener: function (event, listener) {
    if (event && event === visibilityChangeEventType) {
      visibilityChangeListener = listener;
    }
  }
};

const delegate = injectTabBlur({
  document: mockDocument
});

const isIE = function () {
  const myNav = navigator.userAgent.toLowerCase();
  return myNav.indexOf('msie') !== -1
    ? parseInt(myNav.split('msie')[1])
    : false;
};

describe('tab blur event delegate', function () {
  if (!isIE() || isIE() > 9) {
    it('triggers rule when the tabblur event occurs', function () {
      const trigger = vi.fn();

      delegate({}, trigger);

      expect(trigger.mock.calls.length).toBe(0);

      mockDocument[hiddenProperty] = true;
      visibilityChangeListener.call(location);

      expect(trigger.mock.calls.length).toBe(1);
      expect(trigger.mock.lastCall.args.length).toBe(0);
    });
  }
});
