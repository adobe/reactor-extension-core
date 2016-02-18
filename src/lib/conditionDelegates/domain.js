'use strict';

var document = require('document');

/**
 * Domain condition. Determines if the actual domain matches at least one acceptable domain.
 * @param {Object} settings Condition settings.
 * @param {string[]} settings.domains An array of acceptable domains. These are regular expression
 * pattern strings.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var domain = document.location.hostname;

  return settings.domains.some(function(acceptableDomain) {
    return domain.match(new RegExp(acceptableDomain, 'i'));
  });
};

