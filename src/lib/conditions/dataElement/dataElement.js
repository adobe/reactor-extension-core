'use strict';

var textMatch = require('textMatch');

/**
 * Data element condition. Determines if a particular data element's actual value matches
 * an acceptable value.
 * @param {Object} config Condition config.
 * @param {number} config.name The name of the data element.
 * @param {string} config.value An acceptable data element value.
 * @returns {boolean}
 */
module.exports = function(config) {
  return textMatch(_satellite.getVar(config.name), config.value);
};
