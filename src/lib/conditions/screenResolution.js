'use strict';

var window = require('window');
var compareNumbers = require('../helpers/compareNumbers');

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

