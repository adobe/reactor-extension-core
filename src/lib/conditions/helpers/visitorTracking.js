/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

var cookie = require('@turbine/cookie');
var document = require('@turbine/document');
var window = require('@turbine/window');
var logger = require('@turbine/logger');

var key = function(name) {
  return '_sdsat_' + name;
};

var getCookie = function(name) {
  return cookie.parse(document.cookie)[name];
};

var setCookie = function(name, value, days) {
  var options = {};

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    options.expires = date;
  }

  document.cookie = cookie.serialize(name, value, options);
};

var PAGE_TIME_DELIMITER = '|';

// returns whether this is a new visitor session
var trackLandingPage = function() {
  var landingPageKey = key('landing_page');
  var existingLanding = getCookie(landingPageKey);

  if (!existingLanding) {
    setCookie(landingPageKey, window.location.href + PAGE_TIME_DELIMITER + (new Date().getTime()));
  }

  return !existingLanding;
};

var getLandingPage = function() {
  var value = getCookie(key('landing_page'));
  return value ? value.substr(0, value.lastIndexOf(PAGE_TIME_DELIMITER)) : null;
};

var getLandingTime = function() {
  var value = getCookie(key('landing_page'));
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
  setCookie(key('session_count'), session + 1, 365 * 2 /* two years */);
};

var getSessionCount = function() {
  return Number(getCookie(key('session_count')) || '0');
};

var getIsNewVisitor = function() {
  return getSessionCount() === 1;
};

var trackSessionPageViewCount = function() {
  setCookie(key('pages_viewed'), getSessionPageViewCount() + 1);
};

var trackLifetimePageViewCount = function() {
  setCookie(key('lt_pages_viewed'), getLifetimePageViewCount() + 1, 365 * 2);
};

var getLifetimePageViewCount = function() {
  return Number(getCookie(key('lt_pages_viewed')) || 0);
};

var getSessionPageViewCount = function() {
  return Number(getCookie(key('pages_viewed')) || 0);
};

var trackTrafficSource = function() {
  var k = key('traffic_source');
  if (!getCookie(k)) {
    setCookie(k, document.referrer);
  }
};

var getTrafficSource = function() {
  return getCookie(key('traffic_source'));
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
