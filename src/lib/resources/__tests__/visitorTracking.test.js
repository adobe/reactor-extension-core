'use strict';

var cookieValues;

var mockGetCookie = jasmine.createSpy().and.callFake(function(key) {
  return cookieValues[key];
});

var mockSetCookie = jasmine.createSpy().and.callFake(function(key, value) {
  cookieValues[key] = value;
});

var mockDocument = {
  referrer: 'http://testreferrer.com/test.html'
};

var mockWindow = {
  location: {
    // We use a querystring with a pipe here because visitor tracking stores the landing
    // page + a timestamp as the cookie value using a pipe delimiter. We want to make sure
    // if our landing page URL has a pipe that it doesn't mess things up.
    href: 'http://visitortracking.com/test.html?p=123|456'
  }
};

var visitorTrackingInjector = require('inject!../visitorTracking');


var getVisitorTracking = function(trackVisitor) {
  var mockPropertyConfig = {
    trackVisitor: trackVisitor
  };

  return visitorTrackingInjector({
    getCookie: mockGetCookie,
    setCookie: mockSetCookie,
    document: mockDocument,
    window: mockWindow,
    propertyConfig: mockPropertyConfig
  });
};

var key = function(name) {
  return '_sdsat_' + name;
};

describe('visitor tracking', function() {
  beforeEach(function() {
    mockGetCookie.calls.reset();
    mockSetCookie.calls.reset();
    cookieValues = {};
  });

  it('tracks the landing page if the current page is the landing page', function() {
    var url1 = mockWindow.location.href;
    var url2 = 'http://visitortracking.com/somethingelse.html';
    var url1CookieRegex = /http:\/\/visitortracking\.com\/test\.html?p=123|456\|\d+$/;

    var visitorTracking = getVisitorTracking(true);
    var cookieValue = cookieValues[key('landing_page')];
    expect(visitorTracking.getLandingPage()).toBe(url1);
    expect(url1CookieRegex.test(cookieValue)).toBe(true);

    mockWindow.location.href = url2;

    visitorTracking = getVisitorTracking(true);
    cookieValue = cookieValues[key('landing_page')];
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
    expect(mockSetCookie).toHaveBeenCalledWith(key('session_count'), 1, 365 * 2);

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionCount()).toBe(1);

    // Number of sessions is incremented only if the landing page cookie has not been set.
    delete cookieValues[key('landing_page')];

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionCount()).toBe(2);
    expect(mockSetCookie).toHaveBeenCalledWith(key('session_count'), 2, 365 * 2);
  });

  it('tracks lifetime pages viewed', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getLifetimePageViewCount()).toBe(1);
    expect(mockSetCookie).toHaveBeenCalledWith(key('lt_pages_viewed'), 1, 365 * 2);

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getLifetimePageViewCount()).toBe(2);
    expect(mockSetCookie).toHaveBeenCalledWith(key('lt_pages_viewed'), 2, 365 * 2);
  });

  it('tracks session pages viewed', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionPageViewCount()).toBe(1);
    expect(mockSetCookie).toHaveBeenCalledWith(key('pages_viewed'), 1);

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionPageViewCount()).toBe(2);
    expect(mockSetCookie).toHaveBeenCalledWith(key('pages_viewed'), 2);
  });

  it('tracks traffic source', function() {
    var referrer1 = mockDocument.referrer;
    var referrer2 = 'http://otherreferrer.com';

    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getTrafficSource()).toBe(referrer1);
    expect(mockSetCookie).toHaveBeenCalledWith(key('traffic_source'), referrer1);

    mockDocument.referrer = referrer2;

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getTrafficSource()).toBe(referrer1);
    expect(mockSetCookie).not.toHaveBeenCalledWith(key('traffic_source'), referrer2);
  });
  
  it('tracks whether the visitor is new', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getIsNewVisitor()).toBe(true);

    // The visitor is considered "returning" if more than one session has been recorded.
    // The session count is incremented when the landing page cookie has not been set.
    // Therefore, to make getIsNewVisitor() return false we have to reset the landing page cookie.
    delete cookieValues[key('landing_page')];

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getIsNewVisitor()).toBe(false);
  });

  it('reflects whether tracking is enabled', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.trackingEnabled).toBe(true);
    visitorTracking = getVisitorTracking(false);
    expect(visitorTracking.trackingEnabled).toBe(false);
  });

  it('throws an error when calling a method and visitor tracking is disabled', function() {
    var visitorTracking = getVisitorTracking(false);
    expect(visitorTracking.getLandingPage).toThrowError('Visitor tracking not enabled.');
  });
});
