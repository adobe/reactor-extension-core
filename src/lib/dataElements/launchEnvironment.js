/***************************************************************************************
 * (c) 2018 Adobe. All rights reserved.
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
 * The launch environment data element.
 * @param {Object} settings The data element settings object.
 * @param {string} settings.attribute The attribute that should be returned.
 * @returns {string}
 */
module.exports = function (settings,event) {
      switch (settings.attribute) {
        case 'buildDate':
          return turbine.buildInfo.buildDate;
        case 'environment':
          return turbine.buildInfo.environment;
        case 'property':
          return _satellite.property.name;
        case 'ruleName':
          return event.$rule.name;
        case 'ruleId':
          return event.$rule.id;
        case 'eventType':
          return event.$type;
        case 'eventDetail':
          return event.detail;
        case 'DCRIdentifier':
          return event.identifier;
      }
};