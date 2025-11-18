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

import textMatch from '../helpers/textMatch';
import validateInjectedParams from '../../helpers/validate-injected-params.js';

function injectPathAndQuerystring({ document, textMatch }) {
  /**
   * Path and query string condition. Provided for legacy reasons. Determines if the actual path +
   * query string matches at least one acceptable path + query string.
   * @param {Object} settings Condition settings.
   * @param {Object[]} settings.paths Acceptable paths.
   * @param {string} settings.paths[].value An acceptable path value.
   * @param {boolean} [settings.paths[].valueIsRegex=false] Whether <code>value</code> on the object
   * instance is intended to be a regular expression.
   * @returns {boolean}
   */
  return function pathAndQuerystringCondition(settings) {
    const path = document.location.pathname + document.location.search;
    return settings.paths.some(function (acceptablePath) {
      const acceptableValue = acceptablePath.valueIsRegex
        ? new RegExp(acceptablePath.value, 'i')
        : acceptablePath.value;
      return textMatch(path, acceptableValue);
    });
  };
}

const validateInjection = validateInjectedParams(injectPathAndQuerystring);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  document: require('@adobe/reactor-document'),
  textMatch
});

/* START.TESTS_ONLY */
export { validateInjection as injectPathAndQuerystring };
/* END.TESTS_ONLY */
