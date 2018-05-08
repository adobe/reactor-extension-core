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

var visitorTracking = require('../helpers/visitorTracking');
var getNamespacedStorage = require('../helpers/getNamespacedStorage');

var millisByUnit = {
  second: 1000,
  minute: 60000, // 60 seconds
  hour: 3600000, // 60 minutes
  day: 86400000, // 24 hours
  week: 604800000, // 7 days
  month: 2678400000, // 31 days
};

/**
 * Max frequency condition. Allows the condition to return true at a maximum frequency.
 * @param {Object} settings Condition settings.
 * @param {number} [settings.count] The number of units that defines the maximum frequency. This is
 * only optional if <code>settings.unit</code> is <code>visitor</code>.
 * @param {string} settings.unit The unit that defines the maximum frequency.
 * @returns {boolean}
 */
module.exports = function(settings, event) {
  // Note that our storage namespace incorporates the rule ID instead of the rule component ID
  // (because a rule component ID isn't available). This means that multiple Max Frequency
  // conditions on the same rule are using the same namespace. However, the storage key ALSO
  // incorporates the value of settings.unit. In other words, a Max Frequency condition using
  // a sessionPageView unit won't conflict with another Max Frequency condition using a
  // lifetimePageView unit. There IS the potential for a rule to have multiple Max Frequency
  // conditions that use the same unit, which would result in unexpected behavior. For example,
  // if a rule had two Max Frequency conditions using the pageView unit and one of the conditions
  // used a count of 3 and the other used a count of 4, the actions of the rule would never be
  // executed.
  var namespace = 'maxFrequency.' + event.$rule.id + '.';
  var maxFrequencyLocalStorage = getNamespacedStorage('localStorage', namespace);

  switch (settings.unit) {
    case 'pageView':
      var pageViewCount = visitorTracking.getLifetimePageViewCount();
      var lastRecordedPageViewCount = Number(maxFrequencyLocalStorage.getItem(settings.unit) || 0);
      if (pageViewCount - lastRecordedPageViewCount >= settings.count) {
        maxFrequencyLocalStorage.setItem(settings.unit, pageViewCount);
        return true;
      }
      break;
    case 'session':
      var sessionCount = visitorTracking.getSessionCount();
      var lastRecordedSessionCount = Number(maxFrequencyLocalStorage.getItem(settings.unit) || 0);
      if (sessionCount - lastRecordedSessionCount >= settings.count) {
        maxFrequencyLocalStorage.setItem(settings.unit, sessionCount);
        return true;
      }
      break;
    case 'visitor':
      // We don't support settings.count for visitor because that would require a server-side
      // component to track the number of visitors.
      if (!maxFrequencyLocalStorage.getItem('visitor')) {
        maxFrequencyLocalStorage.setItem('visitor', 'true');
        return true;
      }
      break;
    case 'second':
    case 'minute':
    case 'hour':
    case 'day':
    case 'week':
    case 'month':
      var time = new Date().getTime();
      var lastRecordedTime = Number(maxFrequencyLocalStorage.getItem(settings.unit) || 0);
      if (lastRecordedTime <= time - (settings.count * millisByUnit[settings.unit])) {
        maxFrequencyLocalStorage.setItem(settings.unit, time);
        return true;
      }
      break;
  }

  return false;
};

