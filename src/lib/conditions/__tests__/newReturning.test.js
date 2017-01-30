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
  enable: jasmine.createSpy()
};

var conditionDelegateInjector = require('inject!../newReturning');

var conditionDelegate = conditionDelegateInjector({
  './helpers/visitorTracking': mockVisitorTracking
});

var getSettings = function(isNewVisitor) {
  return {
    isNewVisitor: isNewVisitor
  };
};

describe('new vs. returning condition delegate', function() {
  it('calls visitorTracking.enable', function() {
    expect(mockVisitorTracking.enable).toHaveBeenCalled();
  });

  it('returns true when isNewVisitor = true and the visitor is new', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return true;
    };

    var settings = getSettings(true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns true when isNewVisitor = false and the visitor is returning', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return false;
    };

    var settings = getSettings(false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when isNewVisitor = false and the visitor is new', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return true;
    };

    var settings = getSettings(false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns false when isNewVisitor = true and the visitor is returning', function() {
    mockVisitorTracking.getIsNewVisitor = function() {
      return false;
    };

    var settings = getSettings(true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
