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

import visitorTracking from '../helpers/visitorTracking';
import compareNumbers from './helpers/compareNumbers';
import { castToNumberIfString } from '../helpers/stringAndNumberUtils';
import validateInjectedParams from '../../helpers/validate-injected-params';

function injectTimeOnSiteCondition({
  visitorTracking,
  compareNumbers,
  castToNumberIfString
}) {
  /**
   * Time on site condition. Determines if the user has been on the site for a certain amount
   * of time.
   * @param {Object} settings Condition settings.
   * @param {number} settings.minutes The number of minutes to compare against.
   * @param {comparisonOperator} settings.operator The comparison operator to use to
   * compare against minutes.
   * @returns {boolean}
   */
  return function timeOnSiteCondition(settings) {
    return compareNumbers(
      visitorTracking.getMinutesOnSite(),
      settings.operator,
      castToNumberIfString(settings.minutes)
    );
  };
}

const validateInjection = validateInjectedParams(injectTimeOnSiteCondition);

export default validateInjection({
  visitorTracking,
  compareNumbers,
  castToNumberIfString
});

/* START.TESTS_ONLY */
export { validateInjection as injectTimeOnSiteCondition };
/* END.TESTS_ONLY */
