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

import WeakMap from './helpers/weakMap';
import enableWeakMapDefaultValue from './helpers/enableWeakMapDefaultValue';
import matchesSelector from './helpers/matchesSelector';
import matchesProperties from './helpers/matchesProperties';
import { castToNumberIfString } from '../helpers/stringAndNumberUtils';
import intersectionObserverIntervals from '../helpers/intersectionObserverIntervals';

function createEntersViewportDelegate(window, document) {
  const frequencies = {
    FIRST_ENTRY: 'firstEntry',
    EVERY_ENTRY: 'everyEntry'
  };

  const stateByElement = enableWeakMapDefaultValue(new WeakMap(), function () {
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
  const listenersByDOMSelector = {};

  /**
   * Handle when a targeted element is inside the viewport.
   */
  const handleElementInsideViewport = function (element) {
    const elementState = stateByElement.get(element);

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

        const delayComplete = function () {
          const frequency =
            listener.settings.frequency || frequencies.FIRST_ENTRY;
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
          const timeoutId = window.setTimeout(function () {
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
  const handleElementOutsideViewport = function (element) {
    const elementState = stateByElement.get(element);
    elementState.inViewport = false;
    if (elementState.timeoutIds.length) {
      elementState.timeoutIds.forEach(clearTimeout);
      elementState.timeoutIds = [];
    }
  };

  let orphanedObservers = [];
  const observerCallback = function (observerEntries) {
    observerEntries.forEach(function (entry) {
      if (entry.isIntersecting) {
        handleElementInsideViewport(entry.target);
      } else {
        handleElementOutsideViewport(entry.target);
      }
    });
  };
  const intersectionObserver = new IntersectionObserver(observerCallback, {
    root: null,
    rootMargin: '0px'
  });

  const observeElements = function (querySelector) {
    if (!querySelector) {
      return;
    }

    document.querySelectorAll(querySelector).forEach(function (element) {
      intersectionObserver.observe(element);
    });
  };

  /**
   * Start timers to handle IntersectionObserver
   */
  (function start() {
    const safelyBeginProcessing = function () {
      // process the orphaned observers from page startup
      observeElements(orphanedObservers.join(','));
      orphanedObservers = [];

      const observeIntervalId = window.setInterval(function () {
        observeElements(Object.keys(listenersByDOMSelector).join(','));
      }, intersectionObserverIntervals.standard.pageElementsRefresh);

      window.addEventListener(
        'beforeunload',
        function cleanupPage() {
          intersectionObserver.disconnect();
          window.clearInterval(observeIntervalId);
        },
        false
      );
    };
    if (document.readyState !== 'loading') {
      safelyBeginProcessing();
    } else {
      document.addEventListener('DOMContentLoaded', safelyBeginProcessing);
    }
  })();

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
  return function (settings, trigger) {
    if (!settings.elementSelector) {
      return;
    }

    // every listener should always be added to be notified
    let listeners = listenersByDOMSelector[settings.elementSelector];
    const isNewSelector = Boolean(!listeners);
    if (isNewSelector) {
      listeners = listenersByDOMSelector[settings.elementSelector] = [];
    }
    settings.delay = castToNumberIfString(settings.delay);
    listeners.push({
      settings: settings,
      trigger: trigger
    });

    // a one-time push to get things going fast
    if (document.readyState === 'loading') {
      orphanedObservers.push(settings.elementSelector);
    } else {
      // start observing right away elements for selectors we've never known about
      if (isNewSelector) {
        observeElements(settings.elementSelector);
      }
    }
  };
}

export default createEntersViewportDelegate;
