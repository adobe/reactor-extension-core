'use strict';

/**
 * Protocol condition. Determines if the actual protocol matches at least one acceptable
 * protocol.
 * @param {Object} config Condition config.
 * @param {RegEx[]} config.protocols An array of acceptable protocols.
 * @returns {boolean}
 */
module.exports = function(config) {
  var protocol = document.location.protocol;

  return config.protocols.some(function(protocolCriterion) {
    return protocol.match(protocolCriterion);
  });
};

