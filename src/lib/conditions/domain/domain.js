'use strict';

var document = require('document');

/**
 * Domain condition. Determines if the actual domain matches at least one acceptable domain.
 * @param {Object} config Condition config.
 * @param {RegEx[]} config.domains An array of acceptable domains.
 * @returns {boolean}
 */
module.exports = function(config) {
  var domain = document.location.hostname;

  return config.domains.some(function(domainCriterion) {
    return domain.match(domainCriterion);
  });
};

