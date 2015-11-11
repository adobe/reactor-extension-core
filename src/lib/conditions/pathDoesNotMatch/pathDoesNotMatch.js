'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Path condition. Determines if the actual path does not match a path pattern.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)} config.path An unacceptable path.
 * @returns {boolean}
 */
module.exports = function(config) {
  // It's odd that we're including the querystring in the match.
  var path = document.location.pathname + document.location.search;
  return !textMatch(path, config.path);
};
