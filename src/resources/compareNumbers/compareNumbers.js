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
