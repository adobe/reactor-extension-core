'use strict';

var bubbly = require('resourceProvider').get('dtm', 'createBubbly')();

document.addEventListener('submit', bubbly.evaluateEvent, true);

/**
 * The submit event. This event occurs when an element has lost focus.
 * @param {Object} config The event config object.
 * @param {string} config.selector The CSS selector for elements the rule is targeting.
 * @param {Object} [config.elementProperties] Property names and values the element must have in
 * order for the rule to fire.
 * @param {boolean} [config.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [config.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  bubbly.addListener(config, trigger);
};
