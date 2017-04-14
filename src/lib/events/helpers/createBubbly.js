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

var WeakMap = require('@turbine/weak-map');
var matchesProperties = require('./matchesProperties');
var matchesSelector = require('./matchesSelector');

/**
 * Handles logic related to bubbling options provided for many event types.
 */
module.exports = function() {
  var listeners = [];

  // It's important that a new weak map is created for each instance of bubbly in order to store
  // whether this particular bubbly instance has processed the event. More than one instance of
  // bubbly may process an event. No instance of bubbly should process an event more than once.
  var processedEvents = new WeakMap();

  var bubbly = {
    /**
     * Register a config object that should be evaluated for an event to determine if a rule
     * should be executed. If it should be executed, the callback function will be called.
     * @param {Object} settings The event config object.
     * @param {string} [settings.elementSelector] The CSS selector the element must match in order
     * for the rule to fire.
     * @param {Object[]} [settings.elementProperties] Property values the element must have in order
     * for the rule to fire.
     * @param {string} settings.elementProperties[].name The property name.
     * @param {string} settings.elementProperties[].value The property value.
     * @param {boolean} [settings.elementProperties[].valueIsRegex=false] Whether <code>value</code>
     * on the object instance is intended to be a regular expression.
     * @param {boolean} [settings.bubbleFireIfParent=false] Whether the rule should fire if the
     * event originated from a descendant element.
     * @param {boolean} [settings.bubbleFireIfChildFired=false] Whether the rule should fire if the
     * same event has already triggered a rule targeting a descendant element.
     * @param {boolean} [settings.bubbleStop=false] Whether the event should not trigger rules on
     * ancestor elements.
     * @param {Function} callback The function to be called when a matching event is seen. If the
     * callback does not end up triggering a rule, the callback should explicitly return false.
     */
    addListener: function(settings, callback) {
      listeners.push({
        settings: settings,
        callback: callback
      });
    },
    /**
     * Evaluate an event to determine if any rule targeting elements in the event target's DOM
     * hierarchy should be executed. Note that event.type is not inspected. This assumes that
     * all registered listeners care about this particular event type. Whether they
     * @param {Event} event The event that has occurred.
     * @param {HTMLElement} event.target The HTML element where the event originated.
     */
    evaluateEvent: function(event) {
      if (!listeners.length) {
        return;
      }

      // When an event is handled it is evaluated a single time but checks out which rules are
      // targeting elements starting at the target node and looking all the way up the element
      // hierarchy. This should only happen once regardless of how many listeners exist for the
      // event.
      if (processedEvents.has(event)) {
        return;
      }

      var node = event.target;
      var childHasTriggeredRule = false;

      // Loop through from the event target up through the hierarchy evaluating each node
      // to see if it matches any rules.
      while (node) {
        var preventEvaluationOnAncestors = false;

        var nodeTriggeredRule = false;

        // Just because this could be processed a lot, we'll use a for loop instead of forEach.
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          var elementSelector = listener.settings.elementSelector;
          var elementProperties = listener.settings.elementProperties;

          if (!listener.settings.bubbleFireIfChildFired && childHasTriggeredRule) {
            continue;
          }

          if (node !== event.target && !listener.settings.bubbleFireIfParent) {
            continue;
          }

          // If the user didn't specify elementSelector or elementProperties then they want the
          // rule to run whenever the event occurs on any element. They don't intend for the
          // rule to run for every node in the element hierarchy though.
          if (node !== event.target && !elementSelector &&
              (!elementProperties || !Object.keys(elementProperties).length)) {
            continue;
          }

          if (elementSelector && !matchesSelector(node, elementSelector)) {
            continue;
          }

          if (elementProperties && !matchesProperties(node, elementProperties)) {
            continue;
          }

          // The callback should return false if it didn't end up triggering a rule.
          var ruleTriggered = listener.callback(node, event) !== false;

          if (ruleTriggered) {
            nodeTriggeredRule = true;

            if (listener.settings.bubbleStop) {
              preventEvaluationOnAncestors = true;
            }
          }
        }

        if (preventEvaluationOnAncestors) {
          break;
        }

        if (nodeTriggeredRule) {
          childHasTriggeredRule = true;
        }

        node = node.parentNode;
      }

      processedEvents.set(event, true);
    }
  };

  /**
   * @private
   * Clears all listeners. This should only be used in tests.
   */
  bubbly.__reset = function() {
    listeners = [];
  };

  return bubbly;
};
