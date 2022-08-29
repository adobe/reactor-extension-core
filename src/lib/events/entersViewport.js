/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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
var enableWeakMapDefaultValue = require('./helpers/enableWeakMapDefaultValue');
var matchesSelector = require('./helpers/matchesSelector');
var matchesProperties = require('./helpers/matchesProperties');
var castToNumberIfString =
  require('../helpers/stringAndNumberUtils').castToNumberIfString;

var OBSERVER_PROCESSING_FREQUENCY = 200;
var OBSERVER_ELEMENT_REFRESH_FREQUENCY = 3000;

var frequencies = {
  FIRST_ENTRY: 'firstEntry',
  EVERY_ENTRY: 'everyEntry'
};

var stateByElement = enableWeakMapDefaultValue(new WeakMap(), function () {
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
var observersBySelector = {};
var observerQueue = [];

/**
 * Handle when a targeted element is inside the viewport.
 */
var handleElementInsideViewport = function (element) {
  var elementState = stateByElement.get(element);

  if (elementState.inViewport) {
    return;
  }

  elementState.inViewport = true;

  // Evaluate the element against all stored listeners to see which ones should be triggered
  // due to the element being in the viewport.
  Object.keys(listenersBySelector).forEach(function (selector) {
    if (!matchesSelector(element, selector)) {
      return;
    }

    listenersBySelector[selector].forEach(function (listener) {
      if (!matchesProperties(element, listener.settings.elementProperties)) {
        return;
      }

      // If the listener was already triggered and shouldn't be triggered again, bail.
      if (elementState.completedListeners.indexOf(listener) !== -1) {
        return;
      }

      var delayComplete = function () {
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
        var timeoutId = window.setTimeout(function () {
          // One last check to make sure the element is still in view.
          // if (elementIsInView(element, getViewportHeight(), getScrollTop())) {
          // console.log('INVOKING DELAY COMPLETE')
          delayComplete();
          // }
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
var handleElementOutsideViewport = function (element) {
  var elementState = stateByElement.get(element);
  elementState.inViewport = false;
  if (elementState.timeoutIds.length) {
    elementState.timeoutIds.forEach(clearTimeout);
    elementState.timeoutIds = [];
  }
};

/**
 * Creates an intersection observer over any and all HTMLElement objects returned
 * by the elementSelector.
 * @param {string} elementSelector - The selector used to gather the elements on page.
 * @param {HTMLElement[]} elements - The elements gathered by the selector.
 */
var observeElements = function (elementSelector, elements) {
  var observerOptions = {
    root: null,
    rootMargin: '0px'
  };

  var observerCallback = function (observerEntries) {
    observerEntries.forEach(function (entry) {
      if (entry.isIntersecting) {
        handleElementInsideViewport(entry.target);
      } else {
        handleElementOutsideViewport(entry.target);
      }
    });
  };

  var observer;
  if (observersBySelector.hasOwnProperty(elementSelector)) {
    observer = observersBySelector[elementSelector];
  } else {
    observer = new IntersectionObserver(observerCallback, observerOptions);
    observersBySelector[elementSelector] = observer;
    // NOTE: this doesn't work because between tests it's the same browser
    // but the elements got trashed in the tests
    // elements.forEach(function (element) {
    //   observer.observe(element);
    // });
  }
  elements.forEach(function (element) {
    observer.observe(element);
  });
};

/**
 * To be run periodically to see if new listeners are introduced, or
 * if new elements have entered the page that can be observed by a listener, where
 * no previous elements ever matched an element selector. If new elements enter
 * the page for an already registered elementSelector, we ignore them.
 */
var initializeObserversInQueue = function () {
  var observersToProcess = observerQueue;
  observerQueue = [];
  observersToProcess.forEach(function (elementSelector) {
    var elements = document.querySelectorAll(elementSelector);
    if (elements.length) {
      observeElements(elementSelector, elements);
    } else if (!observerQueue.includes(elementSelector)) {
      // an element may come on the page later, so keep it in the queue
      observerQueue.push(elementSelector);
    }
  });
};

var refreshObserverElements = function () {
  Object.keys(observersBySelector).forEach(function (elementSelector) {
    var elements = document.querySelectorAll(elementSelector);
    var observer = observersBySelector[elementSelector];
    elements.forEach(function (element) {
      observer.observe(element);
    });
  });
};

/**
 * Processes any new or orphaned listeners that need to see if there are elements
 * on the page that we can observe.
 */
var observerQueueProcessingId;
var startObserverProcessingQueue = function () {
  if (!observerQueueProcessingId) {
    observerQueueProcessingId = window.setInterval(
      initializeObserversInQueue,
      OBSERVER_PROCESSING_FREQUENCY
    );
    window.setInterval(
      refreshObserverElements,
      OBSERVER_ELEMENT_REFRESH_FREQUENCY
    );
  }
};

if (document.readyState !== 'loading') {
  startObserverProcessingQueue();
} else {
  document.addEventListener('DOMContentLoaded', startObserverProcessingQueue);
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
 * @param {number|string} [settings.delay] The number of milliseconds the element must be
 * within the viewport before declaring that the event has occurred.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function (settings, trigger) {
  // every listener should always be added to be notified
  var listeners = listenersBySelector[settings.elementSelector];
  if (!listeners) {
    listeners = listenersBySelector[settings.elementSelector] = [];
  }
  settings.delay = castToNumberIfString(settings.delay);
  listeners.push({
    settings: settings,
    trigger: trigger
  });

  // NOTE: this doesn't work because between tests it's the same browser
  // but the elements got trashed in the tests
  // if (!observersBySelector.hasOwnProperty(settings.elementSelector)) {
  observerQueue.push(settings.elementSelector);
  // }
};
