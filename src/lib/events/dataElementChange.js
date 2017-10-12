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

var POLL_INTERVAL = 1000;

var triggersByName = {};
var cachedStringifiedValueByName = {};

setInterval(function() {
  Object.keys(triggersByName).forEach(function(name) {
    var stringifiedValue = JSON.stringify(turbine.getDataElementValue(name));

    if (stringifiedValue !== cachedStringifiedValueByName[name]) {
      var syntheticEvent = {
        dataElementName: name
      };

      triggersByName[name].forEach(function(trigger) {
        trigger(syntheticEvent);
      });

      cachedStringifiedValueByName[name] = stringifiedValue;
    }
  });
}, POLL_INTERVAL);

/**
 * Data element change event. This event occurs whenever the given data element's value has changed.
 * @param {Object} settings The event settings object.
 * @param {string} settings.name The name of the data element.
 * @param {ruleTrigger} trigger The trigger callback.
 */
module.exports = function(settings, trigger) {
  var name = settings.name;
  var triggers = triggersByName[name];

  if (!triggers) {
    triggers = triggersByName[name] = [];
    cachedStringifiedValueByName[name] = JSON.stringify(turbine.getDataElementValue(name));
  }

  triggers.push(trigger);
};
