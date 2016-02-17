'use strict';

var textMatch = require('textMatch');
var getCookie = require('getCookie');

/**
 * Cookie condition. Determines if a particular cookie's actual value matches an acceptable value.
 * @param {Object} settings Condition settings.
 * @param {string} settings.name The name of the cookie.
 * @param {string} settings.value An acceptable cookie value.
 * @param {boolean} [settings.valueIsRegex=false] Whether <code>settings.value</code> is intended to
 * be a regular expression.
 * @returns {boolean}
 */
module.exports = function(settings) {
  var acceptableValue = settings.valueIsRegex ? new RegExp(settings.value, 'i') : settings.value;
  return textMatch(getCookie(settings.name), acceptableValue);
};

