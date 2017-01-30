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
  getSessionCount: function() {
    return 5;
  },
  enable: jasmine.createSpy()
};

var conditionDelegateInjector = require('inject!../sessions');
var conditionDelegate = conditionDelegateInjector({
  './helpers/visitorTracking': mockVisitorTracking
});

var getSettings = function(count, operator) {
  return {
    count: count,
    operator: operator
  };
};

describe('sessions condition delegate', function() {
  it('calls visitorTracking.enable', function() {
    expect(mockVisitorTracking.enable).toHaveBeenCalled();
  });

  it('returns true when number of sessions is above "greater than" constraint', function() {
    var settings = getSettings(4, '>');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of sessions is below "greater than" constraint', function() {
    var settings = getSettings(6, '>');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when number of sessions is below "less than" constraint', function() {
    var settings = getSettings(6, '<');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of sessions is above "less than" constraint', function() {
    var settings = getSettings(4, '<');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when number of sessions matches "equals" constraint', function() {
    var settings = getSettings(5, '=');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when number of sessions does not match "equals" constraint', function() {
    var settings = getSettings(11, '=');
    expect(conditionDelegate(settings)).toBe(false);
  });
});
