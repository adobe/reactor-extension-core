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

import defaultWindow from '@adobe/reactor-window';

const BASE_NAMESPACE = 'com.adobe.reactor.core';

export default function getNamespacedStorage(
  storageType,
  additionalNamespace,
  win = defaultWindow
) {
  const STORAGE_TYPE_UNAVAILABLE_ERROR = `"${storageType}" is not available on the window object.`;
  const namespace = `${BASE_NAMESPACE}.${additionalNamespace}`;

  return {
    /**
     * Reads a value from storage.
     * @param {string} name The name of the item to be read.
     * @returns {string}
     */
    getItem(name) {
      try {
        return win[storageType].getItem(`${namespace}.${name}`);
      } catch (e) {
        turbine.logger.warn(STORAGE_TYPE_UNAVAILABLE_ERROR);
        return null;
      }
    },
    /**
     * Saves a value to storage.
     * @param {string} name The name of the item to be saved.
     * @param {string} value The value to be saved.
     */
    setItem(name, value) {
      try {
        win[storageType].setItem(`${namespace}.${name}`, value);
      } catch (e) {
        turbine.logger.warn(STORAGE_TYPE_UNAVAILABLE_ERROR);
      }
    },
    /**
     * Removes a value from storage.
     * @param {string} name The name of the item to be removed.
     */
    removeItem(name) {
      try {
        win[storageType].removeItem(`${namespace}.${name}`);
      } catch (e) {
        turbine.logger.warn(STORAGE_TYPE_UNAVAILABLE_ERROR);
      }
    }
  };
}
