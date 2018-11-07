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

var parseObjectPath = require('./parseObjectPath');

/**
 * Returns the deep property value of an object.
 * @param obj The object where the property will be searched.
 * @param objectPath The path of the object property to be returned.
 * The object path can use dot or bracket notation.
 *
 * @returns {*}
 */
module.exports = function(obj, objectPath) {
  var fragments = parseObjectPath(objectPath);
  var currentValue = obj;

  for (var i = 0, len = fragments.length; i < len; i++) {
    if (currentValue == null) {
      return undefined;
    }

    currentValue = currentValue[fragments[i]];
  }

  return currentValue;
};
