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

/**
 * The random number data element.
 * @param {Object} settings The data element settings object.
 * @param {number} settings.min The minimum (inclusive) of the range from which to derive a
 * random number.
 * @param {number} settings.max The maximum (inclusive) of the range from which to derive a
 * random number.
 * @returns {number}
 */
export default function (settings) {
  const min = Math.ceil(settings.min);
  const max = Math.floor(settings.max);

  return min > max ? NaN : Math.floor(Math.random() * (max - min + 1)) + min;
}
