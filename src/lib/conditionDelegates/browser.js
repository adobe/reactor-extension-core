'use strict';

var clientInfo = require('clientInfo');

/**
 * Browser condition. Determines if the actual browser matches at least one acceptable browser.
 * @param {Object} settings Condition settings.
 * @param {string[]} settings.browsers An array of acceptable browsers.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return settings.browsers.indexOf(clientInfo.browser) !== -1;
};

