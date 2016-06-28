'use strict';

var bubbly = require('../helpers/createBubbly.js')();
var liveQuerySelector = require('../helpers/liveQuerySelector.js');
var matchesProperties = require('../helpers/matchesProperties.js');
var WeakMap = require('weak-map');
var trackedDelaysByElement = new WeakMap();

/**
 * After a mouseenter has occurred, waits a given amount of time before declaring that a hover
 * has occurred.
 * @param {Event} event The mouseenter event.
 * @param {Number} delay The amount of delay in milliseconds. If delay = 0, the handler will be
 * called immediately.
 * @param {Function} handler The function that should be called
 */
var delayHover = function(event, delay, handler) {
  if (delay === 0) {
    handler(event);
    return;
  }

  var timeoutId;
  var removeMouseLeaveListener;
  var handleMouseLeave;

  removeMouseLeaveListener = function() {
    event.target.removeEventListener('mouseleave', handleMouseLeave);
  };

  handleMouseLeave = function() {
    clearTimeout(timeoutId);
    removeMouseLeaveListener();
  };

  timeoutId = setTimeout(function() {
    handler(event);
    removeMouseLeaveListener();
  }, delay);

  event.target.addEventListener('mouseleave', handleMouseLeave);
};

var getPseudoEventType = function(delay) {
  return 'hover(' + delay + ')';
};

var getPseudoEvent = function(target, delay) {
  return {
    type: getPseudoEventType(delay),
    target: target,
    delay: delay
  };
};

var watchElement = function(element, trackedDelays) {
  element.addEventListener('mouseenter', function(event) {
    trackedDelays.forEach(function(trackedDelay) {
      delayHover(event, trackedDelay, function(event) {
        bubbly.evaluateEvent(getPseudoEvent(event.target, trackedDelay));
      });
    });
  });
};

/**
 * The hover event. This event occurs when a user has moved the pointer to be on top of an element.
 * @param {Object} settings The event settings object.
 * @param {string} settings.elementSelector The CSS selector the element must match in order for
 * the rule to fire.
 * @param {Object[]} [settings.elementProperties] Property values the element must have in order
 * for the rule to fire.
 * @param {string} settings.elementProperties[].name The property name.
 * @param {string} settings.elementProperties[].value The property value.
 * @param {boolean} [settings.elementProperties[].valueIsRegex=false] Whether <code>value</code>
 * on the object instance is intended to be a regular expression.
 * @param {Number} [settings.delay] The number of milliseconds the pointer must be on
 * top of the element before declaring that a hover has occurred.
 * @param {boolean} [settings.bubbleFireIfParent=false] Whether the rule should fire
 * if the event originated from a descendant element.
 * @param {boolean} [settings.bubbleFireIfChildFired=false] Whether the rule should
 * fire if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [settings.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  var delay = settings.delay || 0;

  var pseudoEventType = getPseudoEventType(delay);
  bubbly.addListener(settings, function(relatedElement, event) {
    // Bubbling for this event is dependent upon the delay configured for rules.
    // An event can "bubble up" to other rules with the same delay but not to rules with
    // different delays. See the tests for how this plays out.
    if (event.type === pseudoEventType) {
      trigger(relatedElement, event);
    } else {
      return false;
    }
  });

  liveQuerySelector(settings.elementSelector, function(element) {
    if (!matchesProperties(element, settings.elementProperties)) {
      return;
    }

    var trackedDelays = trackedDelaysByElement.get(element);

    if (trackedDelays) {
      if (trackedDelays.indexOf(delay) === -1) {
        trackedDelays.push(delay);
      }
    } else {
      trackedDelays = [delay];
      trackedDelaysByElement.set(element, trackedDelays);
      watchElement(element, trackedDelays);
    }
  });
};
