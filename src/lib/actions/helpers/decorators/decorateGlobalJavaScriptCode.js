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

import validateInjectedParams from '../../../../helpers/validate-injected-params.js';

function injectDecorateGlobalJavaScriptCode({ Promise }) {
  return function decorateGlobalJavaScriptCode(_, source) {
    // The line break after the source is important in case their last line of code is a comment.
    return {
      code: '<scr' + 'ipt>\n' + source + '\n</scr' + 'ipt>',
      promise: Promise.resolve()
    };
  };
}

const validateInjection = validateInjectedParams(
  injectDecorateGlobalJavaScriptCode
);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  Promise: require('@adobe/reactor-promise')
});

/* START.TESTS_ONLY */
export { validateInjection as injectDecorateGlobalJavaScriptCode };
/* END.TESTS_ONLY */
