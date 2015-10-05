'use strict';

var clientInfo = require('clientInfo');

/**
 * Device type condition. Determines if the actual device type matches at least one acceptable
 * device type.
 * @param {Object} config Condition config.
 * @param {string[]} config.deviceTypes An array of device types.
 * @returns {boolean}
 */
module.exports = function(config) {
  return config.deviceTypes.indexOf(clientInfo.deviceType) !== -1;
};

