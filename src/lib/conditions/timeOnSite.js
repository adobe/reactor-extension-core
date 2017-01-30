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

var visitorTracking = require('./helpers/visitorTracking');
var compareNumbers = require('./helpers/compareNumbers');

// Visitor tracking should only run (be enabled) when a rule for the property contains a condition
// that needs it. The line below will be included in the emitted library if a rule requires this
// condition and it will be run regardless of whether the condition ever gets evaluated.
visitorTracking.enable();

/**
 * Time on site condition. Determines if the user has been on the site for a certain amount
 * of time.
 * @param {Object} settings Condition settings.
 * @param {number} settings.minutes The number of minutes to compare against.
 * @param {comparisonOperator} settings.operator The comparison operator to use to
 * compare against minutes.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return compareNumbers(
    visitorTracking.getMinutesOnSite(),
    settings.operator,
    settings.minutes
  );
};
