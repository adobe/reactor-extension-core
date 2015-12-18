'use strict';

var getQueryParam = require('getQueryParam');

/**
 * The query parameter data element.
 * @param {Object} config The data element config object.
 * @param {string} config.name The query parameter name.
 * @param {string} config.caseInsensitive Whether casing should be ignored.
 * @returns {string}
 */
module.exports = function(config) {
  return getQueryParam(config.name, config.caseInsensitive);
};
