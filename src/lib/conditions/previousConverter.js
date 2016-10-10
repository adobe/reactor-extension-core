'use strict';

var getDataElementValue = require('get-data-element-value');

/**
 * Previous converter condition. Determines if the user is a previous converter.
 * @param {Object} settings Condition settings.
 * @param {string} settings.dataElement The name of the data element identifying
 * whether the user is a previous converter.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return Boolean(getDataElementValue(settings.dataElement, true));
};

