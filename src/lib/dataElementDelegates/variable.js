'use strict';

var getObjectProperty = require('getObjectProperty');

/**
 * The variable data element.
 * @param {Object} config The data element config object.
 * @param {string} config.path The global path to the variable holding the data element value.
 * @returns {string}
 */
module.exports = function(config) {
  return getObjectProperty(window, config.path);
};
