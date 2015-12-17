'use strict';

var compareNumbers = require('resourceProvider').get('dtm', 'compareNumbers');

/**
 * Cart amount condition. Determines if the current cart amount matches constraints.
 * @param {Object} config Condition config.
 * @param {number} config.dataElementName The name of the data element identifying
 * the cart amount to compare against.
 * @param {comparisonOperator} config.operator The comparison operator to use
 * to compare the actual cart amount to the cart amount constraint.
 * @param {Number} config.amount The cart amount constraint.
 * @returns {boolean}
 */
module.exports = function(config) {
  var amount = Number(_satellite.getVar(config.dataElementName));

  if (isNaN(amount)) {
    amount = 0;
  }

  return compareNumbers(
    amount,
    config.operator,
    config.amount);
};
