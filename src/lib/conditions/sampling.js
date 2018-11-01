/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

var getNamespacedStorage = require('../helpers/getNamespacedStorage');
var samplingLocalStorage = getNamespacedStorage('localStorage', 'sampling');

/**
 * Sampling condition. Returns true if within the random sample.
 * @param {Object} settings Condition settings.
 * @param {number} settings.rate A percentage, defined as a number between 0 and 1, of time the
 * condition should return true.
 * @param {boolean} [settings.persistCohort=false] If set to true, the result of the first
 * execution of the condition for the user will be returned for future executions of the same
 * condition. In other words, if the user is in the cohort the first time, the user will stay in
 * the cohort and vice versa.
 * @returns {boolean}
 */
module.exports = function(settings, event) {
  // Note that we intentionally don't use <=. Math.random() returns a value between
  // 0 (inclusive) and 1 (exclusive). If we were to use <= and Math.random() returned 0, the
  // condition would return true. The condition should always return false if the rate is set to
  // 0 and always return true if the rate is set to 1.
  var includeInCohort = Math.random() < settings.rate;

  if (settings.persistCohort) {
    // Note that our storage key incorporates the rule ID instead of the rule component ID
    // (because a rule component ID isn't available). The storage key ALSO
    // incorporates the value of settings.rate. This means that multiple Sampling
    // conditions on the same rule could potentially conflict by using the same key, but only
    // if they're using the same rate. This would be a very strange use case and would result
    // in unexpected behavior. Also note that if the user changes the rate in the condition,
    // the cohort will essentially reset, which would typically be the expected behavior anyway.
    // Also interesting is if the user changes the rate back to the original rate, the cohort
    // would pick up where it left off at that original rate, for better or worse.
    var storageKey = 'cohorts.' + event.$rule.id + '.' + settings.rate;
    var includedInCohort = samplingLocalStorage.getItem(storageKey);

    if (includedInCohort === 'true') {
      return true;
    } else if (includedInCohort === 'false') {
      return false;
    } else {
      samplingLocalStorage.setItem(storageKey, includeInCohort);
    }
  }

  return includeInCohort;
};
