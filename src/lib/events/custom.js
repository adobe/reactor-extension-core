'use strict';
var bubbly = require('../helpers/createBubbly.js')();

var typesWatched = [];

/**
 * The custom event. When an event is seen with the specified type, the rule will be executed.
 * @param {Object} settings The event settings object.
 * @param {string} settings.type The custom event type.
 * @param {string} [settings.elementSelector] The CSS selector the element must match in order for
 * the rule to fire.
 * @param {Object[]} [settings.elementProperties] Property values the element must have in order
 * for the rule to fire.
 * @param {string} settings.elementProperties[].name The property name.
 * @param {string} settings.elementProperties[].value The property value.
 * @param {boolean} [settings.elementProperties[].valueIsRegex=false] Whether <code>value</code>
 * on the object instance is intended to be a regular expression.
 * @param {boolean} [settings.bubbleFireIfParent=false] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [settings.bubbleFireIfChildFired=false] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [settings.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  var type = settings.type;

  if (typesWatched.indexOf(type) === -1) {
    typesWatched.push(type);
    document.addEventListener(type, bubbly.evaluateEvent, true);
  }

  bubbly.addListener(settings, trigger);
};
