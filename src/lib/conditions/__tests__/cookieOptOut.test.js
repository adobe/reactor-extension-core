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

var conditionDelegateInjector = require('inject!../cookieOptOut');

var conditionDelegate;

var cookie = require('cookie');

var setCookie = function(name, value, days) {
  var options = {};

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    options.expires = date;
  }

  document.cookie = cookie.serialize(name, value, options);
};

var removeCookie = function(name) {
  setCookie(name, '', -1);
};

var getSettings = function(acceptsCookies) {
  return {
    acceptsCookies: acceptsCookies
  };
};

describe('cookie opt-out condition delegate', function() {
  var runTests = function(customCookieName) {
    describe('with ' + customCookieName ? 'custom cookie name' : 'default cookie name', function() {
      var cookieName = 'sat_track';
      var mockPropertySettings;

      beforeAll(function() {
        mockPropertySettings = {};

        if (customCookieName) {
          mockPropertySettings.euCookieName = customCookieName;
          cookieName = customCookieName;
        } else {
          delete mockPropertySettings.euCookieName;
        }
        
        conditionDelegate = conditionDelegateInjector({
          '@turbine/property-settings': mockPropertySettings
        });
      });

      it('returns true when the cookie is set to "true" and acceptsCookies is true', function() {
        setCookie(cookieName, 'true');
        var settings = getSettings(true);
        expect(conditionDelegate(settings)).toBe(true);
        removeCookie(cookieName);
      });

      it('returns false when the cookie is set to "false" and acceptsCookies is true', function() {
        setCookie(cookieName, 'false');
        var settings = getSettings(true);
        expect(conditionDelegate(settings)).toBe(false);
        removeCookie(cookieName);
      });

      it('returns false when the cookie is set to "true" and acceptsCookies is false', function() {
        setCookie(cookieName, 'true');
        var settings = getSettings(false);
        expect(conditionDelegate(settings)).toBe(false);
        removeCookie(cookieName);
      });

      it('returns true when the cookie is set to "false" and acceptsCookies is false', function() {
        setCookie(cookieName, 'false');
        var settings = getSettings(false);
        expect(conditionDelegate(settings)).toBe(true);
        removeCookie(cookieName);
      });

      it('returns false when the cookie has not been set and acceptsCookies is true', function() {
        var settings = getSettings(true);
        expect(conditionDelegate(settings)).toBe(false);
      });

      it('returns false when the cookie has not been set and acceptsCookies is false', function() {
        var settings = getSettings(false);
        expect(conditionDelegate(settings)).toBe(false);
      });
    });
  };

  runTests();
  runTests('sat_custom_track');
});
