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

'use strict';

/**
 * Date range condition. Determines if we are within a specific date range.
 * @param {Object} settings Condition settings.
 * @param {string} [settings.start] A date, in ISO 8601, indicating when the condition should
 * start returning true.
 * @param {string} [settings.end] A date, in ISO 8601, indicating when the condition should
 * stop returning true.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var now = new Date();

  if (settings.start && now < new Date(settings.start)) {
    return false;
  }

  if (settings.end && now > new Date(settings.end)) {
    return false;
  }

  return true;
};
