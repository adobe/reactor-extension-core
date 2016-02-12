'use strict';

var getResource = require('getResource');
var visitorTracking = getResource('dtm', 'visitorTracking');
var compareNumbers = getResource('dtm', 'compareNumbers');

// Visitor tracking should only run (be enabled) when a rule for the property contains a condition
// that needs it. The line below will be included in the emitted library if a rule requires this
// condition and it will be run regardless of whether the condition ever gets evaluated.
visitorTracking.enable();

/**
 * Sessions condition. Determines if the number of sessions matches constraints.
 * @param {Object} config Condition config.
 * @param {number} config.count The number of sessions to compare against.
 * @param {comparisonOperator} config.operator The comparison operator to use to
 * compare against count.
 * @returns {boolean}
 */
module.exports = function(config) {
  return compareNumbers(
    visitorTracking.getSessionCount(),
    config.operator,
    config.count
  );
};

