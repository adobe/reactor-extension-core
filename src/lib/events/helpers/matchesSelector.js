'use strict';

var logger = require('@turbine/logger');

/**
 * Returns whether an element matches a selector.
 * @param {HTMLElement} element The HTML element being tested.
 * @param {string} selector The CSS selector.
 * @returns {boolean}
 */
module.exports = function(element, selector) {
  var matches = element.matches || element.msMatchesSelector;

  if (matches) {
    try {
      return matches.call(element, selector);
    } catch (error) {
      logger.warn('Matching element failed. ' + selector + ' is not a valid selector.');
      return false;
    }
  }

  return false;
};
