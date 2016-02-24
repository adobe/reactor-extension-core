'use strict';

var document = require('document');
var extension = require('getExtension')('dtm');
var textMatch = extension.getResource('textMatch');

/**
 * Path condition. Determines if the actual path matches at least one acceptable path.
 * @param {Object} settings Condition settings.
 * @param {Object[]} settings.paths Acceptable paths.
 * @param {string} settings.paths[].value An acceptable path value.
 * @param {boolean} [settings.paths[].valueIsRegex=false] Whether <code>value</code> on the object
 * instance is intended to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  // It's odd that we're including the querystring in the match.
  var path = document.location.pathname + document.location.search;
  return settings.paths.some(function(acceptablePath) {
    var acceptableValue = acceptablePath.valueIsRegex ?
      new RegExp(acceptablePath.value, 'i') : acceptablePath.value;
    return textMatch(path, acceptableValue);
  });
};
