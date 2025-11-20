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

import validateInjectedParams from '../../helpers/validate-injected-params.js';
import pageLifecycleEvents from './helpers/pageLifecycleEvents.js';

function injectLibraryLoaded({ pageLifecycleEvents }) {
  /**
   * Library loaded event. This event occurs as soon as the runtime library is loaded.
   * @param {Object} settings The event settings object.
   * @param {function} trigger The [rule]trigger callback.
   */
  return function libraryLoaded(settings, trigger) {
    pageLifecycleEvents.registerLibraryLoadedTrigger(trigger);
  };
}

const validateInjection = validateInjectedParams(injectLibraryLoaded);

export default validateInjection({
  pageLifecycleEvents
});

/* START.TESTS_ONLY */
export { validateInjection as injectLibraryLoaded };
/* END.TESTS_ONLY */
