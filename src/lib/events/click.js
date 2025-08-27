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

import createBubbly from './helpers/createBubbly';
import WeakMap from './helpers/weakMap';
import { castToNumberIfString } from '../helpers/stringAndNumberUtils';

function createClickDelegate(window) {
  const bubbly = createBubbly();
  const evaluatedEvents = new WeakMap();
  const MIDDLE_MOUSE_BUTTON = 2;

  /**
   * Determines whether an element is a link that would navigate the user's current window to a
   * different URL.
   * @param {MouseEvent} e
   * @returns {boolean}
   */
  const getDelayableLink = function (e) {
    // user is modifying click with the keyboard, don't delay the navigation
    if (e.ctrlKey || e.metaKey || e.button === MIDDLE_MOUSE_BUTTON) {
      return undefined;
    }

    let node = e.target;
    while (node) {
      const tagName = node.tagName;

      if (tagName && tagName.toLowerCase() === 'a') {
        const href = node.getAttribute('href');
        const target = node.getAttribute('target');

        if (
          href &&
          (!target ||
            target === '_self' ||
            (target === '_top' && window.top === window) ||
            target === window.name)
        ) {
          return node;
        }
      }

      node = node.parentNode;
    }
    return undefined;
  };

  document.addEventListener('click', bubbly.evaluateEvent, true);

  /**
   * The click event. This event occurs when a user has clicked an element.
   * @param {Object} settings - The event settings object.
   * @param {string} [settings.elementSelector] - The CSS selector the element must match in order for
   * the rule to fire.
   * @param {Object[]} settings.elementProperties - Property values the element must have in order
   * for the rule to fire.
   * @param {string} settings.elementProperties[].name - The property name.
   * @param {string} settings.elementProperties[].value - The property value.
   * @param {number|string} [settings.anchorDelay] - When present and a link is clicked, actual
   * navigation will be postponed for a period of time equal with its value. This is typically used to
   * allow time for scripts within the rule to execute, beacons to be sent to servers, etc.
   * @param {boolean} settings.elementProperties[].valueIsRegex=false - Whether <code>value</code>
   * on the object instance is intended to be a regular expression.
   * @param {boolean} settings.bubbleFireIfParent=true - Whether the rule should fire if
   * the event originated from a descendant element.
   * @param {boolean} settings.bubbleFireIfChildFired=true - Whether the rule should fire
   * if the same event has already triggered a rule targeting a descendant element.
   * @param {boolean} settings.bubbleStop=false - Whether the event should not trigger
   * rules on ancestor elements.
   * @param {function} trigger - The trigger callback.
   */
  return function (settings, trigger) {
    bubbly.addListener(settings, function (syntheticEvent) {
      const nativeEvent = syntheticEvent.nativeEvent;

      // AppMeasurement captures the click events, and tries to detect if the element clicked is an A
      // tag that contains an exit link. When that happens, it stops the initial event, sends a
      // beacon, clones the initial event and fires it again.
      // Reactor detects the click events first, because its listeners are set on the capture phase.
      // We need to ignore the cloned event, otherwise the same rule will fire twice. AppMeasurement
      // sets `s_fe` attribute on the cloned event, and that is the flag we'll use to ignore these
      // fake events.
      // https://git.corp.adobe.com/analytics-platform/appmeasurement/blob/master/bin/js/src/AppMeasurement.js#L3196
      if (nativeEvent.s_fe) {
        return;
      }

      const anchorDelay = castToNumberIfString(settings.anchorDelay);
      if (anchorDelay) {
        if (!evaluatedEvents.has(nativeEvent)) {
          const delayableLink = getDelayableLink(nativeEvent);
          if (delayableLink) {
            nativeEvent.preventDefault();
            setTimeout(function () {
              window.location = delayableLink.href;
            }, anchorDelay);
          }
          evaluatedEvents.set(nativeEvent, true);
        }
      }

      trigger(syntheticEvent);
    });
  };
}

export default createClickDelegate;
export const __reset = createBubbly().__reset;
