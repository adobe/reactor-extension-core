'use strict';

var textMatch = require('textMatch');
var getCookie = require('getCookie');

/**
 * Cookie condition. Determines if a particular cookie's actual value matches an acceptable value.
 * @param {Object} config Condition config.
 * @param {string} config.name The name of the cookie.
 * @param {string} config.value An acceptable cookie value.
 * @param {boolean} [config.valueIsRegex] Whether <code>config.value</code> is intended to be
 * a regular expression.
 * @returns {boolean}
 */
module.exports = function(config) {
  var acceptableValue = config.valueIsRegex ? new RegExp(config.value, 'i') : config.value;
  return textMatch(getCookie(config.name), acceptableValue);
};

