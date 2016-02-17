'use strict';

var clientInfo = require('clientInfo');

/**
 * Operating system condition. Determines if the actual operating system matches at least one
 * acceptable operating system.
 * @param {Object} settings Condition settings.
 * @param {string[]} settings.operatingSystems An array of acceptable operating
 * systems.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return settings.operatingSystems.indexOf(clientInfo.os) !== -1;
};

