'use strict';

/**
 * The custom data element.
 * @param {Object} config The data element config object.
 * @param {string} config.script The function that should be called which will return a value.
 * @returns {string}
 */
module.exports = function(config) {
  return config.script();
};
