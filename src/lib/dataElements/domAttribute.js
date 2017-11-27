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
 * The dom data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.elementSelector The CSS selector for a DOM element.
 * @param {string} settings.elementProperty The name of the property or attribute of the DOM
 * element.
 * @returns {string}
 */
module.exports = function(settings) {
  var element = document.querySelector(settings.elementSelector);

  if (element) {
    var property = settings.elementProperty;

    if (property === 'text') {
      return element.innerText || element.textContent;
    } else if (property in element) {
      return element[property];
    } else {
      return element.getAttribute ? element.getAttribute(property) : undefined;
    }
  }
};
