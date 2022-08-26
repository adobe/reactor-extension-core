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
var BASE_NAMESPACE = 'com.adobe.reactor.core';

module.exports = function (storageType, additionalNamespace) {
  var STORAGE_TYPE_UNAVAILABLE_ERROR =
    '"' + storageType + '" is not available on the window object.';
  var namespace = BASE_NAMESPACE + '.' + additionalNamespace;

  // When storage is disabled on Safari, the mere act of referencing window.localStorage
  // or window.sessionStorage throws an error. For this reason, we wrap in a try-catch.
  return {
    /**
     * Reads a value from storage.
     * @param {string} name The name of the item to be read.
     * @returns {string}
     */
    getItem: function (name) {
      try {
        return window[storageType].getItem(namespace + '.' + name);
      } catch (e) {
        turbine.logger.warn(STORAGE_TYPE_UNAVAILABLE_ERROR);
        return null;
      }
    },
    /**
     * Saves a value to storage.
     * @param {string} name The name of the item to be saved.
     * @param {string} value The value of the item to be saved.
     * @returns {boolean} Whether the item was successfully saved to storage.
     */
    setItem: function (name, value) {
      try {
        window[storageType].setItem(namespace + '.' + name, value);
        return true;
      } catch (e) {
        turbine.logger.warn(STORAGE_TYPE_UNAVAILABLE_ERROR);
        return false;
      }
    }
  };
};
