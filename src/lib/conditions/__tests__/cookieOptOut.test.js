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
