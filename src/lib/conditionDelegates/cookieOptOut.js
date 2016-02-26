'use strict';

var getCookie = require('get-cookie');
var propertySettings = require('property-settings');

/**
 * Cookie opt-out condition. Determines whether the user has chosen to accept cookies.
 * @param {Object} settings Condition settings.
 * @param {boolean} settings.acceptsCookies If true, the condition will return
 * true if the user has chosen to accept cookies. If false, the condition will return true if the
 * user has chosen not to accept cookies. If the sat_track cookie has not been set, the condition
 * will return false regardless of the acceptsCookies value.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var cookieName = propertySettings.euCookieName === undefined ?
    'sat_track' :
    propertySettings.euCookieName;
  return getCookie(cookieName) === (settings.acceptsCookies ? 'true' : 'false');
};

