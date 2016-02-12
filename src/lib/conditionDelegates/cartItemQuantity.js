'use strict';

var compareNumbers = require('getResource')('dtm', 'compareNumbers');

/**
 * Cart item quantity condition. Determines if the current cart item quantity matches constraints.
 * @param {Object} config Condition config.
 * @param {number} config.dataElement The name of the data element identifying
 * the cart item quantity to compare against.
 * @param {comparisonOperator} config.operator The comparison operator to use
 * to compare the actual cart item quantity to the cart item quantity constraint.
 * @param {Number} config.quantity The car item quantity constraint.
 * @returns {boolean}
 */
module.exports = function(config) {
  var quantity = Number(_satellite.getVar(config.dataElement));

  if (isNaN(quantity)) {
    quantity = 0;
  }

  return compareNumbers(
    quantity,
    config.operator,
    config.quantity);
};

