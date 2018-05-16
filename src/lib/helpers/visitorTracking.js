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

var cookie = require('@adobe/reactor-cookie');
var document = require('@adobe/reactor-document');
var window = require('@adobe/reactor-window');
var getNamespacedStorage = require('./getNamespacedStorage');

var COOKIE_PREFIX = '_sdsat_';
var LOCAL_STORAGE_NAMESPACE = 'visitorTracking.';
var MIGRATED_KEY = 'cookiesMigrated';

var visitorTrackingLocalStorage = getNamespacedStorage('localStorage', LOCAL_STORAGE_NAMESPACE);
var visitorTrackingSessionStorage = getNamespacedStorage('sessionStorage', LOCAL_STORAGE_NAMESPACE);

// returns whether this is a new visitor session
var trackLandingPageAndTime = function() {
  var existingLandingPage = visitorTrackingSessionStorage.getItem('landingPage');

  if (!existingLandingPage) {
    visitorTrackingSessionStorage.setItem('landingPage', window.location.href);
    visitorTrackingSessionStorage.setItem('landingTime', new Date().getTime());
  }

  return !existingLandingPage;
};

var getLandingPage = function() {
  return visitorTrackingSessionStorage.getItem('landingPage');
};

var getLandingTime = function() {
  return Number(visitorTrackingSessionStorage.getItem('landingTime'));
};

var getSessionCount = function() {
  return Number(visitorTrackingLocalStorage.getItem('sessionCount'));
};

var getLifetimePageViewCount = function() {
  return Number(visitorTrackingLocalStorage.getItem('pagesViewed'));
};

var getMinutesOnSite = function() {
  var now = new Date().getTime();
  return Math.floor((now - getLandingTime()) / 1000 / 60);
};

var getTrafficSource = function() {
  return visitorTrackingSessionStorage.getItem('trafficSource');
};

var getSessionPageViewCount = function() {
  return Number(visitorTrackingSessionStorage.getItem('pagesViewed'));
};

var getIsNewVisitor = function() {
  return getSessionCount() === 1;
};

var trackSessionCount = function(newSession) {
  if (newSession) {
    visitorTrackingLocalStorage.setItem('sessionCount', getSessionCount() + 1);
  }
};

var trackSessionPageViewCount = function() {
  visitorTrackingSessionStorage.setItem('pagesViewed', getSessionPageViewCount() + 1);
};

var trackLifetimePageViewCount = function() {
  visitorTrackingLocalStorage.setItem('pagesViewed', getLifetimePageViewCount() + 1);
};

var trackTrafficSource = function() {
  if (!visitorTrackingSessionStorage.getItem('trafficSource')) {
    visitorTrackingSessionStorage.setItem('trafficSource', document.referrer);
  }
};

// Remove when migration period has ended. We intentionally leave cookies as they are so that if
// DTM is running on the same domain it can still use the persisted values. Our migration strategy
// is essentially copying data from cookies and then diverging the storage mechanism between
// DTM and Launch (DTM uses cookies and Launch uses session and local storage).
var migrateCookieData = function() {
  if (!visitorTrackingLocalStorage.getItem(MIGRATED_KEY)) {
    // We intentionally do not migrate session-based data since it would only affect a user that
    // came from a page running DTM to a page running Launch and only the first visit.
    var sessionCount = cookie.get(COOKIE_PREFIX + 'session_count');

    if (sessionCount) {
      visitorTrackingLocalStorage.setItem('sessionCount', sessionCount);
    }

    var lifetimePagesViewed = cookie.get(COOKIE_PREFIX + 'lt_pages_viewed');

    if (lifetimePagesViewed) {
      visitorTrackingLocalStorage.setItem('pagesViewed', lifetimePagesViewed);
    }

    visitorTrackingLocalStorage.setItem(MIGRATED_KEY, true);
  }
};

var trackVisitor = function() {
  var newSession = trackLandingPageAndTime();
  trackSessionCount(newSession);
  trackLifetimePageViewCount();
  trackSessionPageViewCount();
  trackTrafficSource();
};

migrateCookieData();
trackVisitor();

module.exports = {
  getLandingPage: getLandingPage,
  getLandingTime: getLandingTime,
  getMinutesOnSite: getMinutesOnSite,
  getSessionCount: getSessionCount,
  getLifetimePageViewCount: getLifetimePageViewCount,
  getSessionPageViewCount: getSessionPageViewCount,
  getTrafficSource: getTrafficSource,
  getIsNewVisitor: getIsNewVisitor
};
