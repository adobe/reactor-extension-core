'use strict';

var textMatch = require('textMatch');

/**
 * Variable condition. Determines if a particular JS variable's actual value matches
 * an acceptable value.
 * @param {Object} config Condition config.
 * @param {number} config.path The path of the JS variable (e.g., event.target.id).
 * @param {string} config.value An acceptable JS variable value.
 * @param {boolean} [config.valueIsRegex=false] Whether <code>config.value</code> is intended to be
 * a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  var acceptableValue = config.valueIsRegex ? new RegExp(config.value, 'i') : config.value;
  return textMatch(_satellite.getVar(config.path), acceptableValue);
};
