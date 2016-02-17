'use strict';

var getCookie = require('getCookie');

/**
 * The cookie data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.name The name of the cookie for which a value should be retrieved.
 * @returns {string}
 */
module.exports = function(settings) {
  return getCookie(settings.name);
};
