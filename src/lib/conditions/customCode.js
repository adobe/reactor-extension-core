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
 * Custom code condition. This executes condition code provided by the user.
 * @param {Object} settings Condition settings.
 * @param {HTMLElement} [relatedElement] The element the rule was targeting.
 * @param {Function} settings.source The custom script function.
 * @param {Object} [event] The underlying event object the triggered the rule.
 * @param {Object} [event.target] The element where the event originated.
 * @returns {boolean}
 */
module.exports = function(settings, relatedElement, event) {
  return settings.source.call(
    relatedElement,
    event,
    event ? event.target : undefined);
};
