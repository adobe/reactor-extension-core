'use strict';

var clientInfo = require('clientInfo');

/**
 * Browser condition. Determines if the actual browser matches at least one acceptable browser.
 * @param {Object} config Condition config.
 * @param {string[]} config.browsers An array of acceptable browsers.
 * @returns {boolean}
 */
module.exports = function(config) {
  return config.browsers.indexOf(clientInfo.browser) !== -1;
};

