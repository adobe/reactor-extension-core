'use strict';

var textMatch = require('textMatch');

/**
 * Hash condition. Determines if the actual hash (URL fragment identifier) does not match an
 * unacceptable hash.
 * @param {Object} config Condition config.
 * @param {string} config.hash An unacceptable hash.
 * @param {boolean} [config.hashIsRegex=false] Whether <code>config.hash</code> is intended to be
 * a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hash = document.location.hash;
  var unacceptableHash = config.hashIsRegex ? new RegExp(config.hash, 'i') : config.hash;
  return !textMatch(hash, unacceptableHash);
};

