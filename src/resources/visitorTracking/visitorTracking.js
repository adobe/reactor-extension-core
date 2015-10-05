'use strict';

var getCookie = require('getCookie');
var setCookie = require('setCookie');
var document = require('document');
var window = require('window');
var property = require('property');

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

var throwDisabledError = function() {
  throw new Error('Visitor tracking not enabled.');
};

var trackingEnabled = property.trackVisitor;

if (trackingEnabled) {
  trackVisitor();
}

var wrapForEnablement = function(fn) {
  return trackingEnabled ? fn : throwDisabledError;
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
  trackingEnabled: trackingEnabled
};
