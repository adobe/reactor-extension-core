'use strict';

var bubbly = require('resourceProvider').get('dtm', 'createBubbly')();
var textMatch = require('textMatch');

document.addEventListener('change', bubbly.evaluateEvent, true);

/**
 * The change event. This event occurs when a change to an element's value is committed by the user.
 * @param {Object} config The event config object.
 * @param {string} [config.selector] The CSS selector for elements the rule is targeting.
 * @param {Object} [config.elementProperties] Property names and values the element must have in
 * order for the rule to fire.
 * @param {string|RegExp} [config.value] What the new value must be for the rule
 * to fire.
 * @param {boolean} [config.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [config.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  var matchValue = config.value;
  bubbly.addListener(config, function(event, relatedElement) {
    if (matchValue === undefined || textMatch(event.target.value, matchValue)) {
      trigger(event, relatedElement);
    } else {
      return false;
    }
  });
};
