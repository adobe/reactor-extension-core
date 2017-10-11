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

var window = require('@adobe/reactor-window');
var bubbly = require('./helpers/createBubbly')();
var WeakMap = require('./helpers/weakMap');
var evaluatedEvents = new WeakMap();

/**
 * Determines whether an element is a link that would navigate the user's current window to a
 * different URL.
 * @param element
 * @returns {boolean}
 */
var isNavigationLink = function(element) {
  var tagName = element.tagName;

  if (tagName && tagName.toLowerCase() !== 'a') {
    return false;
  }

  var target = element.getAttribute('target');
  var href = element.getAttribute('href');
  if (!href) {
    return false;
  } else if (!target) {
    return true;
  } else if (target === '_blank') {
    return false;
  } else if (target === '_top') {
    return window.top === window;
  } else if (target === '_parent') {
    return false;
  } else if (target === '_self') {
    return true;
  } else if (window.name) {
    return target === window.name;
  } else {
    return true;
  }
};

document.addEventListener('click', bubbly.evaluateEvent, true);

/**
 * The click event. This event occurs when a user has clicked an element.
 * @param {Object} settings The event settings object.
 * @param {string} [settings.elementSelector] The CSS selector the element must match in order for
 * the rule to fire.
 * @param {Object[]} [settings.elementProperties] Property values the element must have in order
 * for the rule to fire.
 * @param {string} settings.elementProperties[].name The property name.
 * @param {string} settings.elementProperties[].value The property value.
 * @param {boolean} [settings.elementProperties[].valueIsRegex=false] Whether <code>value</code>
 * on the object instance is intended to be a regular expression.
 * @param {boolean} [settings.bubbleFireIfParent=true] Whether the rule should fire if
 * the event originated from a descendant element.
 * @param {boolean} [settings.bubbleFireIfChildFired=true] Whether the rule should fire
 * if the same event has already triggered a rule targeting a descendant element.
 * @param {boolean} [settings.bubbleStop=false] Whether the event should not trigger
 * rules on ancestor elements.
 * @param {boolean} [settings.delayLinkActivation=false] When true and a link is clicked, actual
 * navigation will be postponed for a period of time. This is typically used to allow time for
 * scripts within the rule to execute, beacons to be sent to servers, etc.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  bubbly.addListener(settings, function(syntheticEvent) {
    var nativeEvent = syntheticEvent.nativeEvent;

    // AppMeasurement captures the click events, and tries to detect if the element clicked is an A
    // tag that contains an exit link. When that happens, it stops the initial event, sends a
    // beacon, clones the initial event and fires it again.
    // Reactor detects the click events first, because it's listeners are set on the capture phase.
    // We need to ignore the cloned event, otherwise the same rule will fire twice. AppMeasurement
    // sets `s_fe` attribute on the cloned event, and that is the flag we'll use to ignore these
    // fake events.
    // https://git.corp.adobe.com/analytics-platform/appmeasurement/blob/master/bin/js/src/AppMeasurement.js#L3196
    if (nativeEvent.s_fe) {
      return;
    }

    if (settings.delayLinkActivation) {
      if (!evaluatedEvents.has(nativeEvent)) {
        if (isNavigationLink(nativeEvent.target)) {
          nativeEvent.preventDefault();
          setTimeout(function() {
            window.location = nativeEvent.target.href;
          }, turbine.propertySettings.linkDelay || 100);
        }
        evaluatedEvents.set(nativeEvent, true);
      }
    }

    trigger(syntheticEvent);
  });
};

/**
 * @private
 * Clears all listeners. This should only be used in tests.
 */
module.exports.__reset = bubbly.__reset;
