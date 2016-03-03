'use strict';

var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
var cookie = publicRequire('cookie');

var getCookieString = function(cookieValues) {
  var cookieString = '';
  Object.keys(cookieValues).forEach(function(key) {
    cookieString += cookie.serialize(key, cookieValues[key]) + ';';
  });

  return cookieString;
};

var getCookieValues = function(cookieString) {
  var cookieValues = cookie.parse(cookieString);
  delete cookieValues['Expires'];

  return cookieValues;
};

var removeCookie = function(cookieName, cookieString) {
  var cookieValues = getCookieValues(cookieString);

  delete cookieValues['Expires'];
  delete cookieValues[cookieName];

  return getCookieString(cookieValues);
};

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

var mockCookie = {
  serialize: jasmine.createSpy('serialize').and.callFake(function(name, value, options) {
    var cookieValues = getCookieValues(mockDocument.cookie);
    cookieValues[name] = value;

    return getCookieString(cookieValues);
  }),
  parse: cookie.parse
};

var mockDocument;

var visitorTrackingInjector = require('inject!../visitorTracking');

var getVisitorTracking = function(enableTracking) {
  var visitorTracking = visitorTrackingInjector({
    cookie: mockCookie,
    document: mockDocument,
    window: mockWindow,
    logger: mockLogger
  });

  if (enableTracking) {
    visitorTracking.enable();
  }

  return visitorTracking;
};

var key = function(name) {
  return '_sdsat_' + name;
};

describe('visitor tracking', function() {
  beforeEach(function() {
    mockDocument = {
      referrer: 'http://testreferrer.com/test.html',
      cookie: ''
    };
  });

  it('tracks the landing page if the current page is the landing page', function() {
    var url1 = mockWindow.location.href;
    var url2 = 'http://visitortracking.com/somethingelse.html';
    var url1CookieRegex = /http:\/\/visitortracking\.com\/test\.html?p=123|456\|\d+$/;

    var visitorTracking = getVisitorTracking(true);

    var cookieValue = cookie.parse(mockDocument.cookie)[key('landing_page')];
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
    expect(mockCookie.serialize).toHaveBeenCalledWith(key('session_count'), 1, jasmine.any(Object));

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionCount()).toBe(1);

    // Number of sessions is incremented only if the landing page cookie has not been set.
    mockDocument.cookie = removeCookie(key('landing_page'), mockDocument.cookie);

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionCount()).toBe(2);
    expect(mockCookie.serialize).toHaveBeenCalledWith(key('session_count'), 2, jasmine.any(Object));
  });

  it('tracks lifetime pages viewed', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getLifetimePageViewCount()).toBe(1);
    expect(mockCookie.serialize)
      .toHaveBeenCalledWith(key('lt_pages_viewed'), 1, jasmine.any(Object));

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getLifetimePageViewCount()).toBe(2);
    expect(mockCookie.serialize)
      .toHaveBeenCalledWith(key('lt_pages_viewed'), 2, jasmine.any(Object));
  });

  it('tracks session pages viewed', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionPageViewCount()).toBe(1);
    expect(mockCookie.serialize).toHaveBeenCalledWith(key('pages_viewed'), 1, jasmine.any(Object));

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getSessionPageViewCount()).toBe(2);
    expect(mockCookie.serialize).toHaveBeenCalledWith(key('pages_viewed'), 2, jasmine.any(Object));
  });

  it('tracks traffic source', function() {
    var referrer1 = mockDocument.referrer;
    var referrer2 = 'http://otherreferrer.com';

    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getTrafficSource()).toBe(referrer1);
    expect(mockCookie.serialize)
      .toHaveBeenCalledWith(key('traffic_source'), referrer1, jasmine.any(Object));

    mockDocument.referrer = referrer2;

    visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getTrafficSource()).toBe(referrer1);
    expect(mockCookie.serialize)
      .not.toHaveBeenCalledWith(key('traffic_source'), referrer2, jasmine.any(Object));
  });
  
  it('tracks whether the visitor is new', function() {
    var visitorTracking = getVisitorTracking(true);
    expect(visitorTracking.getIsNewVisitor()).toBe(true);

    // The visitor is considered "returning" if more than one session has been recorded.
    // The session count is incremented when the landing page cookie has not been set.
    // Therefore, to make getIsNewVisitor() return false we have to reset the landing page cookie.
    mockDocument.cookie = removeCookie(key('landing_page'), mockDocument.cookie);

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
