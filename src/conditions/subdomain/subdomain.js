'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Subdomain condition. Determines if the actual subdomain matches at least one acceptable subdomain
 * and does not match any unacceptable subdomain.
 * @param {Object} config Condition config.
 * @param {(RegEx|string)[]} [config.include] An array of acceptable subdomains.
 * @param {(RegEx|string)[]} [config.exclude] An array of unacceptable subdomains.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hostname = document.location.hostname;
  var include = config.include;
  var exclude = config.exclude;

  var compare = function(subdomainCriterion) {
    return textMatch(hostname, subdomainCriterion);
  };

  return (!include || include.some(compare)) && (!exclude || !exclude.some(compare));
};

