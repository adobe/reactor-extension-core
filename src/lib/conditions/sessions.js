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

import visitorTracking from '../helpers/visitorTracking.js'
import compareNumbers from './helpers/compareNumbers.js'
import validateInjectedParams from '../../helpers/validate-injected-params.js'

function injectSessions({ visitorTracking, compareNumbers }) {
  /**
   * Sessions condition. Determines if the number of sessions matches constraints.
   * @param {Object} settings Condition settings.
   * @param {number} settings.count The number of sessions to compare against.
   * @param {comparisonOperator} settings.operator The comparison operator to use to
   * compare against count.
   * @returns {boolean}
   */
  return function sessionsCondition(settings) {
    return compareNumbers(
      visitorTracking.getSessionCount(),
      settings.operator,
      settings.count
    );
  };
}

const validateInjection = validateInjectedParams(injectSessions);

export default validateInjection({
  visitorTracking,
  compareNumbers
});

/* START.TESTS_ONLY */
export { validateInjection as injectSessions };
/* END.TESTS_ONLY */
