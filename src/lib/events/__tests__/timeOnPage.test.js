/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

var visibilityApi = require('../helpers/visibilityApi');
var visibilityApiInstance = visibilityApi();
var visibilityChangeListener;

var mockDocument = {
  addEventListener: function(event, listener) {
    if (event && event === visibilityApiInstance.visibilityChangeEventType) {
      visibilityChangeListener = listener;
    }
  }
};

var Timer = require('../helpers/timer');

var eventDelegateInjector = require('inject!../timeOnPage');
var delegate = eventDelegateInjector({
  '../helpers/timer.js': Timer,
  '@adobe/reactor-document': mockDocument
});

var isIE = function() {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
};

describe('time on page event delegate', function() {
  beforeEach(function() {
    jasmine.clock().install();

    var baseTime = new Date();
    jasmine.clock().mockDate(baseTime);
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('triggers rule', function() {
    var trigger = jasmine.createSpy('timeOnPageTrigger');

    delegate({timeOnPage: 2}, trigger);
    jasmine.clock().tick(2000);

    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toEqual({
      timeOnPage: 2
    });
  });

  if (!isIE () || isIE() > 9) {
    it('stops the timer on tab blur', function() {
      spyOn(Timer.prototype, 'pause');

      delegate({});

      mockDocument[visibilityApiInstance.hiddenProperty] = true;
      visibilityChangeListener.call(location);

      expect(Timer.prototype.pause).toHaveBeenCalled();
    });

    it('resumes the timer on tab focus', function() {
      spyOn(Timer.prototype, 'resume');

      delegate({});

      mockDocument[visibilityApiInstance.hiddenProperty] = false;
      visibilityChangeListener.call(location);

      expect(Timer.prototype.resume).toHaveBeenCalled();
    });
  }
});
