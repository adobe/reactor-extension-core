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
const POLL_INTERVAL = 1000;

function injectDataElementChange({ window }) {
  const triggersByName = {};
  const cachedStringifiedValueByName = {};

  window.setInterval(function () {
    Object.keys(triggersByName).forEach(function (name) {
      const stringifiedValue = JSON.stringify(
        turbine.getDataElementValue(name)
      );

      if (stringifiedValue !== cachedStringifiedValueByName[name]) {
        const syntheticEvent = {
          dataElementName: name
        };

        triggersByName[name].forEach(function (trigger) {
          trigger(syntheticEvent);
        });

        cachedStringifiedValueByName[name] = stringifiedValue;
      }
    });
  }, POLL_INTERVAL);

  /**
   * Data element change event. This event occurs whenever the given data element's value has changed.
   * @param {Object} settings The event settings object.
   * @param {string} settings.name The name of the data element.
   * @param {function} trigger The [rule]trigger callback.
   */
  return function dataElementChange(settings, trigger) {
    const { name } = settings;
    let triggers = triggersByName[name];

    if (!triggers) {
      triggers = triggersByName[name] = [];
      cachedStringifiedValueByName[name] = JSON.stringify(
        turbine.getDataElementValue(name)
      );
    }

    triggers.push(trigger);
  };
}

const validateInjection = validateInjectedParams(injectDataElementChange);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  window: require('@adobe/reactor-window')
});

/* START.TESTS_ONLY */
export { validateInjection as injectDataElementChange };
/* END.TESTS_ONLY */
