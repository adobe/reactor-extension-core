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

import { injectTimeOnPage } from '../timeOnPage.js';
import { injectTimer } from '../helpers/timer.js';
import runVisibilityApi from '../helpers/visibilityApi';
const { visibilityChangeEventType, hiddenProperty } = runVisibilityApi();
const injectNewTimer = () => injectTimer({ assign: Object.assign });

let visibilityChangeListener;

const mockDocument = {
  addEventListener: function (event, listener) {
    if (event && event === visibilityChangeEventType) {
      visibilityChangeListener = listener;
    }
  }
};

const isIE = function () {
  const myNav = navigator.userAgent.toLowerCase();
  return myNav.indexOf('msie') !== -1
    ? parseInt(myNav.split('msie')[1])
    : false;
};

describe('time on page event delegate', function () {
  let delegate;

  beforeEach(function () {
    jasmine.clock().install();

    const baseTime = new Date();
    jasmine.clock().mockDate(baseTime);

    delegate = injectTimeOnPage({
      document,
      Timer: injectNewTimer()
    });
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  it('triggers rule', function () {
    const trigger = jasmine.createSpy('timeOnPageTrigger');

    delegate({ timeOnPage: 2 }, trigger);
    jasmine.clock().tick(2000);

    const call = trigger.calls.mostRecent();
    expect(call.args[0]).toEqual({
      timeOnPage: 2
    });
  });

  it('triggers rule when timeOnPage is a string', function () {
    const trigger = jasmine.createSpy('timeOnPageTrigger');

    delegate({ timeOnPage: '2' }, trigger);
    jasmine.clock().tick(2000);

    const call = trigger.calls.mostRecent();
    expect(call.args[0]).toEqual({
      timeOnPage: 2
    });
  });

  if (!isIE() || isIE() > 9) {
    it('stops the timer on tab blur', function () {
      spyOn(Timer.prototype, 'pause');

      delegate({});

      mockDocument[hiddenProperty] = true;
      visibilityChangeListener.call(location);

      expect(Timer.prototype.pause).toHaveBeenCalled();
    });

    it('resumes the timer on tab focus', function () {
      spyOn(Timer.prototype, 'resume');

      delegate({});

      mockDocument[hiddenProperty] = false;
      visibilityChangeListener.call(location);

      expect(Timer.prototype.resume).toHaveBeenCalled();
    });
  }
});
