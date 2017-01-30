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

var mockWindow = {
  screen: {
    width: 1366,
    height: 768
  }
};

var conditionDelegateInjector = require('inject!../screenResolution');
var conditionDelegate = conditionDelegateInjector({
  '@turbine/window': mockWindow
});

var getSettings = function(width, widthOperator, height, heightOperator) {
  return {
    width: width,
    widthOperator: widthOperator,
    height: height,
    heightOperator: heightOperator
  };
};

describe('screen resolution condition delegate', function() {
  it('returns true when dimension is above "greater than" constraint', function() {
    var settings = getSettings(1365, '>', 768, '=');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when dimension is below "greater than" constraint', function() {
    var settings = getSettings(1366, '>', 768, '=');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when dimension is below "less than" constraint', function() {
    var settings = getSettings(1366, '=', 769, '<');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when dimension is above "less than" constraint', function() {
    var settings = getSettings(1366, '=', 768, '<');
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when dimension matches "equals" constraint', function() {
    var settings = getSettings(1366, '=', 768, '=');
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when dimension does not match "equals" constraint', function() {
    var settings = getSettings(1366, '=', 767, '=');
    expect(conditionDelegate(settings)).toBe(false);
  });
});
