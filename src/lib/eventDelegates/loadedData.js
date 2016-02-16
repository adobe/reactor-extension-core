'use strict';
var extension = require('getExtension')('dtm');
var bubbly = extension.getResource('createBubbly')();

document.addEventListener('loadeddata', bubbly.evaluateEvent, true);

/**
 * The loadeddata event. This event occurs when the first frame of the media has finished loading.
 * @param {Object} config The event config object.
 * @param {string} [config.elementSelector] The CSS selector the element must match in order for
 * the rule to fire.
 * @param {Object[]} [config.elementProperties] Property values the element must have in order
 * for the rule to fire.
 * @param {string} config.elementProperties[].name The property name.
 * @param {string} config.elementProperties[].value The property value.
 * @param {boolean} [config.elementProperties[].valueIsRegex=false] Whether <code>value</code>
 * on the object instance is intended to be a regular expression.
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
