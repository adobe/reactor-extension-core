'use strict';

var extension = require('getExtension')('dtm');
var visitorTracking = extension.getResource('visitorTracking');
var compareNumbers = extension.getResource('compareNumbers');

// Visitor tracking should only run (be enabled) when a rule for the property contains a condition
// that needs it. The line below will be included in the emitted library if a rule requires this
// condition and it will be run regardless of whether the condition ever gets evaluated.
visitorTracking.enable();

/**
 * Time on site condition. Determines if the user has been on the site for a certain amount
 * of time.
 * @param {Object} config Condition config.
 * @param {number} config.minutes The number of minutes to compare against.
 * @param {comparisonOperator} config.operator The comparison operator to use to
 * compare against minutes.
 * @returns {boolean}
 */
module.exports = function(config) {
  return compareNumbers(
    visitorTracking.getMinutesOnSite(),
    config.operator,
    config.minutes
  );
};
