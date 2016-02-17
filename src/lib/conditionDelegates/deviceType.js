'use strict';

var clientInfo = require('clientInfo');

/**
 * Device type condition. Determines if the actual device type matches at least one acceptable
 * device type.
 * @param {Object} settings Condition settings.
 * @param {string[]} settings.deviceTypes An array of device types.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return settings.deviceTypes.indexOf(clientInfo.deviceType) !== -1;
};

