'use strict';

var getDataElement = require('getDataElement');

/**
 * Registered user condition. Determines if the user is a registered user.
 * @param {Object} settings Condition settings.
 * @param {string} settings.dataElement The name of the data element identifying
 * whether the user is a registered user.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return Boolean(getDataElement(settings.dataElement, true));
};

