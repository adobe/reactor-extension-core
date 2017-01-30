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

var eventDelegateInjector = require('inject!../timeSpentOnPage');
var delegate = eventDelegateInjector({
  '../helpers/timer.js': Timer,
  '@turbine/document': mockDocument
});

var isIE = function() {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
};

describe('time spent on page event type', function() {
  beforeEach(function() {
    jasmine.clock().install();

    var baseTime = new Date();
    jasmine.clock().mockDate(baseTime);
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('triggers rule', function() {
    var trigger = jasmine.createSpy('timeSpentOnPageTrigger');

    delegate({timeOnPage: 2}, trigger);
    jasmine.clock().tick(2000);

    var call = trigger.calls.mostRecent();
    expect(call.args[1].type).toBe('timepassed(2)');
    expect(call.args[1].target).toBe(mockDocument);
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
