'use strict';

var getDataElement = require('getDataElement');

/**
 * Logged in condition. Determines if the user is logged in.
 * @param {Object} config Condition config.
 * @param {string} config.dataElementName The name of the data element identifying
 * whether the user is logged in.
 * @returns {boolean}
 */
module.exports = function(config) {
  return Boolean(getDataElement(config.dataElementName, true));
};

