/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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
    href: 'http://visitortracking.com/test.html'
  }
};

var mockLogger = {
  error: jasmine.createSpy()
};

var mockDocument = {
  referrer: 'http://testreferrer.com/test.html'
};

var visitorTrackingInjector = require('inject-loader!../visitorTracking');

var getVisitorTracking = function () {
  return visitorTrackingInjector({
    '@adobe/reactor-document': mockDocument,
    '@adobe/reactor-window': mockWindow
  });
};

var COOKIE_PREFIX = '_sdsat_';

var clearTestCookies = function () {
  Object.keys(cookie.get()).forEach(function (cookieName) {
    if (cookieName.indexOf(COOKIE_PREFIX) === 0) {
      cookie.remove(cookieName);
    }
  });
};

describe('visitor tracking', function () {
  var cleanUp = function () {
    clearTestCookies();
    window.sessionStorage.clear();
    window.localStorage.clear();
  };

  beforeEach(cleanUp);

  beforeAll(function () {
    cleanUp();
    mockTurbineVariable({
      logger: mockLogger
    });
  });

  afterAll(function () {
    resetTurbineVariable();
  });

  it('tracks the landing page if the current page is the landing page', function () {
    var url1 = mockWindow.location.href;
    var url2 = 'http://visitortracking.com/somethingelse.html';
    var visitorTracking = getVisitorTracking();

    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.landingPage'
      )
    ).toBe(url1);
    expect(visitorTracking.getLandingPage()).toBe(url1);

    mockWindow.location.href = url2;
    visitorTracking = getVisitorTracking();

    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.landingPage'
      )
    ).toBe(url1);
    expect(visitorTracking.getLandingPage()).toBe(url1);
  });

  it('tracks the landing time', function () {
    jasmine.clock().install();

    var landingDate = new Date();
    jasmine.clock().mockDate(landingDate);

    var visitorTracking = getVisitorTracking();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.landingTime'
      )
    ).toBe(landingDate.getTime().toString());
    expect(visitorTracking.getLandingTime()).toBe(landingDate.getTime());

    // Simulate moving to a new page. The landing time should remain the same.
    mockWindow.location.href = 'http://visitortracking.com/somethingelse.html';

    jasmine.clock().tick(100000);

    visitorTracking = getVisitorTracking();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.landingTime'
      )
    ).toBe(landingDate.getTime().toString());
    expect(visitorTracking.getLandingTime()).toBe(landingDate.getTime());

    jasmine.clock().uninstall();
  });

  it('tracks minutes on site', function () {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(1000));

    var visitorTracking = getVisitorTracking();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.landingTime'
      )
    ).toBe('1000');
    expect(visitorTracking.getMinutesOnSite()).toBe(0);

    jasmine.clock().tick(2.7 * 60 * 1000);

    visitorTracking = getVisitorTracking();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.landingTime'
      )
    ).toBe('1000');
    expect(visitorTracking.getMinutesOnSite()).toBe(2);
    jasmine.clock().uninstall();
  });

  it('tracks the number of sessions', function () {
    var visitorTracking = getVisitorTracking();
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.sessionCount'
      )
    ).toBe('1');
    expect(visitorTracking.getSessionCount()).toBe(1);

    visitorTracking = getVisitorTracking();
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.sessionCount'
      )
    ).toBe('1');
    expect(visitorTracking.getSessionCount()).toBe(1);

    // Number of sessions is incremented only if the landing page has not been stored.
    window.sessionStorage.removeItem(
      'com.adobe.reactor.core.visitorTracking.landingPage'
    );

    visitorTracking = getVisitorTracking();
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.sessionCount'
      )
    ).toBe('2');
    expect(visitorTracking.getSessionCount()).toBe(2);
  });

  it('tracks lifetime pages viewed', function () {
    var visitorTracking = getVisitorTracking();
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('1');
    expect(visitorTracking.getLifetimePageViewCount()).toBe(1);

    visitorTracking = getVisitorTracking();
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('2');
    expect(visitorTracking.getLifetimePageViewCount()).toBe(2);
  });

  it('tracks session pages viewed', function () {
    var visitorTracking = getVisitorTracking();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('1');
    expect(visitorTracking.getSessionPageViewCount()).toBe(1);

    visitorTracking = getVisitorTracking();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('2');
    expect(visitorTracking.getSessionPageViewCount()).toBe(2);
  });

  it('tracks traffic source', function () {
    var referrer1 = mockDocument.referrer;
    var referrer2 = 'http://otherreferrer.com';

    var visitorTracking = getVisitorTracking();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.trafficSource'
      )
    ).toBe(referrer1);
    expect(visitorTracking.getTrafficSource()).toBe(referrer1);

    mockDocument.referrer = referrer2;

    visitorTracking = getVisitorTracking();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.trafficSource'
      )
    ).toBe(referrer1);
    expect(visitorTracking.getTrafficSource()).toBe(referrer1);
  });

  it('tracks whether the visitor is new', function () {
    var visitorTracking = getVisitorTracking();

    expect(visitorTracking.getIsNewVisitor()).toBe(true);

    // The visitor is considered "returning" if more than one session has been recorded.
    // The session count is incremented when the landing page has not been stored.
    // Therefore, to make getIsNewVisitor() return false we have to reset the stored landing page.
    window.sessionStorage.removeItem(
      'com.adobe.reactor.core.visitorTracking.landingPage'
    );

    visitorTracking = getVisitorTracking();
    expect(visitorTracking.getIsNewVisitor()).toBe(false);
  });
});
