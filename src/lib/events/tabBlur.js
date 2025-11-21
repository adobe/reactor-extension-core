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

import validateInjectedParams from '../../helpers/validate-injected-params.js';
import runVisibilityApi from './helpers/visibilityApi.js';
const { hiddenProperty, visibilityChangeEventType } = runVisibilityApi();
import once from './helpers/once.js';

function injectTabBlur({ document }) {
  /**
   * All trigger methods registered for this event type.
   * @type {ruleTrigger[]}
   */
  var triggers = [];

  var watchForTabBlur = once(function () {
    document.addEventListener(
      visibilityChangeEventType,
      function () {
        if (document[hiddenProperty]) {
          triggers.forEach(function (trigger) {
            trigger();
          });
        }
      },
      true
    );
  });

  /**
   * Tabblur event. This event occurs when a webpage is not visible or not in focus.
   * @param {Object} settings The event settings object.
   * @param {function} trigger The [rule]trigger callback.
   */
  return function tabBlur(settings, trigger) {
    watchForTabBlur();
    triggers.push(trigger);
  };
}

const validateInjection = validateInjectedParams(injectTabBlur);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  document: require('@adobe/reactor-document')
});

/* START.TESTS_ONLY */
export { validateInjection as injectTabBlur };
/* END.TESTS_ONLY */
