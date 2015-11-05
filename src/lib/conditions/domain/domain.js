'use strict';

var document = require('document');

/**
 * Domain condition. Determines if the actual domain matches at least one acceptable domain.
 * @param {Object} config Condition config.
 * @param {string[]} config.domains An array of acceptable domains. These are regular expression
 * pattern strings.
 * @returns {boolean}
 */
module.exports = function(config) {
  var domain = document.location.hostname;

  return config.domains.some(function(acceptableDomain) {
    return domain.match(new RegExp(acceptableDomain, 'i'));
  });
};

