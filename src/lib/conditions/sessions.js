'use strict';

var visitorTracking = require('./helpers/visitorTracking');
var compareNumbers = require('./helpers/compareNumbers');

// Visitor tracking should only run (be enabled) when a rule for the property contains a condition
// that needs it. The line below will be included in the emitted library if a rule requires this
// condition and it will be run regardless of whether the condition ever gets evaluated.
visitorTracking.enable();

/**
 * Sessions condition. Determines if the number of sessions matches constraints.
 * @param {Object} settings Condition settings.
 * @param {number} settings.count The number of sessions to compare against.
 * @param {comparisonOperator} settings.operator The comparison operator to use to
 * compare against count.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return compareNumbers(
    visitorTracking.getSessionCount(),
    settings.operator,
    settings.count
  );
};

