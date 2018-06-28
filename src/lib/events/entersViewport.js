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

var WeakMap = require('./helpers/weakMap');
var debounce = require('./helpers/debounce');
var enableWeakMapDefaultValue = require('./helpers/enableWeakMapDefaultValue');

var POLL_INTERVAL = 3000;
var DEBOUNCE_DELAY = 200;

var arrayFactory = function() {
  return [];
};

var timeoutIdsByElement = enableWeakMapDefaultValue(new WeakMap(), arrayFactory);
var delayedListenersByElement = enableWeakMapDefaultValue(new WeakMap(), arrayFactory);
var completedListenersByElement = enableWeakMapDefaultValue(new WeakMap(), arrayFactory);

var matchesProperties = require('./helpers/matchesProperties');

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
 * Handle when a targeted element enters the viewport.
 * @param {HTMLElement} element
 * @param {number} delay
 * @param {Object} listener
 */
var handleElementEnterViewport = function(element, delay, listener) {
  var complete = function() {
    completedListenersByElement.get(element).push(listener);

    listener.trigger({
      element: element,
      target: element,
      delay: delay
    });
  };

  if (delay) {

    if (delayedListenersByElement.get(element).indexOf(listener) !== -1) {
      return;
    }

    var timeoutId = setTimeout(function() {
      if (elementIsInView(element, getViewportHeight(), getScrollTop())) {
        complete();
      }
    }, delay);

    timeoutIdsByElement.get(element).push(timeoutId);
    delayedListenersByElement.get(element).push(listener);
  } else {
    complete();
  }
};

/**
 * Handle when a targeted element exits the viewport.
 * @param element
 */
var handleElementExitViewport = function(element) {
  var timeoutIds = timeoutIdsByElement.get(element);
  if (timeoutIds) {
    timeoutIds.forEach(clearTimeout);
    timeoutIdsByElement.delete(element);
    delayedListenersByElement.delete(element);
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

        if (completedListenersByElement.get(element).indexOf(listener) !== -1) {
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
}, DEBOUNCE_DELAY);

document.addEventListener('DOMContentLoaded', function() {
  checkForElementsInViewport();
  setInterval(checkForElementsInViewport, POLL_INTERVAL);
  window.addEventListener('resize', checkForElementsInViewport);
  window.addEventListener('scroll', checkForElementsInViewport);
});

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
