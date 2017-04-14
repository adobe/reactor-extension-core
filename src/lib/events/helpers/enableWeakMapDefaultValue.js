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

/**
 * Modifies a weakmap so that when get() is called with a key for which no entry is found,
 * a default value will be stored and then returned for the key.
 * @param {Object} weakMap The WeakMap instance to modify.
 * @param {Function} defaultValueFactory A function that returns the default value that should
 * be used.
 */
module.exports = function(weakMap, defaultValueFactory) {
  var originalGet = weakMap.get;

  weakMap.get = function(key) {
    if (!weakMap.has(key)) {
      weakMap.set(key, defaultValueFactory());
    }

    return originalGet.apply(this, arguments);
  };

  return weakMap;
};
