'use strict';

var bubbly = require('getResource')('dtm', 'createBubbly')();
var matchesProperties = require('getResource')('dtm', 'matchesProperties');
var liveQuerySelector = require('liveQuerySelector');
var dataStash = require('createDataStash')('hover');

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
      delayHover(event, trackedDelay, function() {
        bubbly.evaluateEvent(getPseudoEvent(event.target, trackedDelay));
      });
    });
  });
};

/**
 * The hover event. This event occurs when a user has moved the pointer to be on top of an element.
 * @param {Object} config The event config object.
 * @param {string} config.elementSelector The CSS selector the element must match in order for
 * the rule to fire.
 * @param {Object[]} [config.elementProperties] Property values the element must have in order
 * for the rule to fire.
 * @param {string} config.elementProperties[].name The property name.
 * @param {string} config.elementProperties[].value The property value.
 * @param {boolean} [config.elementProperties[].valueIsRegex=false] Whether <code>value</code>
 * on the object instance is intended to be a regular expression.
 * @param {Number} [config.delay] The number of milliseconds the pointer must be on
 * top of the element before declaring that a hover has occurred.
 * @param {boolean} [config.bubbleFireIfParent=false] Whether the rule should fire
 * if the event originated from a descendant element.
 * @param {boolean} [config.bubbleFireIfChildFired=false] Whether the rule should
 * fire if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [config.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(config, trigger) {
  var delay = config.delay || 0;

  var pseudoEventType = getPseudoEventType(delay);
  bubbly.addListener(config, function(event, relatedElement) {
    // Bubbling for this event is dependent upon the delay configured for rules.
    // An event can "bubble up" to other rules with the same delay but not to rules with
    // different delays. See the tests for how this plays out.
    if (event.type === pseudoEventType) {
      trigger(event, relatedElement);
    } else {
      return false;
    }
  });

  liveQuerySelector(config.elementSelector, function(element) {
    if (!matchesProperties(element, config.elementProperties)) {
      return;
    }

    var elementDataStash = dataStash(element);
    var trackedDelays = elementDataStash.delays;

    if (trackedDelays) {
      if (trackedDelays.indexOf(delay) === -1) {
        trackedDelays.push(delay);
      }
    } else {
      trackedDelays = [delay];
      elementDataStash.delays = trackedDelays;
      watchElement(element, trackedDelays);
    }
  });
};
