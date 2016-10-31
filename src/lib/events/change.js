'use strict';
var bubbly = require('../helpers/createBubbly')();
var textMatch = require('../helpers/textMatch');

document.addEventListener('change', bubbly.evaluateEvent, true);

/**
 * The change event. This event occurs when a change to an element's value is committed by the user.
 * @param {Object} settings The event settings object.
 * @param {string} [settings.elementSelector] The CSS selector the element must match in order for
 * the rule to fire.
 * @param {Object[]} [settings.elementProperties] Property values the element must have in order
 * for the rule to fire.
 * @param {string} settings.elementProperties[].name The property name.
 * @param {string} settings.elementProperties[].value The property value.
 * @param {boolean} [settings.elementProperties[].valueIsRegex=false] Whether <code>value</code>
 * on the object instance is intended to be a regular expression.
 * @param {string} [settings.value] What the new value must be for the rule
 * to fire.
 * @param {boolean} [settings.valueIsRegex=false] Whether <code>settings.value</code> is intended to
 * be a regular expression.
 * @param {boolean} [settings.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [settings.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [settings.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  var acceptableValue = settings.valueIsRegex ? new RegExp(settings.value, 'i') : settings.value;
  bubbly.addListener(settings, function(relatedElement, event) {
    if (acceptableValue === undefined || textMatch(event.target.value, acceptableValue)) {
      trigger(relatedElement, event);
    } else {
      return false;
    }
  });
};
