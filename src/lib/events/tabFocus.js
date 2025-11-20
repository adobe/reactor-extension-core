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

import validateInjectedParams from '../../helpers/validate-injected-params';
import once from './helpers/once';
import runVisibilityApi from './helpers/visibilityApi';
const { hiddenProperty, visibilityChangeEventType } = runVisibilityApi();

function injectTabFocus({ document }) {
  /**
   * All trigger methods registered for this event type.
   * @type {ruleTrigger[]}
   */
  const triggers = [];

  const watchForTabFocus = once(function () {
    document.addEventListener(
      visibilityChangeEventType,
      function () {
        if (!document[hiddenProperty]) {
          triggers.forEach(function (trigger) {
            trigger();
          });
        }
      },
      true
    );
  });

  /**
   * Tabfocus event. This event occurs when a webpage is visible or in focus. With tabbed browsing,
   * there is a reasonable chance that any given webpage is in the background and thus not
   * visible to the user.
   * @param {Object} settings The event settings object.
   * @param {function} trigger The [rule]trigger callback.
   */
  return function tabFocus(settings, trigger) {
    watchForTabFocus();
    triggers.push(trigger);
  };
}

const validateInjection = validateInjectedParams(injectTabFocus);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  document: require('@adobe/reactor-document')
});

/* START.TESTS_ONLY */
export { validateInjection as injectTabFocus };
/* END.TESTS_ONLY */
