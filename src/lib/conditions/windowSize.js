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

var document = require('@turbine/document');
var compareNumbers = require('./helpers/compareNumbers');

/**
 * Window size condition. Determines if the current window size matches constraints.
 * @param {Object} settings Condition settings.
 * @param {number} settings.width The window width to compare against.
 * @param {comparisonOperator} settings.widthOperator The comparison operator to use
 * to compare against width.
 * @param {number} settings.height The window height to compare against.
 * @param {comparisonOperator} settings.heightOperator The comparison operator to use
 * to compare against height.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var widthInRange = compareNumbers(
    document.documentElement.clientWidth,
    settings.widthOperator,
    settings.width);

  var heightInRange = compareNumbers(
    document.documentElement.clientHeight,
    settings.heightOperator,
    settings.height);

  return widthInRange && heightInRange;
};

