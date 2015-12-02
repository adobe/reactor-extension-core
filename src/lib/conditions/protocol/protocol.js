'use strict';

/**
 * Protocol condition. Determines if the actual protocol matches at least one acceptable
 * protocol.
 * @param {Object} config Condition config.
 * @param {string[]} config.protocols An array of acceptable protocols. These are regular expression
 * pattern strings.
 * @returns {boolean}
 */
module.exports = function(config) {
  var protocol = document.location.protocol;

  return config.protocols.some(function(acceptableProtocol) {
    return protocol.match(new RegExp(acceptableProtocol, 'i'));
  });
};

