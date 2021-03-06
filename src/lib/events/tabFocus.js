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
var once = require('./helpers/once');
var visibilityApi = require('./helpers/visibilityApi')();
var hiddenProperty = visibilityApi.hiddenProperty;
var visibilityChangeEventType = visibilityApi.visibilityChangeEventType;

/**
 * All trigger methods registered for this event type.
 * @type {ruleTrigger[]}
 */
var triggers = [];

var watchForTabFocus = once(function () {
  document.addEventListener(
    visibilityChangeEventType,
    function () {
      if (!document[hiddenProperty]) {
        triggers.forEach(function (trigger) {
          trigger();
        });
      }
    },
    true
  );
});

/**
 * Tabfocus event. This event occurs when a webpage is visible or in focus. With tabbed browsing,
 * there is a reasonable chance that any given webpage is in the background and thus not
 * visible to the user.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function (settings, trigger) {
  watchForTabFocus();
  triggers.push(trigger);
};
