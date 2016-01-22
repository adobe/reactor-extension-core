'use strict';

/**
 * Protocol condition. Determines if the actual protocol matches at least one acceptable
 * protocol.
 * @param {Object} config Condition config.
 * @param {string} config.protocol An acceptable protocol.
 * @returns {boolean}
 */
module.exports = function(config) {
  return document.location.protocol.toLowerCase() === config.protocol.toLowerCase();
};

