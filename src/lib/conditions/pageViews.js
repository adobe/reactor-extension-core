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
 * Enum for duration.
 * @readonly
 * @enum {string}
 */
var duration = {
  LIFETIME: 'lifetime',
  SESSION: 'session'
};

/**
 * Page views condition. Determines if the number of page views matches constraints.
 * @param {Object} settings Condition settings.
 * @param {comparisonOperator} settings.operator The comparison operator to use to
 * compare against count.
 * @param {number} settings.count The number of page views to compare against.
 * @param {duration} settings.duration The duration of time for which to include
 * page views.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var methodName = settings.duration === duration.LIFETIME ?
    'getLifetimePageViewCount' : 'getSessionPageViewCount';
  return compareNumbers(
    visitorTracking[methodName](),
    settings.operator,
    settings.count
  );
};
