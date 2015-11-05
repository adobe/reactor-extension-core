'use strict';

var textMatch = require('textMatch');

/**
 * Hash condition. Determines if the actual hash (URL fragment identifier) matches at least one
 * acceptable hash.
 * @param {Object} config Condition config.
 * @param {Object[]} config.hashes Acceptable hashes.
 * @param {string} config.hashes[].value An acceptable hash value
 * @param {boolean} [config.hashes[].valueIsRegex=false] Whether <code>value</code> on the object
 * instance is intended to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hash = document.location.hash;
  return config.hashes.some(function(acceptableHash) {
    var acceptableValue = acceptableHash.valueIsRegex ?
      new RegExp(acceptableHash.value, 'i') : acceptableHash.value;
    return textMatch(hash, acceptableValue);
  });
};

