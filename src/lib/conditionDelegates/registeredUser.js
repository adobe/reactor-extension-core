'use strict';

var getDataElement = require('getDataElement');

/**
 * Registered user condition. Determines if the user is a registered user.
 * @param {Object} config Condition config.
 * @param {string} config.dataElement The name of the data element identifying
 * whether the user is a registered user.
 * @returns {boolean}
 */
module.exports = function(config) {
  return Boolean(getDataElement(config.dataElement, true));
};

