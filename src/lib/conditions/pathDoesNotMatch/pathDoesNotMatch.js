'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Path condition. Determines if the actual path does not match a path pattern.
 * @param {Object} config Condition config.
 * @param {string} config.path An unacceptable path.
 * @param {boolean} [config.pathIsRegex=false] Whether <code>config.path</code> is intended to be
 * a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  // It's odd that we're including the querystring in the match.
  var path = document.location.pathname + document.location.search;
  var unacceptablePath = config.pathIsRegex ? new RegExp(config.path, 'i') : config.path;
  return !textMatch(path, unacceptablePath);
};
