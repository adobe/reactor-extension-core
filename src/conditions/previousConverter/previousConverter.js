'use strict';

var getDataElement = require('getDataElement');

/**
 * Previous converter condition. Determines if the user is a previous converter.
 * @param {Object} config Condition config.
 * @param {string} config.dataElementName The name of the data element identifying
 * whether the user is a previous converter.
 * @returns {boolean}
 */
module.exports = function(config) {
  return Boolean(getDataElement(config.dataElementName, true));
};

