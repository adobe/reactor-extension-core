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

import { injectVisitorTracking } from '../visitorTracking.js';
import getNamespacedStorage from '../getNamespacedStorage.js';
import cookie from 'js-cookie';

const COOKIE_PREFIX = '_sdsat_';

const defaultLocationHref = '/visitor-tracking/page1/test.html';
function changeWindowLocation(href) {
  window.history.pushState(null, '', href);
}

function createMockDocument(referrer = 'http://testreferrer.com/test.html') {
  return { referrer };
}

function clearTestCookies() {
  Object.keys(cookie.get()).forEach(function (cookieName) {
    if (cookieName.indexOf(COOKIE_PREFIX) === 0) {
      cookie.remove(cookieName);
    }
  });
}

describe('visitor tracking', function () {
  beforeAll(() => {
    mockTurbineVariable({
      logger: jasmine.createSpyObj('logger', ['warn', 'error', 'log', 'info'])
    });
  });

  beforeEach(() => {
    clearTestCookies();
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it('tracks the landing page if the current page is the landing page', function () {
    changeWindowLocation(defaultLocationHref);
    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage
    });

    expect(
      window.sessionStorage
        .getItem('com.adobe.reactor.core.visitorTracking.landingPage')
        .includes(defaultLocationHref)
    ).toBeTrue(
      `(1) expected ${defaultLocationHref} to appear in the initial landing page`
    );
    expect(
      trackedVisit.getLandingPage().includes(defaultLocationHref)
    ).toBeTrue(
      `(2) expected ${defaultLocationHref} to appear in the initial landing page`
    );

    const url2 = '/visitor-tracking/somethingelse.html';
    changeWindowLocation(url2);
    trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage
    });

    expect(
      window.sessionStorage
        .getItem('com.adobe.reactor.core.visitorTracking.landingPage')
        .includes(defaultLocationHref)
    ).toBeTrue(
      `(3) expected ${defaultLocationHref} to appear in the initial landing page in local storage`
    );
    expect(
      trackedVisit.getLandingPage().includes(defaultLocationHref)
    ).toBeTrue(
      `(4) expected ${defaultLocationHref} to appear in the initial landing page`
    );
  });

  // fit('tracks the landing time', function () {
  //   // jasmine.clock().install();
  //   //
  //   const landingDate = new Date();
  //   // jasmine.clock().mockDate(landingDate);
  //
  //   let visitorTracking = trackVisit();
  //   expect(
  //     window.sessionStorage.getItem(
  //       'com.adobe.reactor.core.visitorTracking.landingTime'
  //     )
  //   ).toBe(landingDate.getTime().toString());
  //   expect(visitorTracking.getLandingTime()).toBe(landingDate.getTime());
  //
  //   // Simulate moving to a new page. The landing time should remain the same.
  //   mockWindow.location.href = 'http://visitortracking.com/somethingelse.html';
  //
  //   jasmine.clock().tick(100000);
  //
  //   visitorTracking = trackVisit();
  //   expect(
  //     window.sessionStorage.getItem(
  //       'com.adobe.reactor.core.visitorTracking.landingTime'
  //     )
  //   ).toBe(landingDate.getTime().toString());
  //   expect(visitorTracking.getLandingTime()).toBe(landingDate.getTime());
  //
  //   jasmine.clock().uninstall();
  // });
  //
  // fit('tracks minutes on site', function () {
  //   jasmine.clock().install();
  //   jasmine.clock().mockDate(new Date(1000));
  //
  //   let visitorTracking = trackVisit();
  //   expect(
  //     window.sessionStorage.getItem(
  //       'com.adobe.reactor.core.visitorTracking.landingTime'
  //     )
  //   ).toBe('1000');
  //   expect(visitorTracking.getMinutesOnSite()).toBe(0);
  //
  //   jasmine.clock().tick(2.7 * 60 * 1000);
  //
  //   visitorTracking = trackVisit();
  //   expect(
  //     window.sessionStorage.getItem(
  //       'com.adobe.reactor.core.visitorTracking.landingTime'
  //     )
  //   ).toBe('1000');
  //   expect(visitorTracking.getMinutesOnSite()).toBe(2);
  //   jasmine.clock().uninstall();
  // });

  it('tracks the number of sessions', function () {
    changeWindowLocation(defaultLocationHref);
    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage
    });
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.sessionCount'
      )
    ).toBe('1');
    expect(trackedVisit.getSessionCount()).toBe(1);

    trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage
    });
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.sessionCount'
      )
    ).toBe('1');
    expect(trackedVisit.getSessionCount()).toBe(1);

    // Number of sessions is incremented only if the landing page has not been stored.
    window.sessionStorage.removeItem(
      'com.adobe.reactor.core.visitorTracking.landingPage'
    );

    trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage
    });
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.sessionCount'
      )
    ).toBe('2');
    expect(trackedVisit.getSessionCount()).toBe(2);
  });

  fit('tracks lifetime pages viewed', function () {
    expect(
      Number(
        window.localStorage.getItem(
          'com.adobe.reactor.core.visitorTracking.pagesViewed'
        )
      )
    ).toBe(0, 'checked localStorage for 0');
    expect(
      Number(
        window.sessionStorage.getItem(
          'com.adobe.reactor.core.visitorTracking.pagesViewed'
        )
      )
    ).toBe(0, 'checked sessionStorage for 0');

    clearTestCookies();
    window.sessionStorage.clear();
    window.localStorage.clear();

    changeWindowLocation(defaultLocationHref);
    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage
    });
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('1', 'checked localStorage for 1');
    expect(trackedVisit.getLifetimePageViewCount()).toBe(
      1,
      'getLifetimePageViewCount() should have been 1'
    );

    // trackedVisit = injectVisitorTracking({
    //   window: createMockWindow(defaultLocationHref),
    //   document: createMockDocument(),
    //   getNamespacedStorage
    // });
    // expect(
    //   window.localStorage.getItem(
    //     'com.adobe.reactor.core.visitorTracking.pagesViewed'
    //   )
    // ).toBe('2');
    // expect(trackedVisit.getLifetimePageViewCount()).toBe(2);
  });

  it('tracks session pages viewed', function () {
    let visitorTracking = trackVisit();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('1');
    expect(visitorTracking.getSessionPageViewCount()).toBe(1);

    visitorTracking = trackVisit();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('2');
    expect(visitorTracking.getSessionPageViewCount()).toBe(2);
  });

  it('tracks traffic source', function () {
    const referrer1 = mockDocument.referrer;
    const referrer2 = 'http://otherreferrer.com';

    let visitorTracking = trackVisit();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.trafficSource'
      )
    ).toBe(referrer1);
    expect(visitorTracking.getTrafficSource()).toBe(referrer1);

    mockDocument.referrer = referrer2;

    visitorTracking = trackVisit();
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.trafficSource'
      )
    ).toBe(referrer1);
    expect(visitorTracking.getTrafficSource()).toBe(referrer1);
  });

  it('tracks whether the visitor is new', function () {
    let visitorTracking = trackVisit();

    expect(visitorTracking.getIsNewVisitor()).toBe(true);

    // The visitor is considered "returning" if more than one session has been recorded.
    // The session count is incremented when the landing page has not been stored.
    // Therefore, to make getIsNewVisitor() return false we have to reset the stored landing page.
    window.sessionStorage.removeItem(
      'com.adobe.reactor.core.visitorTracking.landingPage'
    );

    visitorTracking = trackVisit();
    expect(visitorTracking.getIsNewVisitor()).toBe(false);
  });
});
