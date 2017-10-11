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

var cookie = require('js-cookie');

var mockWindow = {
  location: {
    // We use a querystring with a pipe here because visitor tracking stores the landing
    // page + a timestamp as the cookie value using a pipe delimiter. We want to make sure
    // if our landing page URL has a pipe that it doesn't mess things up.
    href: 'http://visitortracking.com/test.html?p=123|456'
  }
};

var mockLogger = {
  error: jasmine.createSpy()
};

var mockDocument = {
  referrer: 'http://testreferrer.com/test.html'
};

var visitorTrackingInjector = require('inject!../visitorTracking');

var getVisitorTracking = function(enableTracking) {
  var visitorTracking = visitorTrackingInjector({
    '@adobe/reactor-cookie': cookie,
    '@adobe/reactor-document': mockDocument,
    '@adobe/reactor-window': mockWindow
  });

  if (enableTracking) {
    visitorTracking.enable();
  }

  return visitorTracking;
};

var COOKIE_PREFIX = '_sdsat_';

var key = function(name) {
  return COOKIE_PREFIX + name;
};

var clearTestCookies = function() {
  Object.keys(cookie.get()).forEach(function(cookieName) {
    if (cookieName.indexOf(COOKIE_PREFIX) === 0) {
      cookie.remove(cookieName);
    }
  });
};

describe('visitor tracking', function() {
  beforeAll(function() {
    clearTestCookies();
    spyOn(cookie, 'set').and.callThrough();
    mockTurbineVariable({
      logger: mockLogger
    });
  });

  afterAll(function() {
    resetTurbineVariable();
  });

  afterEach(clearTestCookies);

  it('tracks the landing page if the current page is the landing page', function() {
    var url1 = mockWindow.location.href;
    var url2 = 'http://visitortracking.com/somethingelse.html';
    var url1CookieRegex = /http:\/\/visitortracking\.com\/test\.html?p=123|456\|\d+$/;

    var visitorTracking = getVisitorTracking(true);

    var cookieValue = cookie.get(key('landing_page'));
    expect(visitorTracking.getLandingPage()).toBe(url1);
    expect(url1CookieRegex.test(cookieValue)).toBe(true);

    mockWindow.location.href = url2;

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getLandingPage()).toBe(url1);
    expect(url1CookieRegex.test(cookieValue)).toBe(true);
  });

  it('tracks the landing time', function() {
    jasmine.clock().install();

    var landingDate = new Date();
    jasmine.clock().mockDate(landingDate);

    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getLandingTime()).toBe(landingDate.getTime());

    // Simulate moving to a new page. The landing time should remain the same.
    mockWindow.location.href = 'http://visitortracking.com/somethingelse.html';

    jasmine.clock().tick(100000);

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getLandingTime()).toBe(landingDate.getTime());

    jasmine.clock().uninstall();
  });

  it('tracks minutes on site', function() {
    jasmine.clock().install();
    jasmine.clock().mockDate();

    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getMinutesOnSite()).toBe(0);

    jasmine.clock().tick(2.7 * 60 * 1000);

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getMinutesOnSite()).toBe(2);
    jasmine.clock().uninstall();
  });

  it('tracks the number of sessions', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionCount()).toBe(1);
    expect(cookie.set).toHaveBeenCalledWith(key('session_count'), 1, jasmine.any(Object));

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionCount()).toBe(1);

    // Number of sessions is incremented only if the landing page cookie has not been set.
    cookie.remove(key('landing_page'));

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionCount()).toBe(2);
    expect(cookie.set).toHaveBeenCalledWith(key('session_count'), 2, jasmine.any(Object));
  });

  it('tracks lifetime pages viewed', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getLifetimePageViewCount()).toBe(1);
    expect(cookie.set)
      .toHaveBeenCalledWith(key('lt_pages_viewed'), 1, jasmine.any(Object));

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getLifetimePageViewCount()).toBe(2);
    expect(cookie.set)
      .toHaveBeenCalledWith(key('lt_pages_viewed'), 2, jasmine.any(Object));
  });

  it('tracks session pages viewed', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionPageViewCount()).toBe(1);
    expect(cookie.set).toHaveBeenCalledWith(key('pages_viewed'), 1);

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionPageViewCount()).toBe(2);
    expect(cookie.set).toHaveBeenCalledWith(key('pages_viewed'), 2);
  });

  it('tracks traffic source', function() {
    var referrer1 = mockDocument.referrer;
    var referrer2 = 'http://otherreferrer.com';

    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getTrafficSource()).toBe(referrer1);
    expect(cookie.set).toHaveBeenCalledWith(key('traffic_source'), referrer1);

    mockDocument.referrer = referrer2;

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getTrafficSource()).toBe(referrer1);
    expect(cookie.set).not.toHaveBeenCalledWith(key('traffic_source'), referrer2);
  });
  
  it('tracks whether the visitor is new', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getIsNewVisitor()).toBe(true);

    // The visitor is considered "returning" if more than one session has been recorded.
    // The session count is incremented when the landing page cookie has not been set.
    // Therefore, to make getIsNewVisitor() return false we have to reset the landing page cookie.
    cookie.remove(key('landing_page'));

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getIsNewVisitor()).toBe(false);
  });

  it('logs an error when calling a method and visitor tracking is disabled', function() {
    mockLogger.error.calls.reset();

    var visitorTracking = getVisitorTracking(false);
    visitorTracking.getLandingPage();

    expect(mockLogger.error).toHaveBeenCalledWith(jasmine.any(String));
  });
});
