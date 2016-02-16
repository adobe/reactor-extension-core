'use strict';

var document = require('document');
var extension = require('getExtension')('dtm');
var compareNumbers = extension.getResource('compareNumbers');

/**
 * Window size condition. Determines if the current window size matches constraints.
 * @param {Object} config Condition config.
 * @param {number} config.width The window width to compare against.
 * @param {comparisonOperator} config.widthOperator The comparison operator to use
 * to compare against width.
 * @param {number} config.height The window height to compare against.
 * @param {comparisonOperator} config.heightOperator The comparison operator to use
 * to compare against height.
 * @returns {boolean}
 */
module.exports = function(config) {
  var widthInRange = compareNumbers(
    document.documentElement.clientWidth,
    config.widthOperator,
    config.width);

  var heightInRange = compareNumbers(
    document.documentElement.clientHeight,
    config.heightOperator,
    config.height);

  return widthInRange && heightInRange;
};

