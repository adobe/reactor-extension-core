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

var window = require('@adobe/reactor-window');
var triggers = [];

window.addEventListener('orientationchange', function (event) {
  if (triggers.length) {
    var syntheticEvent = {
      element: window,
      target: window,
      nativeEvent: event
    };

    triggers.forEach(function (trigger) {
      trigger(syntheticEvent);
    });
  }
});

/**
 * The orientationchange event. This event occurs when the orientation of the device has changed.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function (settings, trigger) {
  triggers.push(trigger);
};
