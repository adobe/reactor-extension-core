'use strict';

var getCookie = require('get-cookie');
var setCookie = require('set-cookie');
var document = require('document');
var window = require('window');
var logger = require('logger');

var key = function(name) {
  return '_sdsat_' + name;
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
