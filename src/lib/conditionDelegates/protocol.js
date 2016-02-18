'use strict';

/**
 * Protocol condition. Determines if the actual protocol matches at least one acceptable
 * protocol.
 * @param {Object} settings Condition settings.
 * @param {string} settings.protocol An acceptable protocol.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return document.location.protocol.toLowerCase() === settings.protocol.toLowerCase();
};

