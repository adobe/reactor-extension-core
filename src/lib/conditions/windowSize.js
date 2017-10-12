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

var document = require('@adobe/reactor-document');
var compareNumbers = require('./helpers/compareNumbers');

/**
 * Window size condition. Determines if the current window size matches constraints.
 * @param {Object} settings Condition settings.
 * @param {number} settings.width The window width to compare against.
 * @param {comparisonOperator} settings.widthOperator The comparison operator to use
 * to compare against width.
 * @param {number} settings.height The window height to compare against.
 * @param {comparisonOperator} settings.heightOperator The comparison operator to use
 * to compare against height.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var widthInRange = compareNumbers(
    document.documentElement.clientWidth,
    settings.widthOperator,
    settings.width);

  var heightInRange = compareNumbers(
    document.documentElement.clientHeight,
    settings.heightOperator,
    settings.height);

  return widthInRange && heightInRange;
};

