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

var mockVisitorTracking = {
  getMinutesOnSite: function() {
    return 5;
  },
  enable: jasmine.createSpy()
};

var conditionDelegateInjector = require('inject!../timeOnSite');
var conditionDelegate = conditionDelegateInjector({
  './helpers/visitorTracking': mockVisitorTracking
});

var getSettings = function(minutes, operator) {
  return {
    minutes: minutes,
    operator: operator
  };
};

describe('time on site condition delegate', function() {
  it('calls visitorTracking.enable', function() {
    expect(mockVisitorTracking.enable).toHaveBeenCalled();
  });

  it('returns true when number of minutes is above "greater than" constraint', function() {
    var settings = getSettings(4, '>');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of minutes is below "greater than" constraint', function() {
    var settings = getSettings(6, '>');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when number of minutes is below "less than" constraint', function() {
    var settings = getSettings(6, '<');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of minutes is above "less than" constraint', function() {
    var settings = getSettings(4, '<');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when number of minutes matches "equals" constraint', function() {
    var settings = getSettings(5, '=');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of minutes does not match "equals" constraint', function() {
    var settings = getSettings(11, '=');
    expect(conditionDelegate(settings)).toBe(false);
  });
});
