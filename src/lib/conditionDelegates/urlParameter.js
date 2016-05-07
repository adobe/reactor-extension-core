'use strict';

var getQueryParam = require('get-query-param');
var textMatch = require('../helpers/textMatch.js');

/**
 * URL parameter condition. Determines if a querystring parameter exists with a name and value that
 * matches the acceptable name and value.
 * @param {Object} settings Condition settings.
 * @param {string} settings.name The name of the querystring parameter.
 * @param {string} settings.value An acceptable querystring parameter value.
 * @param {boolean} [settings.valueIsRegex=false] Whether <code>settings.value</code> is intended to
 * be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var acceptableValue = settings.valueIsRegex ? new RegExp(settings.value, 'i') : settings.value;
  return textMatch(getQueryParam(settings.name), acceptableValue);
};

