'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Subdomain condition. Determines if the actual subdomain does not match an unacceptable subdomain.
 * @param {Object} config Condition config.
 * @param {string} config.subdomain An unacceptable subdomain.
 * @param {boolean} [config.subdomainIsRegex=false] Whether <code>config.subdomain</code> is
 * intended to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  var subdomain = document.location.hostname;
  var unacceptableSubdomain = config.subdomainIsRegex ?
    new RegExp(config.subdomain, 'i') : config.subdomain;
  return !textMatch(subdomain, unacceptableSubdomain);
};

