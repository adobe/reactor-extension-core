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

import validateInjectedParams from '../../helpers/validate-injected-params.js'

function injectQueryStringParameter({ window, queryString }) {
  /**
   * The query string parameter data element.
   * @param {Object} settings The data element settings object.
   * @param {string} settings.name The query string parameter name.
   * @param {string} [settings.caseInsensitive] Whether casing should be ignored.
   * @returns {string}
   */
  return function queryStringParameter(settings) {
    const queryParams = queryString.parse(window.location.search);

    if (settings.caseInsensitive) {
      const lowerCaseName = settings.name.toLowerCase();
      const keys = Object.keys(queryParams);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.toLowerCase() === lowerCaseName) {
          return queryParams[key];
        }
      }
    } else {
      return queryParams[settings.name];
    }
  };
}

const validateInjection = validateInjectedParams(injectQueryStringParameter);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  window: require('@adobe/reactor-window'),
  queryString: require('@adobe/reactor-query-string')
});

/* START.TESTS_ONLY */
export { validateInjection as injectQueryStringParameter };
/* END.TESTS_ONLY */
