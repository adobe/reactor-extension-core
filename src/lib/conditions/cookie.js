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

import textMatch from '../helpers/textMatch.js';
import validateInjectedParams from '../../helpers/validate-injected-params.js'

function injectCookie({ cookie: cookieImpl }) {
  /**
   * Cookie condition. Determines if a particular cookie's actual value matches an acceptable value.
   * @param {Object} settings Condition settings.
   * @param {string} settings.name The name of the cookie.
   * @param {Object[]} settings.cookieValues Acceptable cookie values to match.
   * @param {string} settings.cookieValues[].value An acceptable cookie value.
   * @param {string} [settings.cookieValues[].valueIsRegex=false] Is the cookie
   * value a Regular Expression?
   * DEPRECATED @param {string=} settings.value An acceptable cookie value.
   * DEPRECATED @param {boolean=} [settings.valueIsRegex=false] Whether <code>settings.value</code>
   * is intended to be a regular expression.
   * @returns {boolean}
   */
  return function cookie(settings) {
    // empty strings aren't allowed because a cookieValue is required in the UI.
    var storedCookie = cookieImpl.get(settings.name);
    if (!storedCookie) {
      return false;
    }

    var cookieValues;
    if (!Array.isArray(settings.cookieValues)) {
      // legacy support
      cookieValues = [
        { value: settings.value, valueIsRegex: Boolean(settings.valueIsRegex) }
      ];
    } else {
      cookieValues = settings.cookieValues;
    }

    return cookieValues.some(function (acceptableCookieValue) {
      var acceptableValue = acceptableCookieValue.valueIsRegex
        ? new RegExp(acceptableCookieValue.value, 'i')
        : acceptableCookieValue.value;

      return textMatch(storedCookie, acceptableValue);
    });
  };
}

const validateInjection = validateInjectedParams(injectCookie);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  cookie: require('@adobe/reactor-cookie')
});

/* START.TESTS_ONLY */
export { validateInjection as injectCookie };
/* END.TESTS_ONLY */
