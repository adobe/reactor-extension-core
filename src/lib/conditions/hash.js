'use strict';

var textMatch = require('../helpers/textMatch');

/**
 * Hash condition. Determines if the actual hash (URL fragment identifier) matches at least one
 * acceptable hash.
 * @param {Object} settings Condition settings.
 * @param {Object[]} settings.hashes Acceptable hashes.
 * @param {string} settings.hashes[].value An acceptable hash value
 * @param {boolean} [settings.hashes[].valueIsRegex=false] Whether <code>value</code> on the object
 * instance is intended to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var hash = document.location.hash;
  return settings.hashes.some(function(acceptableHash) {
    var acceptableValue = acceptableHash.valueIsRegex ?
      new RegExp(acceptableHash.value, 'i') : acceptableHash.value;
    return textMatch(hash, acceptableValue);
  });
};

