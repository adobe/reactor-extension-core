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

var document = require('@adobe/reactor-document');
var window = require('@adobe/reactor-window');
var getNamespacedStorage = require('./getNamespacedStorage');

var STORAGE_NAMESPACE = 'visitorTracking';

var visitorTrackingLocalStorage = getNamespacedStorage(
  'localStorage',
  STORAGE_NAMESPACE
);
var visitorTrackingSessionStorage = getNamespacedStorage(
  'sessionStorage',
  STORAGE_NAMESPACE
);

// returns whether this is a new visitor session
var trackLandingPageAndTime = function () {
  var existingLandingPage =
    visitorTrackingSessionStorage.getItem('landingPage');

  if (!existingLandingPage) {
    visitorTrackingSessionStorage.setItem('landingPage', window.location.href);
    visitorTrackingSessionStorage.setItem('landingTime', new Date().getTime());
  }

  return !existingLandingPage;
};

var getLandingPage = function () {
  return visitorTrackingSessionStorage.getItem('landingPage');
};

var getLandingTime = function () {
  return Number(visitorTrackingSessionStorage.getItem('landingTime'));
};

var getSessionCount = function () {
  return Number(visitorTrackingLocalStorage.getItem('sessionCount'));
};

var getLifetimePageViewCount = function () {
  return Number(visitorTrackingLocalStorage.getItem('pagesViewed'));
};

var getMinutesOnSite = function () {
  var now = new Date().getTime();
  return Math.floor((now - getLandingTime()) / 1000 / 60);
};

var getTrafficSource = function () {
  return visitorTrackingSessionStorage.getItem('trafficSource');
};

var getSessionPageViewCount = function () {
  return Number(visitorTrackingSessionStorage.getItem('pagesViewed'));
};

var getIsNewVisitor = function () {
  return getSessionCount() === 1;
};

var trackSessionCount = function (newSession) {
  if (newSession) {
    visitorTrackingLocalStorage.setItem('sessionCount', getSessionCount() + 1);
  }
};

var trackSessionPageViewCount = function () {
  visitorTrackingSessionStorage.setItem(
    'pagesViewed',
    getSessionPageViewCount() + 1
  );
};

var trackLifetimePageViewCount = function () {
  visitorTrackingLocalStorage.setItem(
    'pagesViewed',
    getLifetimePageViewCount() + 1
  );
};

var trackTrafficSource = function () {
  if (!visitorTrackingSessionStorage.getItem('trafficSource')) {
    visitorTrackingSessionStorage.setItem('trafficSource', document.referrer);
  }
};

var trackVisitor = function () {
  var newSession = trackLandingPageAndTime();
  trackSessionCount(newSession);
  trackLifetimePageViewCount();
  trackSessionPageViewCount();
  trackTrafficSource();
};

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
