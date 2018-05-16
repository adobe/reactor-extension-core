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

var isNumber = function(value) {
  return typeof value === 'number' && isFinite(value); // isFinite weeds out NaNs.
};

var isString = function(value) {
  return typeof value === 'string' || value instanceof String;
};

var updateCase = function(operand, caseInsensitive) {
  return caseInsensitive && isString(operand) ? operand.toLowerCase() : operand;
};

var castToStringIfNumber = function(operand) {
  return isNumber(operand) ? String(operand) : operand;
};

var castToNumberIfString = function(operand) {
  return isString(operand) ? Number(operand) : operand;
};

var guardStringCompare = function(compare) {
  return function(leftOperand, rightOperand, caseInsensitive) {
    leftOperand = castToStringIfNumber(updateCase(leftOperand, caseInsensitive));
    rightOperand = castToStringIfNumber(updateCase(rightOperand, caseInsensitive));

    return (
      isString(leftOperand) &&
      isString(rightOperand) &&
      compare(leftOperand, rightOperand)
    );
  };
};

var guardNumberCompare = function(compare) {
  return function(leftOperand, rightOperand) {
    leftOperand = castToNumberIfString(leftOperand);
    rightOperand = castToNumberIfString(rightOperand);

    return (
      isNumber(leftOperand) &&
      isNumber(rightOperand) &&
      compare(leftOperand, rightOperand)
    );
  };
};

var conditions = {
  equals: function(leftOperand, rightOperand, caseInsensitive) {
    return updateCase(leftOperand, caseInsensitive) == updateCase(rightOperand, caseInsensitive);
  },
  doesNotEqual: function() {
    return !conditions.equals.apply(null, arguments);
  },
  contains: guardStringCompare(function(leftOperand, rightOperand) {
    return leftOperand.indexOf(rightOperand) !== -1;
  }),
  doesNotContain: function() {
    return !conditions.contains.apply(null, arguments);
  },
  startsWith: guardStringCompare(function(leftOperand, rightOperand) {
    return leftOperand.indexOf(rightOperand) === 0;
  }),
  doesNotStartWith: function() {
    return !conditions.startsWith.apply(null, arguments);
  },
  endsWith: guardStringCompare(function(leftOperand, rightOperand) {
    return leftOperand.substring(
      leftOperand.length - rightOperand.length,
      leftOperand.length
    ) === rightOperand;
  }),
  doesNotEndWith: function() {
    return !conditions.endsWith.apply(null, arguments);
  },
  matchesRegex: guardStringCompare(function(leftOperand, rightOperand, caseInsensitive) {
    // Doing something like new RegExp(/ab+c/, 'i') throws an error in some browsers (e.g., IE11),
    // so we don't want to instantiate the regex until we know we're working with a string.
    return new RegExp(rightOperand, caseInsensitive ? 'i' : '').test(leftOperand);
  }),
  doesNotMatchRegex: function() {
    return !conditions.matchesRegex.apply(null, arguments);
  },
  lessThan: guardNumberCompare(function(leftOperand, rightOperand) {
    return leftOperand < rightOperand;
  }),
  lessThanOrEqual: guardNumberCompare(function(leftOperand, rightOperand) {
    return leftOperand <= rightOperand;
  }),
  greaterThan: guardNumberCompare(function(leftOperand, rightOperand) {
    return leftOperand > rightOperand;
  }),
  greaterThanOrEqual: guardNumberCompare(function(leftOperand, rightOperand) {
    return leftOperand >= rightOperand;
  }),
  isTrue: function(leftOperand) {
    return leftOperand === true;
  },
  isTruthy: function(leftOperand) {
    return Boolean(leftOperand);
  },
  isFalse: function(leftOperand) {
    return leftOperand === false;
  },
  isFalsy: function(leftOperand) {
    return !leftOperand;
  },
};

module.exports = function(settings) {
  return conditions[settings.comparison.operator](
    settings.leftOperand,
    settings.rightOperand,
    Boolean(settings.comparison.caseInsensitive)
  );
};
