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
 * The custom code action. This loads and executes custom JavaScript or HTML provided by the user.
 * @param {Object} settings Action settings.
 * @param {string} settings.identifier The identifier of the "Direct Call" Event Type that should
 * be called.
 * @param {Array} settings.detail.eventObjectEntries A list of {key, value} tuples that will be
 * provided to _satellite.track as additional event detail.
 */
function createDirectCallActionDelegate(window) {
  return function (settings) {
    if (settings && settings.identifier) {
      var _detail = settings.detail;
      if (
        _detail &&
        Array.isArray(_detail.eventObjectEntries) &&
        _detail.eventObjectEntries.length
      ) {
        var detailEvent = {};
        // iterate over the array and build the object
        _detail.eventObjectEntries.forEach(function (tuple) {
          detailEvent[tuple.key] = tuple.value;
        });
        window._satellite.track(settings.identifier, detailEvent);
      } else {
        window._satellite.track(settings.identifier);
      }
    }
  };
}

export default createDirectCallActionDelegate;
