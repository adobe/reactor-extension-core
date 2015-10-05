'use strict';

var textMatch = require('textMatch');
var getQueryParam = require('getQueryParam');

/**
 * URL parameter condition. Determines if a querystring parameter exists with a name and value that
 * matches the acceptable name and value.
 * @param {Object} config Condition config.
 * @param {string} config.name The name of the querystring parameter.
 * @param {string} config.value The value of the querystring parameter.
 * @returns {boolean}
 */
module.exports = function(config) {
  return textMatch(getQueryParam(config.name), config.value);
};

