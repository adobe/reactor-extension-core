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

import compareNumbers from './helpers/compareNumbers';
import validateInjectedParams from '../../helpers/validate-injected-params';

function injectScreenResolution({ window, compareNumbers }) {
  /**
   * Screen resolution condition. Determines if the current screen resolution matches constraints.
   * @param {Object} settings Condition settings.
   * @param {comparisonOperator} settings.widthOperator The comparison operator to use
   * to compare against width.
   * @param {number} settings.width The window width to compare against.
   * @param {comparisonOperator} settings.heightOperator The comparison operator to use
   * to compare against height.
   * @param {number} settings.height The window height to compare against.
   * @returns {boolean}
   */
  return function screenResolution(settings) {
    var widthInRange = compareNumbers(
      window.screen.width,
      settings.widthOperator,
      settings.width
    );

    var heightInRange = compareNumbers(
      window.screen.height,
      settings.heightOperator,
      settings.height
    );

    return widthInRange && heightInRange;
  };
}

const validateInjection = validateInjectedParams(injectScreenResolution);

export default validateInjection({
  // runs in Turbine context, which provides these core-module packages.
  window: require('@adobe/reactor-window'),
  compareNumbers
});

/* START.TESTS_ONLY */
export { validateInjection as injectScreenResolution };
/* END.TESTS_ONLY */
