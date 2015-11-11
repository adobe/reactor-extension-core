'use strict';

var textMatch = require('textMatch');

/**
 * Variable condition. Determines if a particular JS variable's actual value matches
 * an acceptable value.
 * @param {Object} config Condition config.
 * @param {number} config.path The path of the JS variable (e.g., event.target.id).
 * @param {string} config.value An acceptable JS variable value.
 * @returns {boolean}
 */
module.exports = function(config) {
  return textMatch(_satellite.getVar(config.path), config.value);
};
