'use strict';

var POLL_INTERVAL = 3000;

var createDataStash = require('create-data-stash');
var dataStash = createDataStash('entersViewport');
var extension = require('get-extension')('dtm');
var matchesProperties = extension.getHelper('matches-properties');

var listenersBySelector = {};

/**
 * Gets the offset of the element.
 * @param elem
 * @returns {{top: number, left: number}}
 */
var offset = function(elem) {
  var box;

  try {
    box = elem.getBoundingClientRect();
  } catch (e) {
    // ignore
  }

  var docElem = document.documentElement;
  var body = document.body;
  var clientTop = docElem.clientTop || body.clientTop || 0;
  var clientLeft = docElem.clientLeft || body.clientLeft || 0;
  var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return {
    top: top,
    left: left
  };
};

/**
 * Viewport height.
 * @returns {Number}
 */
var getViewportHeight = function() {
  var height = window.innerHeight; // Safari, Opera
  var mode = document.compatMode;

  if (mode) { // IE, Gecko
    height = (mode === 'CSS1Compat') ?
      document.documentElement.clientHeight : // Standards
      document.body.clientHeight; // Quirks
  }

  return height;
};

/**
 * Scroll top.
 * @returns {number}
 */
var getScrollTop = function() {
  return document.documentElement.scrollTop ?
    document.documentElement.scrollTop :
    document.body.scrollTop;
};

/**
 * Whether an element is in the viewport.
 * @param element The element to evaluate.
 * @param viewportHeight The viewport height. Passed in for optimization purposes.
 * @param scrollTop The scroll top. Passed in for optimization purposes.
 * @returns {boolean}
 */
var elementIsInView = function(element, viewportHeight, scrollTop) {
  var top = offset(element).top;
  var height = element.offsetHeight;
  return document.body.contains(element) &&
    !(scrollTop > (top + height) || scrollTop + viewportHeight < top);
};

var dataStashHelper = {
  /**
   * Stores a timeout ID for the target element. This timeout runs while the element is in the
   * viewport and, when finished, potentially executes a rule that was waiting for the delay.
   * @param element
   * @param timeoutId
   */
  storeTimeoutId: function(element, timeoutId) {
    var elementDataStash = dataStash(element);
    elementDataStash.timeoutIds = elementDataStash.timeoutIds || [];
    elementDataStash.timeoutIds.push(timeoutId);
  },

  /**
   * Returns all timeout IDs for the target element.
   * @param element
   * @returns {Array}
   */
  getTimeoutIds: function(element) {
    var elementDataStash = dataStash(element);
    elementDataStash.timeoutIds = elementDataStash.timeoutIds || [];
    return dataStash(element).timeoutIds;
  },

  /**
   * Removes timeout IDs.
   * @param element
   */
  removeTimeoutIds: function(element) {
    dataStash(element).timeoutIds = null;
  },

  /**
   * Stores listeners that are waiting for a delay while the element is in the viewport.
   * @param element
   * @param listener
   */
  storeDelayedListener: function(element, listener) {
    var elementDataStash = dataStash(element);
    elementDataStash.delayedListeners = elementDataStash.delayedListeners || [];
    elementDataStash.delayedListeners.push(listener);
  },

  /**
   * Returns whether the given listener is waiting for a delay while the element is in the viewport.
   * @param element
   * @param listener
   * @returns {boolean}
   */
  isListenerDelayed: function(element, listener) {
    var delayedListeners = dataStash(element).delayedListeners;
    return delayedListeners && delayedListeners.indexOf(listener) > -1;
  },

  /**
   * Removes listeners that were waiting for a delay while the element was in the viewport.
   * @param element
   */
  removeDelayedListeners: function(element) {
    dataStash(element).delayedListeners = null;
  },

  /**
   * Returns whether the listener has been executed for the given target element.
   * @param {HTMLElement} element
   * @param {Object} listener
   * @returns {boolean}
   */
  getIsListenerComplete: function(element, listener) {
    var listeners = dataStash(element).completedListeners;
    return listeners && listeners.indexOf(listener) > -1;
  },

  /**
   * Stores that a listener has been executed for the given target element.
   * @param {HTMLElement} element
   * @param {Object} listener
   */
  storeCompleteListener: function(element, listener) {
    var elementDataStash = dataStash(element);
    elementDataStash.completedListeners = elementDataStash.completedListeners || [];
    elementDataStash.completedListeners.push(listener);
  }
};

