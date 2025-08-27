/***************************************************************************************
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import isPlainObject from '../helpers/isPlainObject';

const clone = function (value) {
  if (isPlainObject(value)) {
    return deepMerge({}, value);
  }

  if (Array.isArray(value)) {
    return deepMerge([], value);
  }

  return value;
};

function deepMerge(target) {
  const sources = Array.prototype.slice.call(arguments, 1);
  return sources.reduce(function (merged, source) {
    if (source == null) {
      return merged;
    }

    Object.keys(source).forEach(function (key) {
      const mergedValue = merged[key];
      const sourceValue = source[key];

      if (sourceValue === undefined && mergedValue !== undefined) {
        return;
      }

      if (Array.isArray(mergedValue) && Array.isArray(sourceValue)) {
        merged[key] = mergedValue.concat(clone(sourceValue));
        return;
      }

      if (isPlainObject(mergedValue) && isPlainObject(sourceValue)) {
        merged[key] = deepMerge(mergedValue, sourceValue);
        return;
      }

      merged[key] = clone(sourceValue);
    });

    return merged;
  }, target);
}

export default deepMerge;
