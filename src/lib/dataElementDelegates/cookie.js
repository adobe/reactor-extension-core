'use strict';

var getCookie = require('getCookie');

/**
 * The cookie data element.
 * @param {Object} config The data element config object.
 * @param {string} config.name The name of the cookie for which a value should be retrieved.
 * @returns {string}
 */
module.exports = function(config) {
  return getCookie(config.name);
};
