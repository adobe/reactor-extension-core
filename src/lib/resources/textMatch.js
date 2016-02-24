'use strict';

/**
 * Performs a string match based on another string or a regex.
 * @param {string} str The string to be evaluate.
 * @param {string|RegExp} pattern The pattern to match against.
 * @returns {boolean} Whether the string matches the pattern.
 */
module.exports = function(str, pattern) {
  if (pattern == null) {
    throw new Error('Illegal Argument: Pattern is not present');
  }
  if (str == null) {
    return false;
  }
  if (typeof pattern === 'string') {
    return str === pattern;
  } else if (pattern instanceof RegExp) {
    return pattern.test(str);
  } else {
    return false;
  }
};
