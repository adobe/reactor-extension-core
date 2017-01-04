'use strict';

var getDataElementValue = require('@turbine/get-data-element-value');
var textMatch = require('../helpers/textMatch');

/**
 * Data element condition. Determines if a particular data element's actual value matches
 * an acceptable value.
 * @param {Object} settings Condition settings.
 * @param {number} settings.name The name of the data element.
 * @param {string} settings.value An acceptable data element value.
 * @param {boolean} [settings.valueIsRegex=false] Whether <code>settings.value</code> is intended to
 * be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var acceptableValue = settings.valueIsRegex ? new RegExp(settings.value, 'i') : settings.value;
  return textMatch(getDataElementValue(settings.name), acceptableValue);
};
