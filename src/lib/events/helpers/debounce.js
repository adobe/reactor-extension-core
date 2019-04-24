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

/**
 * Debounce function. Returns a proxy function that, when called multiple times, will only execute
 * the target function after a certain delay has passed without the proxy function being called
 * again.
 * @param {Function} fn The target function to call once the delay period has passed.
 * @param {number} delay The number of milliseconds that must pass before the target function is
 * called.
 * @param {Object} [context] The context in which to call the target function.
 * @returns {Function}
 */
module.exports = function(fn, delay, context) {
  var timeoutId = null;
  return function() {
    var ctx = context || this;
    var args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      fn.apply(ctx, args);
    }, delay);
  };
};
