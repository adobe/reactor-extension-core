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

import getObjectProperty from '../helpers/getObjectProperty';
import validateInjectedParams from '../../helpers/validate-injected-params';

function injectJavascriptVariable({ window }) {
  /**
   * The variable data element.
   * @param {Object} settings The data element settings object.
   * @param {string} settings.path The global path to the variable holding the data element value.
   * @returns {string}
   */
  return function javascriptVariable(settings) {
    return getObjectProperty(window, settings.path);
  };
}

const validateInjection = validateInjectedParams(injectJavascriptVariable);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  window: require('@adobe/reactor-window')
});

/* START.TESTS_ONLY */
export { validateInjection as injectJavascriptVariable };
/* END.TESTS_ONLY */
