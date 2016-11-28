'use strict';

var document = require('document');
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

