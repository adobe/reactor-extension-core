'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Path condition. Determines if the actual path matches at least one acceptable path.
 * @param {Object} config Condition config.
 * @param {Object[]} config.paths Acceptable paths.
 * @param {string} config.paths[].value An acceptable path value.
 * @param {boolean} [config.paths[].valueIsRegex=false] Whether <code>value</code> on the object
 * instance is intended to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  // It's odd that we're including the querystring in the match.
  var path = document.location.pathname + document.location.search;
  return config.paths.some(function(acceptablePath) {
    var acceptableValue = acceptablePath.valueIsRegex ?
      new RegExp(acceptablePath.value, 'i') : acceptablePath.value;
    return textMatch(path, acceptableValue);
  });
};
