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

var cookie = require('@turbine/cookie');
var document = require('@turbine/document');
var window = require('@turbine/window');
var logger = require('@turbine/logger');

var key = function(name) {
  return '_sdsat_' + name;
};

var PAGE_TIME_DELIMITER = '|';

// returns whether this is a new visitor session
var trackLandingPage = function() {
  var landingPageKey = key('landing_page');
  var existingLanding = cookie.get(landingPageKey);

  if (!existingLanding) {
    cookie.set(landingPageKey, window.location.href + PAGE_TIME_DELIMITER + (new Date().getTime()));
  }

  return !existingLanding;
};

var getLandingPage = function() {
  var value = cookie.get(key('landing_page'));
  return value ? value.substr(0, value.lastIndexOf(PAGE_TIME_DELIMITER)) : null;
};

var getLandingTime = function() {
  var value = cookie.get(key('landing_page'));
  return value ? Number(value.substr(value.lastIndexOf(PAGE_TIME_DELIMITER) + 1)) : null;
};

var getMinutesOnSite = function() {
  var now = new Date().getTime();
  return Math.floor((now - getLandingTime()) / 1000 / 60);
};

var trackSessionCount = function(newSession) {
  if (!newSession) {
    return;
  }
  var session = getSessionCount();
  cookie.set(key('session_count'), session + 1, { expires: 365 * 2 /* two years */ });
};

var getSessionCount = function() {
  return Number(cookie.get(key('session_count')) || '0');
};

var getIsNewVisitor = function() {
  return getSessionCount() === 1;
};

var trackSessionPageViewCount = function() {
  cookie.set(key('pages_viewed'), getSessionPageViewCount() + 1);
};

var trackLifetimePageViewCount = function() {
  cookie.set(key('lt_pages_viewed'), getLifetimePageViewCount() + 1, { expires: 365 * 2 });
};

var getLifetimePageViewCount = function() {
  return Number(cookie.get(key('lt_pages_viewed')) || 0);
};

var getSessionPageViewCount = function() {
  return Number(cookie.get(key('pages_viewed')) || 0);
};

var trackTrafficSource = function() {
  var k = key('traffic_source');
  if (!cookie.get(k)) {
    cookie.set(k, document.referrer);
  }
};

var getTrafficSource = function() {
  return cookie.get(key('traffic_source'));
};

var trackVisitor = function() {
  var newSession = trackLandingPage();
  trackSessionCount(newSession);
  trackLifetimePageViewCount();
  trackSessionPageViewCount();
  trackTrafficSource();
};

var enabled = false;

/**
 * Enables visitor tracking. To be consistent with prior library versions, visitor tracking should
 * only be enabled (run) if a rule for the property is configured with a condition that needs it.
 * This is primarily to avoid unnecessary cookie storage. Each condition that requires visitor
 * tracking to run must call this function to ensure visitor tracking will run.
 */
var enable = function() {
  if (!enabled) {
    enabled = true;
    trackVisitor();
  }
};

var wrapForEnablement = function(fn) {
  return function() {
    if (!enabled) {
      logger.error('Visitor tracking not enabled. Data may be inaccurate.');
    }

    return fn.apply(this, arguments);
  };
};

module.exports = {
  getLandingPage: wrapForEnablement(getLandingPage),
  getLandingTime: wrapForEnablement(getLandingTime),
  getMinutesOnSite: wrapForEnablement(getMinutesOnSite),
  getSessionCount: wrapForEnablement(getSessionCount),
  getLifetimePageViewCount: wrapForEnablement(getLifetimePageViewCount),
  getSessionPageViewCount: wrapForEnablement(getSessionPageViewCount),
  getTrafficSource: wrapForEnablement(getTrafficSource),
  getIsNewVisitor: wrapForEnablement(getIsNewVisitor),
  enable: enable
};
