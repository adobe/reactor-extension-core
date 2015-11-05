'use strict';

var textMatch = require('textMatch');

/**
 * Hash condition. Determines if the actual hash (URL fragment identifier) does not match an
 * unacceptable hash.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)[]} [config.hash] An unacceptable hash.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hash = document.location.hash;
  return !textMatch(hash, config.hash);
};