/**
 * Handle when a targeted element enters the viewport.
 * @param {HTMLElement} element
 * @param {Number} delay
 * @param {Object} listener
 */
var handleElementEnterViewport = function(element, delay, listener) {
  var complete = function() {
    dataStashHelper.storeCompleteListener(element, listener);

    var event = {
      type: 'inview',
      target: element,
      // If the user did not configure a delay, inviewDelay should be undefined.
      inviewDelay: delay
    };

    listener.trigger(event, element);
  };

  if (delay) {

    if (dataStashHelper.isListenerDelayed(element, listener)) {
      return;
    }

    var timeoutId = setTimeout(function() {
      if (elementIsInView(element, getViewportHeight(), getScrollTop())) {
        complete();
      }
    }, delay);

    dataStashHelper.storeTimeoutId(element, timeoutId);
    dataStashHelper.storeDelayedListener(element, listener);
  } else {
    complete();
  }
};

/**
 * Handle when a targeted element exits the viewport.
 * @param element
 */
var handleElementExitViewport = function(element) {
  var timeoutIds = dataStashHelper.getTimeoutIds(element);

  if (timeoutIds) {
    timeoutIds.forEach(clearTimeout);
    dataStashHelper.removeTimeoutIds(element);
    dataStashHelper.removeDelayedListeners(element);
  }
};

/**
 * Checks to see if a rule's target selector matches an element in the viewport. If that element
 * has not been in the viewport prior, either (a) trigger the rule immediately if the user has not
 * elected to delay for a period of time or (b) start the delay period if the user has elected
 * to delay for a period of time. After an element being in the viewport triggers a rule, it
 * can't trigger the same rule again. If another element matching the same selector comes into
 * the viewport, it may trigger the same rule again.
 */
var checkForElementsInViewport = function() {
  // Cached and re-used for optimization.
  var viewportHeight = getViewportHeight();
  var scrollTop = getScrollTop();

  Object.keys(listenersBySelector).forEach(function(selector) {
    var listeners = listenersBySelector[selector];
    var elements = document.querySelectorAll(selector);

    listeners.forEach(function(listener) {
      var delay = listener.settings.delay;

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        if (dataStashHelper.getIsListenerComplete(element, listener)) {
          continue;
        }

        if (!matchesProperties(element, listener.settings.elementProperties)) {
          continue;
        }

        if (elementIsInView(element, viewportHeight, scrollTop)) {
          handleElementEnterViewport(element, delay, listener);
        } else { // Element is not in view, has delay
          handleElementExitViewport(element);
        }
      }
    });
  });
};

// TODO: Add debounce to the scroll event handling?
window.addEventListener('scroll', checkForElementsInViewport);
window.addEventListener('load', checkForElementsInViewport);
setInterval(checkForElementsInViewport, POLL_INTERVAL);

/**
 * Enters viewport event. This event occurs when an element has entered the viewport. The rule
 * will run once and only once for each element that matches the settings. If multiple
 * elements match the settings, the rule will fire for each matching element.
 * @param {Object} settings The event config object.
 * @param {string} settings.elementSelector The CSS selector the element must match in order for
 * the rule to fire.
 * targeting.
 * @param {Object[]} [settings.elementProperties] Property values the element must have in order
 * for the rule to fire.
 * @param {string} settings.elementProperties[].name The property name.
 * @param {string} settings.elementProperties[].value The property value.
 * @param {boolean} [settings.elementProperties[].valueIsRegex=false] Whether <code>value</code>
 * on the object instance is intended to be a regular expression.
 * @param {Number} [settings.delay] The number of milliseconds the element must be
 * within the viewport before declaring that the event has occurred.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  var listeners = listenersBySelector[settings.elementSelector];

  if (!listeners) {
    listeners = listenersBySelector[settings.elementSelector] = [];
  }

  listeners.push({
    settings: settings,
    trigger: trigger
  });
};
