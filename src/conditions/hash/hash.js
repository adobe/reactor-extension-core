'use strict';

var textMatch = require('textMatch');

/**
 * Hash condition. Determines if the actual hash (URL fragment identifier) matches at least one
 * acceptable hash and does not match any unacceptable hash.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)[]} [config.include] An array of acceptable hashes.
 * @param {(RegEx|string)[]} [config.exclude] An array of unacceptable hashes.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hash = document.location.hash;
  var include = config.include;
  var exclude = config.exclude;

  var compare = function(hashCriterion) {
    return textMatch(hash, hashCriterion);
  };

  return (!include || include.some(compare)) && (!exclude || !exclude.some(compare));
};

