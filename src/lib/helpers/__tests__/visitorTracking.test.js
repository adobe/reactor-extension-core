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
import { injectGetNamespacedStorage } from '../getNamespacedStorage.js';
import cookie from 'js-cookie';

const COOKIE_PREFIX = '_sdsat_';

const defaultLocationHref = '/visitor-tracking/page1/test.html';
function changeWindowLocation(href) {
  window.history.pushState(null, '', href);
}

const defaultDocumentReferrer = 'http://testreferrer.com/test.html';
function createMockDocument(referrer = defaultDocumentReferrer) {
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
  let injectedNameSpacedStorage;
  beforeAll(() => {
    mockTurbineVariable({
      logger: {
        warn: vi.fn(),
        error: vi.fn(),
        log: vi.fn(),
        info: vi.fn()
      }
    });
  });

  beforeEach(() => {
    clearTestCookies();
    window.sessionStorage.clear();
    window.localStorage.clear();
    injectedNameSpacedStorage = injectGetNamespacedStorage({ window });
  });

  it('tracks the landing page if the current page is the landing page', function () {
    changeWindowLocation(defaultLocationHref);
    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
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
      getNamespacedStorage: injectedNameSpacedStorage
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

  it('tracks the landing time', function () {
    jasmine.clock().install();

    const landingDate = new Date();
    jasmine.clock().mockDate(landingDate);

    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.landingTime'
      )
    ).toBe(landingDate.getTime().toString());
    expect(trackedVisit.getLandingTime()).toBe(landingDate.getTime());

    // Simulate moving to a new page. The landing time should remain the same.
    changeWindowLocation('/pages2/something-else.html');

    jasmine.clock().tick(100000);

    trackedVisit = trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.landingTime'
      )
    ).toBe(landingDate.getTime().toString());
    expect(trackedVisit.getLandingTime()).toBe(landingDate.getTime());

    jasmine.clock().uninstall();
  });

  it('tracks minutes on site', function () {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(1000));

    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.landingTime'
      )
    ).toBe('1000');
    expect(trackedVisit.getMinutesOnSite()).toBe(0);

    jasmine.clock().tick(2.7 * 60 * 1000);

    trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.landingTime'
      )
    ).toBe('1000');
    expect(trackedVisit.getMinutesOnSite()).toBe(2);
    jasmine.clock().uninstall();
  });

  it('tracks the number of sessions', function () {
    changeWindowLocation(defaultLocationHref);
    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
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
      getNamespacedStorage: injectedNameSpacedStorage
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
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.sessionCount'
      )
    ).toBe('2');
    expect(trackedVisit.getSessionCount()).toBe(2);
  });

  it('tracks lifetime pages viewed', function () {
    changeWindowLocation(defaultLocationHref);
    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });

    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('1');
    expect(trackedVisit.getLifetimePageViewCount()).toBe(1);

    trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(
      window.localStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('2');
    expect(trackedVisit.getLifetimePageViewCount()).toBe(2);
  });

  it('tracks session pages viewed', function () {
    changeWindowLocation(defaultLocationHref);
    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('1');
    expect(trackedVisit.getSessionPageViewCount()).toBe(1);

    trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.pagesViewed'
      )
    ).toBe('2');
    expect(trackedVisit.getSessionPageViewCount()).toBe(2);
  });

  it('tracks traffic source', function () {
    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.trafficSource'
      )
    ).toBe(defaultDocumentReferrer);
    expect(trackedVisit.getTrafficSource()).toBe(defaultDocumentReferrer);

    const referrer2 = 'http://otherreferrer.com';
    trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(referrer2),
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(
      window.sessionStorage.getItem(
        'com.adobe.reactor.core.visitorTracking.trafficSource'
      )
    ).toBe(defaultDocumentReferrer);
    expect(trackedVisit.getTrafficSource()).toBe(defaultDocumentReferrer);
  });

  it('tracks whether the visitor is new', function () {
    let trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });

    expect(trackedVisit.getIsNewVisitor()).toBe(true);

    // The visitor is considered "returning" if more than one session has been recorded.
    // The session count is incremented when the landing page has not been stored.
    // Therefore, to make getIsNewVisitor() return false we have to reset the stored landing page.
    window.sessionStorage.removeItem(
      'com.adobe.reactor.core.visitorTracking.landingPage'
    );

    trackedVisit = injectVisitorTracking({
      window,
      document: createMockDocument(),
      getNamespacedStorage: injectedNameSpacedStorage
    });
    expect(trackedVisit.getIsNewVisitor()).toBe(false);
  });
});
