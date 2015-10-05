'use strict';

var resourceProvider = require('resourceProvider');
var visitorTracking = resourceProvider.get('dtm', 'visitorTracking');
var compareNumbers = resourceProvider.get('dtm', 'compareNumbers');

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
