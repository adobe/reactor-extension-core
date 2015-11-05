'use strict';

var textMatch = require('textMatch');
var getQueryParam = require('getQueryParam');

/**
 * URL parameter condition. Determines if a querystring parameter exists with a name and value that
 * matches the acceptable name and value.
 * @param {Object} config Condition config.
 * @param {string} config.name The name of the querystring parameter.
 * @param {string} config.value An acceptable querystring parameter value.
 * @param {boolean} [config.valueIsRegex] Whether <code>config.value</code> is intended to be
 * a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  var acceptableValue = config.valueIsRegex ? new RegExp(config.value, 'i') : config.value;
  return textMatch(getQueryParam(config.name), acceptableValue);
};

