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

var once = require('@turbine/once');
var document = require('@turbine/document');
var visibilityApi = require('./helpers/visibilityApi')();
var hiddenProperty = visibilityApi.hiddenProperty;
var visibilityChangeEventType = visibilityApi.visibilityChangeEventType;

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

var watchForTabBlur = once(function() {
  document.addEventListener(visibilityChangeEventType, function() {
    if (document[hiddenProperty]) {
      triggers.forEach(function(trigger) {
        trigger();
      });
    }
  }, true);
});

/**
 * Tabblur event. This event occurs when a webpage is not visible or not in focus.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  watchForTabBlur();
  triggers.push(trigger);
};
