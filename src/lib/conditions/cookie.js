'use strict';

var document = require('document');
var cookie = require('cookie');
var textMatch = require('../helpers/textMatch');

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
  return textMatch(cookie.parse(document.cookie)[settings.name], acceptableValue);
};

