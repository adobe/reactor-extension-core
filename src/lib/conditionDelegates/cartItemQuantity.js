'use strict';

var getVar = require('getVar');
var extension = require('getExtension')('dtm');
var compareNumbers = extension.getResource('compareNumbers');

/**
 * Cart item quantity condition. Determines if the current cart item quantity matches constraints.
 * @param {Object} settings Condition settings.
 * @param {number} settings.dataElement The name of the data element identifying
 * the cart item quantity to compare against.
 * @param {comparisonOperator} settings.operator The comparison operator to use
 * to compare the actual cart item quantity to the cart item quantity constraint.
 * @param {Number} settings.quantity The car item quantity constraint.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var quantity = Number(getVar(settings.dataElement));

  if (isNaN(quantity)) {
    quantity = 0;
  }

  return compareNumbers(
    quantity,
    settings.operator,
    settings.quantity);
};

