'use strict';

var document = require('document');
var textMatch = require('../helpers/textMatch');

/**
 * Subdomain condition. Determines if the actual subdomain matches at least one acceptable
 * subdomain.
 * @param {Object} settings Condition settings.
 * @param {Object[]} settings.subdomains Acceptable subdomains.
 * @param {string} settings.subdomains[].value An acceptable subdomain value.
 * @param {boolean} [settings.subdomains[].valueIsRegex=false] Whether <code>value</code> on the
 * object instance is intended to be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var subdomain = document.location.hostname;
  return settings.subdomains.some(function(acceptableSubdomain) {
    var acceptableValue = acceptableSubdomain.valueIsRegex ?
      new RegExp(acceptableSubdomain.value, 'i') : acceptableSubdomain.value;
    return textMatch(subdomain, acceptableValue);
  });
};

