'use strict';

/**
 * Custom condition. This executes a condition script provided by the user.
 * @param {Object} settings Condition settings.
 * @param {HTMLElement} [relatedElement] The element the rule was targeting.
 * @param {Function} settings.source The custom script function.
 * @param {Object} [event] The underlying event object the triggered the rule.
 * @param {Object} [event.target] The element where the event originated.
 * @returns {boolean}
 */
module.exports = function(settings, relatedElement, event) {
  return settings.source.call(
    relatedElement,
    event,
    event ? event.target : undefined);
};
