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

import visibilityApiFactory from './helpers/visibilityApi';
import once from './helpers/once';

function createTabBlurDelegate(document) {
  const visibilityApi = visibilityApiFactory();
  const hiddenProperty = visibilityApi.hiddenProperty;
  const visibilityChangeEventType = visibilityApi.visibilityChangeEventType;

  /**
   * All trigger methods registered for this event type.
   * @type {ruleTrigger[]}
   */
  const triggers = [];

  const watchForTabBlur = once(function () {
    document.addEventListener(
      visibilityChangeEventType,
      function () {
        if (document[hiddenProperty]) {
          triggers.forEach(function (trigger) {
            trigger();
          });
        }
      },
      true
    );
  });

  /**
   * Tabblur event. This event occurs when a webpage is not visible or not in focus.
   * @param {Object} settings The event settings object.
   * @param {ruleTrigger} trigger The trigger callback.
   */
  return function (settings, trigger) {
    watchForTabBlur();
    triggers.push(trigger);
  };
}

export default createTabBlurDelegate;
