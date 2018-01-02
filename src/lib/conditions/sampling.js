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

/**
 * Sampling condition. Returns true if within the random sample.
 * @param {Object} settings Condition settings.
 * @param {number} settings.rate A percentage, defined as a number between 0 and 1, of time the
 * condition should return true.
 * @returns {boolean}
 */
module.exports = function(settings) {
  // Note that we intentionally don't use <=. Math.random() returns a value between
  // 0 (inclusive) and 1 (exclusive). If we were to use <= and Math.random() returned 0, the
  // condition would return true. The condition should always return false if the rate is set to
  // 0 and always return true if the rate is set to 1.
  return Math.random() < settings.rate;
};
