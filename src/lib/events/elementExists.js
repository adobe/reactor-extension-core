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
import matchesProperties from './helpers/matchesProperties';

const POLL_INTERVAL = 3000;
const seenElements = new WeakMap();
const listenersBySelector = {};

setInterval(function () {
  Object.keys(listenersBySelector).forEach(function (selector) {
    const listeners = listenersBySelector[selector];
    const elements = document.querySelectorAll(selector);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (!seenElements.has(element)) {
        seenElements.set(element, true);
        for (let k = 0; k < listeners.length; k++) {
          const listener = listeners[k];
          if (matchesProperties(element, listener.settings.elementProperties)) {
            listener.trigger({
              element: element,
              target: element
            });
            listeners.splice(k, 1);
            k--;
          }
        }
      }
      if (!listeners.length) {
        delete listenersBySelector[selector];
        break;
      }
    }
  });
}, POLL_INTERVAL);

/**
 * Element exists event. This event occurs when an element has been added to the DOM. The rule
 * should run no more than once.
 * @param {Object} settings The event settings object.
 * @param {string} settings.elementSelector The CSS selector the element must match in order for
 * the rule to fire.
 * @param {Object[]} [settings.elementProperties] Property values the element must have in order
 * for the rule to fire.
 * @param {string} settings.elementProperties[].name The property name.
 * @param {string} settings.elementProperties[].value The property value.
 * @param {boolean} [settings.elementProperties[].valueIsRegex=false] Whether <code>value</code>
 * on the object instance is intended to be a regular expression.
 * @param {ruleTrigger} trigger The trigger callback.
 */
const elementExistsEvent = function (settings, trigger) {
  let listeners = listenersBySelector[settings.elementSelector];
  if (!listeners) {
    listeners = listenersBySelector[settings.elementSelector] = [];
  }
  listeners.push({
    settings: settings,
    trigger: trigger
  });
};

export default elementExistsEvent;
