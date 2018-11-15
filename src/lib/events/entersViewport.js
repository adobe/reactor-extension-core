/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

var document = require('@adobe/reactor-document');
var window = require('@adobe/reactor-window');
var WeakMap = require('./helpers/weakMap');
var debounce = require('./helpers/debounce');
var enableWeakMapDefaultValue = require('./helpers/enableWeakMapDefaultValue');
var matchesSelector = require('./helpers/matchesSelector');
var matchesProperties = require('./helpers/matchesProperties');

var POLL_INTERVAL = 3000;
var DEBOUNCE_DELAY = 200;
var frequencies = {
  FIRST_ENTRY: 'firstEntry',
  EVERY_ENTRY: 'everyEntry'
};
var isIE10 = window.navigator.appVersion.indexOf('MSIE 10') !== -1;

var stateByElement = enableWeakMapDefaultValue(new WeakMap(), function() {
  return {
    // When a user configures the event to fire the rule after an element has been inside
    // the viewport for a certain period of time, we run a timeout for that period of time after
    // we first see the element in the viewport. This array contains the IDs for all the timeouts
    // for the element.
    timeoutIds: [],
    // When a user configures the event to only fire a rule once, after the rule has been triggered,
    // we store the "listener" in this array so that we know it's been fired and shouldn't be fired
    // again.
    completedListeners: [],
    // Whether the element is currently inside the viewport.
    inViewport: false
  };
});

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
 * @returns {number}
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

/**
 * Handle when a targeted element is inside the viewport.
 */
var handleElementInsideViewport = function(element) {
  var elementState = stateByElement.get(element);

  if (elementState.inViewport) {
    return;
  }

  elementState.inViewport = true;

  // Evaluate the element against all stored listeners to see which ones should be triggered
  // due to the element being in the viewport.
  Object.keys(listenersBySelector).forEach(function(selector) {
    if (!matchesSelector(element, selector)) {
      return;
    }

    listenersBySelector[selector].forEach(function(listener) {
      if (!matchesProperties(element, listener.settings.elementProperties)) {
        return;
      }

      // If the listener was already triggered and shouldn't be triggered again, bail.
      if (elementState.completedListeners.indexOf(listener) !== -1) {
        return;
      }

      var delayComplete = function() {
        var frequency = listener.settings.frequency || frequencies.FIRST_ENTRY;

        // When a user configures the event to only fire a rule once, then after the rule
        // has been triggered we store the "listener" in this array so that we know it's
        // been triggered and shouldn't be triggered in the future.
        if (frequency === frequencies.FIRST_ENTRY) {
          elementState.completedListeners.push(listener);
        }

        listener.trigger({
          element: element,
          target: element,
          delay: listener.settings.delay
        });
      };

      if (listener.settings.delay) {
        var timeoutId = setTimeout(function() {
          // One last check to make sure the element is still in view.
          if (elementIsInView(element, getViewportHeight(), getScrollTop())) {
            delayComplete();
          }
        }, listener.settings.delay);

        elementState.timeoutIds.push(timeoutId);
      } else {
        delayComplete();
      }
    });
  });
};

/**
 * Handle when a targeted element is outside the viewport.
 */
var handleElementOutsideViewport = function(element) {
  var elementState = stateByElement.get(element);
  elementState.inViewport = false;

  if (elementState.timeoutIds.length) {
    elementState.timeoutIds.forEach(clearTimeout);
    elementState.timeoutIds = [];
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
var checkForElementsInViewport = debounce(function() {
  var selectors = Object.keys(listenersBySelector);

  if (!selectors.length) {
    return;
  }

  // Find all the elements pertaining to rules using Enters Viewport.
  var elements = document.querySelectorAll(selectors.join(','));

  // Cached and re-used for optimization.
  var viewportHeight = getViewportHeight();
  var scrollTop = getScrollTop();

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (elementIsInView(element, viewportHeight, scrollTop)) {
      handleElementInsideViewport(element);
    } else {
      handleElementOutsideViewport(element);
    }
  }
}, DEBOUNCE_DELAY);

var initializeContentListeners = function() {
  checkForElementsInViewport();
  setInterval(checkForElementsInViewport, POLL_INTERVAL);
  window.addEventListener('resize', checkForElementsInViewport);
  window.addEventListener('scroll', checkForElementsInViewport);
};

// There's a bug in IE 10 where readyState is sometimes set to "interactive" too
// early (before DOMContentLoaded has fired). To make sure the document is ready,
// we'll wait until the window has loaded.
// https://bugs.jquery.com/ticket/12282
if (isIE10) {
  if (document.readyState === 'complete') {
    initializeContentListeners();
  } else {
    window.addEventListener('load', initializeContentListeners);
  }
} else {
  if (document.readyState !== 'loading') {
    initializeContentListeners();
  } else {
    document.addEventListener('DOMContentLoaded', initializeContentListeners);
  }
}

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
 * @param {number} [settings.delay] The number of milliseconds the element must be
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
