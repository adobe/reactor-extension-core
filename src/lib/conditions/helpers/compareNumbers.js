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
 * Enum for comparison operators.
 * @readonly
 * @enum {string}
 */
var comparisonOperator = {
  GREATER_THAN: '>',
  LESS_THAN: '<',
  EQUALS: '='
};

/**
 * Compares two numbers using a comparison operator enumeration value.
 * @param {number} num1 The first number.
 * @param {comparisonOperator} The comparison operator.
 * @param {number} num2 The second number.
 * @returns {Function}
 */
var compareNumbers = function(num1, op, num2) {
  switch (op) {
    case comparisonOperator.GREATER_THAN:
      return num1 > num2;
    case comparisonOperator.LESS_THAN:
      return num1 < num2;
    case comparisonOperator.EQUALS:
      return num1 === num2;
  }
};

/**
 * Utility for comparing two numbers.
 * @returns {Function}
 */
module.exports = compareNumbers;
