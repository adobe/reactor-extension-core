'use strict';

var window = require('window');
var compareNumbers = require('getResource')('dtm', 'compareNumbers');

/**
 * Screen resolution condition. Determines if the current screen resolution matches constraints.
 * @param {Object} config Condition config.
 * @param {comparisonOperator} config.widthOperator The comparison operator to use
 * to compare against width.
 * @param {number} config.width The window width to compare against.
 * @param {comparisonOperator} config.heightOperator The comparison operator to use
 * to compare against height.
 * @param {number} config.height The window height to compare against.
 * @returns {boolean}
 */
module.exports = function(config) {
  var widthInRange = compareNumbers(
    window.screen.width,
    config.widthOperator,
    config.width);

  var heightInRange = compareNumbers(
    window.screen.height,
    config.heightOperator,
    config.height);

  return widthInRange && heightInRange;
};

