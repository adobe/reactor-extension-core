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

// trigger functions by elementSelector
var listenersByDOMSelector = {};
// IntersectionObservers by elementSelector
var observersByDOMSelector = {};
// elementSelectors that haven't been processed/found matching element on the page yet
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
  Object.keys(listenersByDOMSelector).forEach(function (selector) {
    if (!matchesSelector(element, selector)) {
      return;
    }

    listenersByDOMSelector[selector].forEach(function (listener) {
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
          // One last check to make sure the element is still in view, using fresh data
          if (Boolean(stateByElement.get(element).inViewport)) {
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
var handleElementOutsideViewport = function (element) {
  var elementState = stateByElement.get(element);
  elementState.inViewport = false;
  if (elementState.timeoutIds.length) {
    elementState.timeoutIds.forEach(clearTimeout);
    elementState.timeoutIds = [];
  }
};

/**
 * Ties observation of the elements to the selector used to find the elements.
 *
 * @param {string} elementSelector - The selector used to gather the elements on page.
 * @param {HTMLElement[]} elements - The elements gathered by the selector.
 */
var observeElements = function (elementSelector, elements) {
  var observer;

  // pull or create the IntersectionObserver for the elementSelector
  if (observersByDOMSelector.hasOwnProperty(elementSelector)) {
    observer = observersByDOMSelector[elementSelector];
    // TODO what if elements go away for good? edge case to ignore?
    //  worried that if we disconnect, we could miss a time to fire while
    //  rebuilding the observer in here
    // observer.disconnect();
  } else {
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
    observer = new IntersectionObserver(observerCallback, observerOptions);
    observersByDOMSelector[elementSelector] = observer;
  }

  elements.forEach(function (element) {
    observer.observe(element);
  });
};

/**
 * This is a fast queue of DOM element selectors where we pull all available
 * elements and begin observing them.
 *
 * If we don't find any elements, we shove the DOM element back in the queue
 * for the next tick.
 */
var initializeObserversInQueue = function () {
  var observersToProcess = observerQueue;
  observerQueue = [];
  observersToProcess.forEach(function (elementSelector) {
    var elements = document.querySelectorAll(elementSelector);
    if (elements.length) {
      observeElements(elementSelector, elements);
    } else if (!observerQueue.includes(elementSelector)) {
      observerQueue.push(elementSelector);
    }
  });
};

/**
 * Slower queue that loops through all known Observer DOM selectors, and observes any
 * newly found elements.
 */
var refreshObserverElements = function () {
  Object.keys(observersByDOMSelector).forEach(function (elementSelector) {
    observeElements(
      elementSelector,
      document.querySelectorAll(elementSelector)
    );
  });
};

var viewportIntervalIds = [];
/**
 * @param {Object} extensionModuleSettings
 * @param {Number} extensionModuleSettings.observerProcessingFrequency
 * @param {Number} extensionModuleSettings.observerElementRefreshFrequency
 */
var safelyBeginProcessing = function (extensionModuleSettings) {
  // this check stops processing future calls immediately when the listeners are running
  if (viewportIntervalIds.length) {
    return;
  }

  var startObserverProcessingQueue = function (extensionModuleSettings) {
    // this check prevents accidentally calling this multiple times before the DOM is ready
    // and the check up-top wouldn't stop processing yet. By putting all this logic here,
    // there doesn't need to be checking anywhere else.
    if (!viewportIntervalIds.length) {
      var observerProcessingFrequency = castToNumberIfString(
        extensionModuleSettings.entersViewportObserverFrequency || 200
      );
      viewportIntervalIds.push(
        window.setInterval(
          initializeObserversInQueue,
          observerProcessingFrequency
        )
      );
      var observerElementRefreshFrequency = castToNumberIfString(
        extensionModuleSettings.entersViewportElementRefreshFrequency || 3000
      );
      viewportIntervalIds.push(
        window.setInterval(
          refreshObserverElements,
          observerElementRefreshFrequency
        )
      );
      window.addEventListener(
        'beforeunload',
        function () {
          viewportIntervalIds.forEach(function (intervalId) {
            window.clearInterval(intervalId);
          });
          Object.keys(observersByDOMSelector).forEach(function (
            elementSelector
          ) {
            // stops the observation of elements in the DOM
            observersByDOMSelector[elementSelector].disconnect();
          });
        },
        false
      );
    }
  };

  if (document.readyState !== 'loading') {
    startObserverProcessingQueue(extensionModuleSettings);
  } else {
    document.addEventListener(
      'DOMContentLoaded',
      startObserverProcessingQueue.bind(null, extensionModuleSettings)
    );
  }
};

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
var turbineExtensionSettings;
module.exports = function (settings, trigger) {
  // first one in, turn on the lights. this pattern allows us to inject the
  // Interval IDs using extension settings.
  safelyBeginProcessing(
    turbineExtensionSettings ||
      (turbineExtensionSettings = turbine.getExtensionSettings())
  );
  // every listener should always be added to be notified
  var listeners = listenersByDOMSelector[settings.elementSelector];
  if (!listeners) {
    listeners = listenersByDOMSelector[settings.elementSelector] = [];
  }
  settings.delay = castToNumberIfString(settings.delay);
  listeners.push({
    settings: settings,
    trigger: trigger
  });

  if (!observersByDOMSelector.hasOwnProperty(settings.elementSelector)) {
    observerQueue.push(settings.elementSelector);
  }
};
