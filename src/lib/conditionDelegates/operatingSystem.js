'use strict';

var clientInfo = require('clientInfo');

/**
 * Operating system condition. Determines if the actual operating system matches at least one
 * acceptable operating system.
 * @param {Object} config Condition config.
 * @param {string[]} config.operatingSystems An array of acceptable operating
 * systems.
 * @returns {boolean}
 */
module.exports = function(config) {
  return config.operatingSystems.indexOf(clientInfo.os) !== -1;
};

