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

import getNamespacedStorage from './getNamespacedStorage.js';
import validateInjectedParams from '../../helpers/validate-injected-params.js';

function injectVisitorTracking({ window, document, getNamespacedStorage }) {
  // these allow the user to introspect about the tracking that happened when
  // this function invokes on module load.
  let getters;
  // Track right away
  (function visitorTracking() {
    const STORAGE_NAMESPACE = 'visitorTracking';

    const visitorTrackingLocalStorage = getNamespacedStorage(
      'localStorage',
      STORAGE_NAMESPACE
    );
    const visitorTrackingSessionStorage = getNamespacedStorage(
      'sessionStorage',
      STORAGE_NAMESPACE
    );

    // returns whether this is a new visitor session
    const trackLandingPageAndTime = function () {
      const existingLandingPage =
        visitorTrackingSessionStorage.getItem('landingPage');

      if (!existingLandingPage) {
        visitorTrackingSessionStorage.setItem(
          'landingPage',
          window.location.href
        );
        visitorTrackingSessionStorage.setItem(
          'landingTime',
          new Date().getTime()
        );
      }

      return !existingLandingPage;
    };

    const getLandingPage = function () {
      return visitorTrackingSessionStorage.getItem('landingPage');
    };

    const getLandingTime = function () {
      return Number(visitorTrackingSessionStorage.getItem('landingTime'));
    };

    const getSessionCount = function () {
      return Number(visitorTrackingLocalStorage.getItem('sessionCount'));
    };

    const getLifetimePageViewCount = function () {
      return Number(visitorTrackingLocalStorage.getItem('pagesViewed'));
    };

    const getMinutesOnSite = function () {
      const now = new Date().getTime();
      return Math.floor((now - getLandingTime()) / 1000 / 60);
    };

    const getTrafficSource = function () {
      return visitorTrackingSessionStorage.getItem('trafficSource');
    };

    const getSessionPageViewCount = function () {
      return Number(visitorTrackingSessionStorage.getItem('pagesViewed'));
    };

    const getIsNewVisitor = function () {
      return getSessionCount() === 1;
    };

    const trackSessionCount = function (newSession) {
      if (newSession) {
        visitorTrackingLocalStorage.setItem(
          'sessionCount',
          getSessionCount() + 1
        );
      }
    };

    const trackSessionPageViewCount = function () {
      visitorTrackingSessionStorage.setItem(
        'pagesViewed',
        getSessionPageViewCount() + 1
      );
    };

    const trackLifetimePageViewCount = function () {
      visitorTrackingLocalStorage.setItem(
        'pagesViewed',
        getLifetimePageViewCount() + 1
      );
    };

    const trackTrafficSource = function () {
      if (!visitorTrackingSessionStorage.getItem('trafficSource')) {
        visitorTrackingSessionStorage.setItem(
          'trafficSource',
          document.referrer
        );
      }
    };

    (function trackVisitor() {
      const newSession = trackLandingPageAndTime();
      trackSessionCount(newSession);
      trackLifetimePageViewCount();
      trackSessionPageViewCount();
      trackTrafficSource();
    })();

    getters = {
      getLandingPage,
      getLandingTime,
      getMinutesOnSite,
      getSessionCount,
      getLifetimePageViewCount,
      getSessionPageViewCount,
      getTrafficSource,
      getIsNewVisitor
    };
  })();

  return getters;
}

const validateInjection = validateInjectedParams(injectVisitorTracking);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  window: require('@adobe/reactor-window'),
  document: require('@adobe/reactor-document'),
  getNamespacedStorage
});

/* START.TESTS_ONLY */
export { validateInjection as injectVisitorTracking };
/* END.TESTS_ONLY */
