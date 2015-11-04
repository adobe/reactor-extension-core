'use strict';

var textMatch = require('textMatch');

/**
 * Hash condition. Determines if the actual hash (URL fragment identifier) matches at least one
 * acceptable hash.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)[]} [config.hashes] Acceptable hashes.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hash = document.location.hash;
  return config.hashes.some(function(acceptableHash) {
    return textMatch(hash, acceptableHash);
  });
};

