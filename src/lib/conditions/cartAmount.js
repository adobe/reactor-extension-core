/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

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
