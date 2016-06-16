'use strict';

var propertySettings = require('property-settings');
var WeakMap = require('weak-map');
var dataStash = new WeakMap();
var bubbly = require('../helpers/createBubbly.js')();
var window = require('window');

/**
 * Determines whether an element is a link that would navigate the user's current window to a
 * different URL.
 * @param element
 * @returns {boolean}
 */
var isNavigationLink = function(element) {
  var tagName = element.tagName;

  if (tagName && tagName.toLowerCase() !== 'a') {
    return false;
  }

  var target = element.getAttribute('target');
  var href = element.getAttribute('href');
  if (!href) {
    return false;
  } else if (!target) {
    return true;
  } else if (target === '_blank') {
    return false;
  } else if (target === '_top') {
    return window.top === window;
  } else if (target === '_parent') {
    return false;
  } else if (target === '_self') {
    return true;
  } else if (window.name) {
    return target === window.name;
  } else {
    return true;
  }
};

document.addEventListener('click', bubbly.evaluateEvent, true);

/**
 * The click event. This event occurs when a user has clicked an element.
 * @param {Object} settings The event settings object.
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
 * @param {boolean} [settings.delayLinkActivation=false] When true and a link is clicked, actual
 * navigation will be postponed for a period of time. This is typically used to allow time for
 * scripts within the rule to execute, beacons to be sent to servers, etc.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  bubbly.addListener(settings, function(relatedElement, event) {
    if (settings.delayLinkActivation) {
      if (!dataStash.get(event)) {
        if (isNavigationLink(event.target)) {
          event.preventDefault();
          setTimeout(function() {
            window.location = event.target.href;
          }, propertySettings.linkDelay || 100);
        }
        dataStash.set(event, true);
      }
    }

    trigger.call(this, relatedElement, event);
  });
};

/**
 * @private
 * Clears all listeners. This should only be used in tests.
 */
module.exports.__reset = bubbly.__reset;
