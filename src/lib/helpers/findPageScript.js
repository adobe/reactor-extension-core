/***************************************************************************************
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import validateInjectedParams from '../../helpers/validate-injected-params.js';

function injectFindPageScript({ document }) {
  const byRegexPattern = function (regexScriptSrcPattern) {
    const scripts = document.querySelectorAll('script');

    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      // Find the script that loaded our library. Take into account embed scripts migrated
      // from DTM. We'll also consider that they may have added a querystring for cache-busting
      // or whatever.
      if (regexScriptSrcPattern.test(script.src)) {
        return script;
      }
    }
  };

  const getTurbine = function () {
    return byRegexPattern(
      new RegExp(/(launch|satelliteLib)-[^\/]+.js(\?.*)?$/)
    );
  };

  return { getTurbine, byRegexPattern };
}

const validateInjection = validateInjectedParams(injectFindPageScript);

const { getTurbine, byRegexPattern } = validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  document: require('@adobe/reactor-document')
});
export { getTurbine, byRegexPattern };

/* START.TESTS_ONLY */
export { validateInjection as injectFindPageScript };
/* END.TESTS_ONLY */
