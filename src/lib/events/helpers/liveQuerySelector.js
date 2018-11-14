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
var POLL_INTERVAL = 3000;

var once = require('./once');
var WeakMap = require('./weakMap');
var calledCallbacksByElement = new WeakMap();

// Create a naked object with no prototype so we can safely use it as a map.
var callbacksBySelector = Object.create(null);

var findElements = function() {
  // Using for loops instead of forEach and functions because this will process a lot and we want
  // to be as efficient as possible.
  var selectors = Object.keys(callbacksBySelector);
  for (var i = 0; i < selectors.length; i++) {
    var selector = selectors[i];
    var callbacks = callbacksBySelector[selector];
    var elements = document.querySelectorAll(selector);

    for (var j = 0; j < callbacks.length; j++) {
      var callback = callbacks[j];

      for (var k = 0; k < elements.length; k++) {
        callback(elements[k]);
      }
    }
  }
};

var initializePolling = once(function() {
  setInterval(findElements, POLL_INTERVAL);
});

/**
 * Polls for elements added to the DOM matching a given selector.
 * @param {String} selector The CSS selector used to find elements.
 * @param {Function} callback A function that will be called once and only once for each element
 * found. The element will be passed to the callback.
 */
module.exports = function(selector, callback) {
  var callbacks = callbacksBySelector[selector];

  if (!callbacks) {
    callbacks = callbacksBySelector[selector] = [];
  }

  // This function will be called for every element found matching the selector but we will only
  // call the consumer's callback if it has not already been called for the element.
  callbacks.push(function(element) {
    var calledCallbacks = calledCallbacksByElement.get(element);

    if (!calledCallbacks) {
      calledCallbacks = new WeakMap();
      calledCallbacksByElement.set(element, calledCallbacks);
    }

    if (!calledCallbacks.has(callback)) {
      calledCallbacks.set(callback, true);
      callback(element);
    }
  });

  initializePolling();
};

/**
 * @private
 * Clears all listeners. This should only be used in tests.
 */
module.exports.__reset = function() {
  callbacksBySelector = Object.create(null);

  initializePolling = once(function() {
    setInterval(findElements, POLL_INTERVAL);
  });
};
