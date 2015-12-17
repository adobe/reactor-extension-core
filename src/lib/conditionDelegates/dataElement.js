'use strict';

var textMatch = require('textMatch');

/**
 * Data element condition. Determines if a particular data element's actual value matches
 * an acceptable value.
 * @param {Object} config Condition config.
 * @param {number} config.name The name of the data element.
 * @param {string} config.value An acceptable data element value.
 * @param {boolean} [config.valueIsRegex=false] Whether <code>config.value</code> is intended to be
 * a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  var acceptableValue = config.valueIsRegex ? new RegExp(config.value, 'i') : config.value;
  return textMatch(_satellite.getVar(config.name), acceptableValue);
};
