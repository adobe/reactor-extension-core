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

var debounce = require('./helpers/debounce');
var once = require('./helpers/once');

var history = window.history;
var lastURI = window.location.href;
var triggers = [];

/**
 * Replaces a method on an object with a proxy method only calls the original method but also
 * another explicitly defined function.
 * @param {Object} object The object containing the method to replace.
 * @param {String} methodName The name of the method to replace with the proxy method.
 * @param {Function} fn A function that should be called after the original method is called.
 */
var callThrough = function (object, methodName, fn) {
  var original = object[methodName];
  object[methodName] = function () {
    var returnValue = original.apply(object, arguments);
    fn.apply(null, arguments);
    return returnValue;
  };
};

/**
 * Calls all the trigger methods if the URI has changed.
 */
var callTriggersIfURIChanged = debounce(function () {
  var uri = window.location.href;
  if (lastURI !== uri) {
    triggers.forEach(function (trigger) {
      trigger();
    });

    lastURI = uri;
  }
}, 0);

/**
 * Starts watching for history changes.
 */
var watchForHistoryChange = once(function () {
  if (history) {
    if (history.pushState) {
      callThrough(history, 'pushState', callTriggersIfURIChanged);
    }

    if (history.replaceState) {
      callThrough(history, 'replaceState', callTriggersIfURIChanged);
    }
  }

  window.addEventListener('popstate', callTriggersIfURIChanged);
  window.addEventListener('hashchange', callTriggersIfURIChanged);
});

/**
 * History change event. This event occurs when the URL hash is changed or the URL is changed
 * through the <code>history</code> API.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function (settings, trigger) {
  watchForHistoryChange();
  triggers.push(trigger);
};
