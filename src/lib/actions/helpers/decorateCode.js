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

import decorateGlobalJavaScriptCode from './decorators/decorateGlobalJavaScriptCode';
import decorateNonGlobalJavaScriptCode from './decorators/decorateNonGlobalJavaScriptCode';
import decorateHtmlCode from './decorators/decorateHtmlCode';
import validateInjectedParams from '../../../helpers/validate-injected-params.js';

function injectDecorateCode({
  decorateGlobalJavaScriptCode,
  decorateNonGlobalJavaScriptCode,
  decorateHtmlCode
}) {
  const decorators = {
    javascript: function (action, source) {
      return action.settings.global
        ? decorateGlobalJavaScriptCode(action, source)
        : decorateNonGlobalJavaScriptCode(action, source);
    },
    html: decorateHtmlCode
  };

  return function decorateCode(action, source) {
    return decorators[action.settings.language](action, source);
  };
}

const validateInjection = validateInjectedParams(injectDecorateCode);

export default validateInjection({
  decorateGlobalJavaScriptCode,
  decorateNonGlobalJavaScriptCode,
  decorateHtmlCode
});

/* START.TESTS_ONLY */
export { validateInjection as injectDecorateCode };
/* END.TESTS_ONLY */
