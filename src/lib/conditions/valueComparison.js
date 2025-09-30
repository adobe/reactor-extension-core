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

import {
  isString,
  isNumber,
  castToStringIfNumber,
  castToNumberIfString
} from '../helpers/stringAndNumberUtils';

const updateCase = function (operand, caseInsensitive) {
  return caseInsensitive && isString(operand) ? operand.toLowerCase() : operand;
};

const guardStringCompare = function (compare) {
  return function (leftOperand, rightOperand, caseInsensitive) {
    leftOperand = castToStringIfNumber(leftOperand);
    rightOperand = castToStringIfNumber(rightOperand);
    return (
      isString(leftOperand) &&
      isString(rightOperand) &&
      compare(leftOperand, rightOperand, caseInsensitive)
    );
  };
};

const guardNumberCompare = function (compare) {
  return function (leftOperand, rightOperand) {
    leftOperand = castToNumberIfString(leftOperand);
    rightOperand = castToNumberIfString(rightOperand);
    return (
      isNumber(leftOperand) &&
      isNumber(rightOperand) &&
      compare(leftOperand, rightOperand)
    );
  };
};

const guardCaseSensitivity = function (compare) {
  return function (leftOperand, rightOperand, caseInsensitive) {
    return compare(
      updateCase(leftOperand, caseInsensitive),
      updateCase(rightOperand, caseInsensitive)
    );
  };
};

const conditions = {
  equals: guardCaseSensitivity(function (leftOperand, rightOperand) {
    return leftOperand === rightOperand;
  }),
  doesNotEqual: function () {
    return !conditions.equals.apply(null, arguments);
  },
  contains: guardStringCompare(
    guardCaseSensitivity(function (leftOperand, rightOperand) {
      return leftOperand.indexOf(rightOperand) !== -1;
    })
  ),
  doesNotContain: function () {
    return !conditions.contains.apply(null, arguments);
  },
  startsWith: guardStringCompare(
    guardCaseSensitivity(function (leftOperand, rightOperand) {
      return leftOperand.indexOf(rightOperand) === 0;
    })
  ),
  doesNotStartWith: function () {
    return !conditions.startsWith.apply(null, arguments);
  },
  endsWith: guardStringCompare(
    guardCaseSensitivity(function (leftOperand, rightOperand) {
      return (
        leftOperand.substring(
          leftOperand.length - rightOperand.length,
          leftOperand.length
        ) === rightOperand
      );
    })
  ),
  doesNotEndWith: function () {
    return !conditions.endsWith.apply(null, arguments);
  },
  matchesRegex: guardStringCompare(
    function (leftOperand, rightOperand, caseInsensitive) {
      return new RegExp(rightOperand, caseInsensitive ? 'i' : '').test(
        leftOperand
      );
    }
  ),
  doesNotMatchRegex: function () {
    return !conditions.matchesRegex.apply(null, arguments);
  },
  lessThan: guardNumberCompare(function (leftOperand, rightOperand) {
    return leftOperand < rightOperand;
  }),
  lessThanOrEqual: guardNumberCompare(function (leftOperand, rightOperand) {
    return leftOperand <= rightOperand;
  }),
  greaterThan: guardNumberCompare(function (leftOperand, rightOperand) {
    return leftOperand > rightOperand;
  }),
  greaterThanOrEqual: guardNumberCompare(function (leftOperand, rightOperand) {
    return leftOperand >= rightOperand;
  }),
  isTrue: function (leftOperand) {
    return leftOperand === true;
  },
  isTruthy: function (leftOperand) {
    return Boolean(leftOperand);
  },
  isFalse: function (leftOperand) {
    return leftOperand === false;
  },
  isFalsy: function (leftOperand) {
    return !leftOperand;
  }
};

const valueComparison = function (settings) {
  return conditions[settings.comparison.operator](
    settings.leftOperand,
    settings.rightOperand,
    Boolean(settings.comparison.caseInsensitive)
  );
};

export default valueComparison;
