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
  getTrafficSource: function() {
    return 'http://trafficsource.com';
  },
  enable: jasmine.createSpy()
};

var conditionDelegateInjector = require('inject!../trafficSource');
var conditionDelegate = conditionDelegateInjector({
  './helpers/visitorTracking': mockVisitorTracking
});

var getSettings = function(source, sourceIsRegex) {
  return {
    source: source,
    sourceIsRegex: sourceIsRegex
  };
};

describe('traffic source condition delegate', function() {
  it('calls visitorTracking.enable', function() {
    expect(mockVisitorTracking.enable).toHaveBeenCalled();
  });

  it('returns true when the traffic source matches a string', function() {
    var settings = getSettings('http://trafficsource.com', false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the traffic source does not match a string', function() {
    var settings = getSettings('http://foo.com', false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the traffic source matches a regex', function() {
    var settings = getSettings('Traffic.ource', true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the traffic source does not match a regex', function() {
    var settings = getSettings('my\\.yahoo\\.com', true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});

