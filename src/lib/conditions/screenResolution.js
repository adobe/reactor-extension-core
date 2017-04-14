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

var window = require('@turbine/window');
var compareNumbers = require('./helpers/compareNumbers');

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
module.exports = function(settings) {
  var widthInRange = compareNumbers(
    window.screen.width,
    settings.widthOperator,
    settings.width);

  var heightInRange = compareNumbers(
    window.screen.height,
    settings.heightOperator,
    settings.height);

  return widthInRange && heightInRange;
};

