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

var window = require('@turbine/window');
var compareNumbers = require('./helpers/compareNumbers');

/**
 * Screen resolution condition. Determines if the current screen resolution matches constraints.
 * @param {Object} settings Condition settings.
 * @param {comparisonOperator} settings.widthOperator The comparison operator to use
 * to compare against width.
 * @param {number} settings.width The window width to compare against.
 * @param {comparisonOperator} settings.heightOperator The comparison operator to use
 * to compare against height.
 * @param {number} settings.height The window height to compare against.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var widthInRange = compareNumbers(
    window.screen.width,
    settings.widthOperator,
    settings.width);

  var heightInRange = compareNumbers(
    window.screen.height,
    settings.heightOperator,
    settings.height);

  return widthInRange && heightInRange;
};

