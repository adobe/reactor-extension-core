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
 * Returns whether an element matches a selector.
 * @param {HTMLElement} element The HTML element being tested.
 * @param {string} selector The CSS selector.
 * @returns {boolean}
 */
module.exports = function(element, selector) {
  var matches = element.matches || element.msMatchesSelector;

  if (matches) {
    try {
      return matches.call(element, selector);
    } catch (error) {
      turbine.logger.warn('Matching element failed. ' + selector + ' is not a valid selector.');
      return false;
    }
  }

  return false;
};
