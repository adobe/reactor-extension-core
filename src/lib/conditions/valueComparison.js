/***************************************************************************************
 * (c) 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

/*eslint eqeqeq:0*/
'use strict';

var isBoolean = function(value) {
  return typeof value === 'boolean';
};

var isNull = function(value) {
  return value === null;
};

var isUndefined = function(value) {
  return typeof value === 'undefined';
};

var isNumber = function(value) {
  return typeof value === 'number' && isFinite(value);
};

var isString = function(value) {
  return typeof value === 'string' || value instanceof String;
};

var validType = function(value) {
  return (
    isString(value) ||
    isNumber(value) ||
    isBoolean(value) ||
    isNull(value) ||
    isUndefined(value)
  );
};

var comparisonMethod = function(comparisonSettings) {
  return conditions[comparisonSettings['operand']];
};

var operandValue = function(operand, caseInsensitve) {
  return caseInsensitve && isString(operand) ? operand.toLowerCase() : operand;
};

var conditions = {
  equals: function(leftOperand, rightOperand, caseInsensitve) {
    return operandValue(leftOperand, caseInsensitve) == operandValue(rightOperand, caseInsensitve);
  },
  contains: function(leftOperand, rightOperand, caseInsensitve) {
    leftOperand = operandValue(leftOperand, caseInsensitve);
    rightOperand = operandValue(rightOperand, caseInsensitve);

    return (
      isString(leftOperand) &&
      isString(rightOperand) &&
      leftOperand.indexOf(rightOperand) !== -1
    );
  },
  startsWith: function(leftOperand, rightOperand, caseInsensitve) {
    leftOperand = operandValue(leftOperand, caseInsensitve);
    rightOperand = operandValue(rightOperand, caseInsensitve);

    return (
      isString(leftOperand) &&
      isString(rightOperand) &&
      leftOperand.indexOf(rightOperand) === 0
    );
  },
  endsWith: function(leftOperand, rightOperand, caseInsensitve) {
    leftOperand = operandValue(leftOperand, caseInsensitve);
    rightOperand = operandValue(rightOperand, caseInsensitve);

    return (
      isString(leftOperand) &&
      isString(rightOperand) &&
      leftOperand.substring(
        leftOperand.length - rightOperand.length,
        leftOperand.length
      ) === rightOperand
    );
  },
  matchesRegex: function(leftOperand, rightOperand, caseInsensitive) {
    var flags = caseInsensitive ? 'i' : '';
    var regex = new RegExp(rightOperand, flags);
    return regex.test(leftOperand);
  },
  lessThan: function(leftOperand, rightOperand) {
    return Number(leftOperand) < Number(rightOperand);
  },
  lessThanOrEqualTo: function(leftOperand, rightOperand) {
    return Number(leftOperand) <= Number(rightOperand);
  },
  greaterThan: function(leftOperand, rightOperand) {
    return Number(leftOperand) > Number(rightOperand);
  },
  greaterThanOrEqualTo: function(leftOperand, rightOperand) {
    return Number(leftOperand) >= Number(rightOperand);
  },
  isTrue: function(leftOperand) {
    return leftOperand === true;
  },
  isFalse: function(leftOperand) {
    return leftOperand === false;
  },
  exists: function(leftOperand) {
    return leftOperand != null;
  }
};

module.exports = function(settings) {
  var leftOperand = settings.leftOperand;
  var rightOperand = settings.rightOperand;
  var caseInsensitve =
    Boolean(settings.comparison && settings.comparison.caseInsensitive);

  return (
    validType(leftOperand) &&
    validType(rightOperand) &&
    comparisonMethod(settings.comparison)(
      leftOperand,
      rightOperand,
      caseInsensitve
    )
  );
};
