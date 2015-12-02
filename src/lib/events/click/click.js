'use strict';

var propertyConfig = require('propertyConfig');
var dataStash = require('createDataStash')('click');
var bubbly = require('resourceProvider').get('dtm', 'createBubbly')();
var window = require('window');

/**
 * Determines whether an element is a link that would navigate the user's current window to a
 * different URL.
 * @param element
 * @returns {boolean}
 */
var isNavigationLink = function(element){
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
 * @param {Object} config The event config object.
 * @param {string} [config.selector] The CSS selector for elements the rule is targeting.
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
 * @param {boolean} [config.delayLinkActivation=false] When true and a link is clicked, actual
 * navigation will be postponed for a period of time. This is typically used to allow time for
 * scripts within the rule to execute, beacons to be sent to servers, etc.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  bubbly.addListener(config, function(event, relatedElement) {
    if (config.delayLinkActivation) {
      var eventDataStash = dataStash(event);
      if (!eventDataStash.evaluatedForLinkDelay) {
        if (isNavigationLink(event.target)) {
          event.preventDefault();
          setTimeout(function() {
            window.location = event.target.href;
          }, propertyConfig.linkDelay || 100);
        }
        eventDataStash.evaluatedForLinkDelay = true;
      }
    }

    trigger.call(this, event, relatedElement);
  });
};

if (ENV_TEST) {
  module.exports.reset = bubbly.reset;
}
