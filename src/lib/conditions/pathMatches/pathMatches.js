'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Path condition. Determines if the actual path matches at least one acceptable path.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)[]} config.paths Acceptable paths.
 * @returns {boolean}
 */
module.exports = function(config) {
  // It's odd that we're including the querystring in the match.
  var path = document.location.pathname + document.location.search;
  return config.paths.some(function(acceptablePath) {
    return textMatch(path, acceptablePath);
  });
};
