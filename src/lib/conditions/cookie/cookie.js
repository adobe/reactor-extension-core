'use strict';

var textMatch = require('textMatch');
var getCookie = require('getCookie');

/**
 * Cookie condition. Determines if a particular cookie's actual value matches an acceptable value.
 * @param {Object} config Condition config.
 * @param {string} config.name The name of the cookie.
 * @param {string|RegEx} config.value An acceptable cookie value.
 * @returns {boolean}
 */
module.exports = function(config) {
  return textMatch(getCookie(config.name), config.value);
};

