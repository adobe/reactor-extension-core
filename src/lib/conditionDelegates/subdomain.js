'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Subdomain condition. Determines if the actual subdomain matches at least one acceptable
 * subdomain.
 * @param {Object} config Condition config.
 * @param {Object[]} config.subdomains Acceptable subdomains.
 * @param {string} config.subdomains[].value An acceptable subdomain value.
 * @param {boolean} [config.subdomains[].valueIsRegex=false] Whether <code>value</code> on the
 * object instance is intended to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  var subdomain = document.location.hostname;
  return config.subdomains.some(function(acceptableSubdomain) {
    var acceptableValue = acceptableSubdomain.valueIsRegex ?
      new RegExp(acceptableSubdomain.value, 'i') : acceptableSubdomain.value;
    return textMatch(subdomain, acceptableValue);
  });
};

