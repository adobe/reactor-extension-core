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
var bubbly = require('./helpers/createBubbly')();

var typesWatched = [];

/**
 * The custom event. When an event is seen with the specified type, the rule will be executed.
 * @param {Object} settings The event settings object.
 * @param {string} settings.type The custom event type.
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
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function (settings, trigger) {
  var type = settings.type;

  if (typesWatched.indexOf(type) === -1) {
    typesWatched.push(type);
    window.addEventListener(type, bubbly.evaluateEvent, true);
  }

  bubbly.addListener(settings, function (event) {
    if (event.nativeEvent.type === type) {
      // Copying detail up to the top-level makes it easier for users to consume and
      // makes it backward-compatible with DTM.
      event.detail = event.nativeEvent.detail;
      trigger(event);
    }
  });
};
