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

import textMatch from '../helpers/textMatch.js';

/**
 * Hash condition. Determines if the actual hash (URL fragment identifier) matches at least one
 * acceptable hash.
 * @param {Object} settings Condition settings.
 * @param {Object[]} settings.hashes Acceptable hashes.
 * @param {string} settings.hashes[].value An acceptable hash value
 * @param {boolean} [settings.hashes[].valueIsRegex=false] Whether <code>value</code> on the object
 * instance is intended to be a regular expression.
 * @returns {boolean}
 */
export default function (settings) {
  var hash = document.location.hash;
  return settings.hashes.some(function (acceptableHash) {
    var acceptableValue = acceptableHash.valueIsRegex
      ? new RegExp(acceptableHash.value, 'i')
      : acceptableHash.value;
    return textMatch(hash, acceptableValue);
  });
}
