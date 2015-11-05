'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Subdomain condition. Determines if the actual subdomain matches at least one acceptable
 * subdomain.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)[]} [config.subdomains] Acceptable subdomains.
 * @returns {boolean}
 */
module.exports = function(config) {
  var subdomain = document.location.hostname;
  return config.subdomains.some(function(acceptableSubdomain) {
    return textMatch(subdomain, acceptableSubdomain);
  });
};

