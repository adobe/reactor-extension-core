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
  getLandingPage: function() {
    return 'http://landingpage.com/test.html';
  },
  enable: jasmine.createSpy()
};

var conditionDelegateInjector = require('inject!../landingPage');
var conditionDelegate = conditionDelegateInjector({
  './helpers/visitorTracking': mockVisitorTracking
});

var getSettings = function(page, pageIsRegex) {
  return {
    page: page,
    pageIsRegex: pageIsRegex
  };
};

describe('landing page condition delegate', function() {
  it('calls visitorTracking.enable', function() {
    expect(mockVisitorTracking.enable).toHaveBeenCalled();
  });

  it('returns true when the landing page matches a string', function() {
    var settings = getSettings('http://landingpage.com/test.html', false);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the landing page does not match a string', function() {
    var settings = getSettings('http://foo.com/bar.html', false);
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the landing page matches a regex', function() {
    var settings = getSettings('Landingpage\\.com\\/t.st', true);
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the landing page does not match a regex', function() {
    var settings = getSettings('f.o', true);
    expect(conditionDelegate(settings)).toBe(false);
  });
});
