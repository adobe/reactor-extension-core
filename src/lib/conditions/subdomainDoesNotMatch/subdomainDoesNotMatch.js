'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Subdomain condition. Determines if the actual subdomain does not match an unacceptable subdomain.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)[]} [config.subdomain] An unacceptable subdomain.
 * @returns {boolean}
 */
module.exports = function(config) {
  var subdomain = document.location.hostname;
  return !textMatch(subdomain, config.subdomain);
};

