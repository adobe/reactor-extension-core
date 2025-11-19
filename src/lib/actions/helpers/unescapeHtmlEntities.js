/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import validateInjectedParams from '../../../helpers/validate-injected-params';

function injectUnescapeHtmlCode({ document }) {
  const el = document.createElement('div');

  return function unescapeHtmlCode(html) {
    el.innerHTML = html;
    // IE and Firefox differ.
    return el.textContent || el.innerText || html;
  };
}

const validateInjection = validateInjectedParams(injectUnescapeHtmlCode);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  document: require('@adobe/reactor-document')
});

/* START.TESTS_ONLY */
export { validateInjection as injectUnescapeHtmlEntities };
/* END.TESTS_ONLY */
