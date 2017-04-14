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

var getDataElementValue = require('@turbine/get-data-element-value');
var compareNumbers = require('./helpers/compareNumbers');

/**
 * Cart amount condition. Determines if the current cart amount matches constraints.
 * @param {Object} settings Condition settings.
 * @param {number} settings.dataElement The name of the data element identifying
 * the cart amount to compare against.
 * @param {comparisonOperator} settings.operator The comparison operator to use
 * to compare the actual cart amount to the cart amount constraint.
 * @param {Number} settings.amount The cart amount constraint.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var amount = Number(getDataElementValue(settings.dataElement));

  if (isNaN(amount)) {
    amount = 0;
  }

  return compareNumbers(
    amount,
    settings.operator,
    settings.amount);
};
