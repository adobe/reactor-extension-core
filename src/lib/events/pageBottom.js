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

function createPageBottomDelegate(pageLifecycleEvents) {
  /**
   * Page bottom event. This event occurs as soon as the user calls _satellite.pageBottom() (which is
   * supposed to be at the bottom of the page).
   * @param {Object} settings The event settings object.
   * @param {ruleTrigger} trigger The trigger callback.
   */
  return function (settings, trigger) {
    pageLifecycleEvents.registerPageBottomTrigger(trigger);
  };
}

export default createPageBottomDelegate;
